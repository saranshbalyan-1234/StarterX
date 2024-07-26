import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { ValidationError } from 'express-validation';

import errorContstants from '#constants/error.constant.js';
import { encryptWithAES } from '#encryption/Service/aes.service.js';
const setupTimeout = (app) => {
  if (!process.env.TIMEOUT) return console.log('Timeout is turned OFF');
  console.log(`Timeout is turned ON with ${process.env.TIMEOUT}`);
  app.use((req, res, next) => {
    res.setTimeout(parseInt(process.env.TIMEOUT) || 60_000, () => {
      console.error('Request has timed out.', req);
      res.status(408).json({ error: errorContstants.TIMEOUT });
      res.json =
        res.send =
        res.sendFile =
        res.jsonP =
        res.end =
        res.sendStatus =
          function sendStatus () {
            return this;
          };
    });
    next();
  });
};

const setupRateLimiter = (app) => {
  if (!process.env.RATE_LIMIT_WINDOW || !process.env.RATE_LIMIT) return console.log('Rate Limiter is turned OFF');
  // app.set('trust proxy', true);
  console.log(`Rate Limiter is turned ON with ${process.env.RATE_LIMIT_WINDOW}:${process.env.RATE_LIMIT}`);
  const limiter = rateLimit({
    // Draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false,

    // 10 minutes
    limit: process.env.RATE_LIMIT,

    // Disable the `X-RateLimit-*` headers.
    message: (req, res) => {
      const errorObj = getErrorObj(req, res);
      return { error: errorContstants.TOO_MANY_REQUEST, limit: process.env.RATE_LIMIT, limitWindow: `${process.env.RATE_LIMIT_WINDOW}ms`, ...errorObj };
    },

    // Limit each IP to 100 requests per `window` (here, per 10 minutes).
    standardHeaders: 'draft-7',

    windowMs: process.env.RATE_LIMIT_WINDOW
    /*
     * Store: ... , // Use an external store for consistency across multiple server instances.
     * skip: (req) => req.url === '/reset',
     */
  });
  app.use(limiter);
};

const setupCors = (app) => {
  const whitelist = process.env.CORS.split(',');
  // Var whitelist = ['http://localhost:8000', 'http://localhost:8080']; //white list consumers
  const corsOptions = {
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept', 'x-project-id"'],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    origin: function origin (og, callback) {
      if (whitelist.indexOf(og) !== -1 || !process.env.CORS) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  };

  app.use(cors(corsOptions));
};

const setupResponseInterceptor = (app) => {
  console.log('Response Interceptor is Turned ON');
  app.use((req, res, next) => {
    const originalSend = res.send;

    res.send = async function send (...args) {
      let errorObj = args[0];
      try {
        errorObj = JSON.parse(args[0]);
      } catch (e) {
        console.error('Not a JSON response');
      }
      if (typeof errorObj === 'object' && errorObj.error) {
        errorObj.method = req.method;
        errorObj.path = req.url;
        errorObj.status = res.statusCode;
        args[0] = JSON.stringify(errorObj);
        if (req.session) {
          await req.session.abortTransaction();
          req.session.endSession();
        }
      } else if (req.session) await req.session.commitTransaction();
      if (process.env.ENCRYPTION === 'true' && !(req.url.includes('decrypt') || req.url.includes('encrypt'))) args[0] = JSON.stringify(encryptWithAES(args[0]));
      // Console.log(result)
      originalSend.apply(res, args);
    };

    next();
  });
};

const setupErrorInterceptor = (app) => {
  console.log('ERROR Interceptor is Turned ON');
  app.use(async (err, req, res, next) => {
    const errorObj = getErrorObj(req, res);
    const error = String(err);
    if (error === 'Error: Not allowed by CORS') {
      return res.status(403).json({
        ...errorObj, error: 'Not allowed by CORS', status: 403
      });
    } else if (error) {
      console.debug(error);
      await req.session.abortTransaction();
      req.session.endSession();

      return res.status(403).json({
        error,
        errorObj,
        status: 403
      });
    }
    next(err);
  });
};

const setupValidationErrorInterceptor = (app) => {
  app.use((err, req, res, next) => {
    const errorObj = getErrorObj(req, res);
    if (err instanceof ValidationError) {
      const error = err.details.body?.[0].message || err.details.params?.[0].message || err.details.query?.[0].message || err.details.headers?.[0].message;
      console.error(error);
      return res.status(400).json({ error, ...errorObj });
    }
    next(err);
  });
};

const getErrorObj = (req, res) => ({
  method: req.method,
  path: req.url,
  status: res.statusCode
});

export { setupCors, setupErrorInterceptor, setupRateLimiter, setupResponseInterceptor, setupTimeout, setupValidationErrorInterceptor };
