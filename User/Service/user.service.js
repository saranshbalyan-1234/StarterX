import errorContstants from '#constants/error.constant.js';
import cache from '#utils/Cache/index.js';
import { createToken } from '#utils/jwt.js';
import { getTenantDB } from '#utils/Mongo/mongo.connection.js';

const loginWithCredentals = async ({ email, password, rememberMe = false, isPassRequired = true, tenant }) => {
  try {
    const db = await getTenantDB(tenant);
    const user = await db.models.user.findOne({ email }).populate('roles');

    if (!user) {
      const defaultDb = await getTenantDB();
      const unverifiedUser = await defaultDb.models.unverified.findOne({ email });
      if (unverifiedUser) throw new Error(errorContstants.EMAIL_NOT_VERIFIED);
      else throw new Error(errorContstants.RECORD_NOT_FOUND);
    }
    if (user.status !== 'active') throw new Error(`Account is ${user.status}`);
    if (process.env.INCORRECT_PASS_LIMIT && user.incorrectPasswordCount >= parseInt(process.env.INCORRECT_PASS_LIMIT)) throw new Error(errorContstants.PASSWORD_RESET_REQUIRED);

    const isAuthenticated = !isPassRequired || user.password === password;

    if (!isAuthenticated) {
      db.models.user.findOneAndUpdate({ email }, { $inc: { incorrectPasswordCount: 1 } }, { timestamps: false });

      throw new Error(errorContstants.INCORRECT_PASSWORD);
    }

    db.models.user.updateOne({ email }, { incorrectPasswordCount: 0, lastLogin: new Date() }, { timestamps: false });

    const { _id } = user;

    // Below code is to generate token only, no logic
    const tokenData = { _id, email, tenant: user.tenant };
    const accessToken = createToken(
      { ...tokenData, roles: user.roles, superAdmin: user.superAdmin },
      process.env.JWT_ACCESS_SECRET,
      rememberMe ? process.env.JWT_ACCESS_REMEMBER_EXPIRATION : process.env.JWT_ACCESS_EXPIRATION
    );
    const refreshToken = createToken(tokenData, process.env.JWT_REFRESH_SECRET, rememberMe ? process.env.JWT_REFRESH_REMEMBER_EXPIRATION : process.env.JWT_REFRESH_EXPIRATION);
    if (process.env.JWT_ACCESS_CACHE) cache.set(`accesstoken_${email}`, accessToken, process.env.JWT_ACCESS_CACHE);

    const combinedUserData = { ...user, accessToken, refreshToken };
    delete combinedUserData.password;
    return combinedUserData;
  } catch (e) {
    throw new Error(e);
  }
};

export { loginWithCredentals };
