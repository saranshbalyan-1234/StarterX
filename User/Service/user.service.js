import errorContstants from '#constants/error.constant.js';
import cache from '#utils/Cache/index.js';
import { getTenantDB } from '#utils/Database/mongo.connection.js';
import { createToken } from '#utils/jwt.js';

const loginWithCredentals = async ({ email, password, rememberMe, isPassRequired = true, tenant }) => {
  try {
    let db = await getTenantDB();
    const customer = await db.models.customer.findOne({ email });

    if (customer) {
      if (customer.blocked) throw new Error(errorContstants.ACCOUNT_BLOCKED);
    } else {
      const unverifiedUser = await db.models.unverified.findOne({ email });
      if (unverifiedUser) throw new Error(errorContstants.EMAIL_NOT_VERIFIED);
      else throw new Error(errorContstants.RECORD_NOT_FOUND);
    }
    const currentTenant = tenant || customer.tenant[0];
    if (!currentTenant || !customer.tenant.includes(currentTenant)) throw new Error(errorContstants.UNAUTHORIZED_TENANT);

    const isAuthenticated = !isPassRequired || customer.password === password;
    if (!isAuthenticated) throw new Error(errorContstants.INCORRECT_PASSWORD);

    db = await getTenantDB(currentTenant);
    const user = await db.models.user.findOneAndUpdate({ email }, { lastLogin: new Date() }, { new: true, timestamps: false, upsert: true }).populate('roles');
    if (!user) throw new Error(errorContstants.RECORD_NOT_FOUND);
    const { _id } = user;

    // Below code is to generate token only, no logic
    const tokenData = { _id, currentTenant, email, tenant: customer.tenant };
    const accessToken = createToken(
      { ...tokenData, roles: user.roles, superAdmin: customer.superAdmin },
      process.env.JWT_ACCESS_SECRET,
      rememberMe ? process.env.JWT_ACCESS_REMEMBER_EXPIRATION : process.env.JWT_ACCESS_EXPIRATION
    );
    const refreshToken = createToken(tokenData, process.env.JWT_REFRESH_SECRET, rememberMe ? process.env.JWT_REFRESH_REMEMBER_EXPIRATION : process.env.JWT_REFRESH_EXPIRATION);
    if (process.env.JWT_ACCESS_CACHE) cache.set(`accesstoken_${email}`, accessToken, process.env.JWT_ACCESS_CACHE);

    const combinedUserData = { ...customer, ...user, accessToken, currentTenant, refreshToken };
    delete combinedUserData.password;
    return combinedUserData;
  } catch (e) {
    throw new Error(e);
  }
};

export { loginWithCredentals };
