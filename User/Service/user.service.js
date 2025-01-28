import errorContstants from '#constants/error.constant.js';
import cache from '#utils/Cache/index.js';
import { createToken } from '#utils/jwt.js';
import { getTenantDB } from '#utils/Mongo/mongo.connection.js';

const loginWithCredentals = async ({ email, password, rememberMe, isPassRequired = true, tenant }) => {
  try {
    let db = await getTenantDB();
    const customer = await db.models.customer.findOne({ email });

    await checkIfCustomerUnverified(customer, email, db);
    checkIfCustomerBlocked(customer);
    checkIfCustomerDormant(customer);
    const currentTenant = tenant || customer.tenant[0];
    checkIfCustomerTenantAuthroized(customer, currentTenant);

    db = await getTenantDB(currentTenant);
    const user = await db.models.user.findOne({ email }).populate('roles');
    await checkIfCustomerPasswordCorrect(user, customer, email, password, isPassRequired, db);
    checkIfUserActive(user);

    const { accessToken, refreshToken } = generateTokens(customer, user, currentTenant, email, rememberMe);

    const combinedUserData = { ...customer, ...user, accessToken, currentTenant, refreshToken };
    delete combinedUserData.password;
    return combinedUserData;
  } catch (e) {
    throw new Error(e);
  }
};

const checkIfCustomerDormant = (customer) => {
  try {
    const currentDate = new Date();
    const oneYearAgo = new Date().setFullYear(currentDate.getFullYear() - 1);
    if ((customer.lastLogin || currentDate) < oneYearAgo) {
      throw new Error(errorContstants.ACCOUNT_DORMANT);
    }
  } catch (e) {
    throw new Error(e);
  }
};

const checkIfCustomerBlocked = (customer) => {
  try {
    if (customer.blocked) throw new Error(errorContstants.ACCOUNT_BLOCKED);
  } catch (e) {
    throw new Error(e);
  }
};

const checkIfCustomerUnverified = async (customer, email, db) => {
  try {
    if (!customer) {
      const unverifiedUser = await db.models.unverified.findOne({ email });
      if (unverifiedUser) throw new Error(errorContstants.EMAIL_NOT_VERIFIED);
      else throw new Error(errorContstants.RECORD_NOT_FOUND);
    }
  } catch (e) {
    throw new Error(e);
  }
};

const checkIfCustomerPasswordCorrect = async (user, customer, email, password, isPassRequired, db) => {
  try {
    const remainingLoginAttempts = process.env.INCORRECT_PASS_LIMIT ? parseInt(process.env.INCORRECT_PASS_LIMIT) - user.incorrectPasswordCount - 1 : 1;
    const isAuthenticated = !isPassRequired || customer.password === password;
    if (remainingLoginAttempts <= 0) {
      await db.models.user.updateOne({ email }, { incorrectPasswordCount: 0 }, { timestamps: false });
      await db.models.userlocked.create([{ customer: user._id }]);
      throw new Error(errorContstants.ACCOUNT_LOCKED);
    } else {
      const userlocked = await db.models.userlocked.findOne({ customer: user._id });
      if (userlocked) throw new Error(errorContstants.ACCOUNT_LOCKED);
    }

    if (isAuthenticated) {
      await db.models.userlocked.deleteMany({ customer: user._id });
      await db.models.user.updateOne({ email }, { incorrectPasswordCount: 0, lastLogin: new Date() }, { timestamps: false });
    } else {
      await db.models.user.findOneAndUpdate({ email }, { $inc: { incorrectPasswordCount: 1 } }, { timestamps: false });
      throw new Error(errorContstants.INCORRECT_PASSWORD(remainingLoginAttempts));
    }
  } catch (e) {
    throw new Error(e);
  }
};

const checkIfCustomerTenantAuthroized = (customer, currentTenant) => {
  try {
    if (!currentTenant || !customer.tenant.includes(currentTenant)) throw new Error(errorContstants.UNAUTHORIZED_TENANT);
  } catch (e) {
    throw new Error(e);
  }
};

const checkIfUserActive = (user) => {
  try {
    if (!user) throw new Error(errorContstants.RECORD_NOT_FOUND);
    if (!user.active) throw new Error(errorContstants.ACCOUNT_INACTIVE);
  } catch (e) {
    throw new Error(e);
  }
};

const generateTokens = (customer, user, currentTenant, email, rememberMe) => {
  try {
    const tokenData = { _id: user._id, currentTenant, email, tenant: customer.tenant };
    const accessToken = createToken(
      { ...tokenData, roles: user.roles, superAdmin: customer.superAdmin },
      process.env.JWT_ACCESS_SECRET,
      rememberMe ? process.env.JWT_ACCESS_REMEMBER_EXPIRATION : process.env.JWT_ACCESS_EXPIRATION
    );
    const refreshToken = createToken(tokenData, process.env.JWT_REFRESH_SECRET, rememberMe ? process.env.JWT_REFRESH_REMEMBER_EXPIRATION : process.env.JWT_REFRESH_EXPIRATION);
    if (process.env.JWT_ACCESS_CACHE) cache.set(`accesstoken_${email}`, accessToken, process.env.JWT_ACCESS_CACHE);
    return { accessToken, refreshToken };
  } catch (e) {
    throw new Error(e);
  }
};

export { loginWithCredentals };
