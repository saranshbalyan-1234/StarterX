import morganBody from 'morgan-body';

const morgalApiLogger = (app) => {
  if (process.env.PRINT_API_REQ_RES === 'false') return console.log('API logger is turned OFF');
  console.log('API logger is turned ON');
  return morganBody(app, {
    includeNewLine: true,
    logReqHeaderList: ['x-project-id'],
    prettify: false,
    skip: (req) => req.method === 'OPTIONS',
    timezone: 'Asia/Kolkata'
  });
};

export default morgalApiLogger;
