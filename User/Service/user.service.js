import errorContstants from '#constants/error.constant.js';
import cache from '#utils/Cache/index.js';
import { createToken } from '#utils/jwt.js';
import { getTenantDB } from '#utils/Mongo/mongo.connection.js';

// eslint-disable-next-line  complexity
const loginWithCredentals = async ({ email, password, rememberMe, isPassRequired = true, tenant }) => {
  try {
    let db = await getTenantDB();
    const customer = await db.models.customer.findOne({ email });
    const remainingLoginAttempts = process.env.INCORRECT_PASS_LIMIT ? parseInt(process.env.INCORRECT_PASS_LIMIT) - customer.incorrectPasswordCount - 1 : 1;
    if (!customer) {
      const unverifiedUser = await db.models.unverified.findOne({ email });
      if (unverifiedUser) throw new Error(errorContstants.EMAIL_NOT_VERIFIED);
      else throw new Error(errorContstants.RECORD_NOT_FOUND);
    }

    if (customer.blocked) throw new Error(errorContstants.ACCOUNT_BLOCKED);
    const currentDate = new Date();
    const oneYearAgo = new Date().setFullYear(currentDate.getFullYear() - 1);
    if ((customer.lastLogin || currentDate) < oneYearAgo) {
      throw new Error(errorContstants.ACCOUNT_DORMANT);
    }
    if (remainingLoginAttempts <= 0) {
      await db.models.customer.updateOne({ email }, { incorrectPasswordCount: 0 }, { timestamps: false });
      await db.models.userlocked.create([{ customer: customer._id }]);
      throw new Error(errorContstants.ACCOUNT_LOCKED);
    }
    if (remainingLoginAttempts == 0) {
      const userlocked = await db.models.userlocked.findOne({ customer: customer._id });
      if (userlocked) throw new Error(errorContstants.ACCOUNT_LOCKED);
    }
    const currentTenant = tenant || customer.tenant[0];
    if (!currentTenant || !customer.tenant.includes(currentTenant)) throw new Error(errorContstants.UNAUTHORIZED_TENANT);

    const isAuthenticated = !isPassRequired || customer.password === password;

    if (!isAuthenticated) {
      await db.models.customer.findOneAndUpdate({ email }, { $inc: { incorrectPasswordCount: 1 } }, { timestamps: false });
      throw new Error(errorContstants.INCORRECT_PASSWORD(remainingLoginAttempts));
    }

    await db.models.userlocked.deleteMany({ customer: customer._id });
    await db.models.customer.updateOne({ email }, { incorrectPasswordCount: 0, lastLogin: new Date() }, { timestamps: false });

    db = await getTenantDB(currentTenant);
    const user = await db.models.user.findOne({ email }).populate('roles');
    if (!user) throw new Error(errorContstants.RECORD_NOT_FOUND);
    if (!user.active) throw new Error(errorContstants.ACCOUNT_INACTIVE);

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
