const errorContstants = {
  ACCESS_TOKEN_NOT_FOUND: 'Access Token Not Found',
  ACCOUNT_BLOCKED: 'Account Blocked!',
  ACCOUNT_DORMANT: 'Account Dormant, please check with admin.',
  ACCOUNT_INACTIVE: 'Account Inactive!',
  ACCOUNT_LOCKED: 'Account Locked!, please try again later.',
  CUSTOMER_DATABASE_ALREADY_EXIST: 'Customer Database Already Exists',
  EMAIL_ALREADY_VERIFIED: 'Email Already Verified',
  EMAIL_NOT_VERIFIED: 'Email Not Verified',
  ENDPOINT_NOT_FOUND: 'Endpoint Not Found!',
  INCORRECT_PASSWORD: (count) => `Incorrect Password, Remaining count: ${count}`,
  INSUFFICIENT_DETAILS: 'Insufficient Details!',
  INVALID_FILE: 'Invalid File',
  INVALID_FOLDER: 'Invalid Folder',
  INVALID_PERMISSION: 'Invalid Permission!',
  NOT_AN_ACTIVE_SESSION: 'Not An Active Session!',
  NO_FILES_UPLOADED: 'No Files Uploaded!',
  PASSWORD_RESET_REQUIRED: 'Password Reset Required',
  RECORD_NOT_FOUND: 'Record Not Found!',
  SESSION_OFF: 'Session Is OFF!',
  SOMETHING_WENT_WRONG: 'Something Went Wrong!',
  TIMEOUT: 'Timeout!',
  TOKEN_NOT_FOUND: 'Token Not Found',
  TOO_MANY_REQUEST: 'Too many requests, please try again later.',
  UNABLE_TO_DELETE_MASTER_DATABASE: 'Unable To Delete Master Database!',
  UNAUTHORIZED: 'Unauthorized!',
  UNAUTHORIZED_ORIGIN: 'Unauthorized Origin',
  UNAUTHORIZED_TENANT: 'Unauthorized Tenant!'
};
export default errorContstants;
