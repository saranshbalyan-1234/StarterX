import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { ValidationError } from 'express-validation';

import errorContstants from '#constants/error.constant.js';
import { encryptWithAES } from '#encryption/Service/aes.service.js';
import { abortSession, commitSession } from '#utils/Mongo/mongo.service.js';

import promMid from 'express-prometheus-middleware'

const setupTimeout = (app) => {
  if (!process.env.TIMEOUT) return console.log('Timeout is turned OFF');
  console.log(`Timeout is turned ON with ${process.env.TIMEOUT}`);
  app.use((_req, res, next) => {
    res.setTimeout(parseInt(process.env.TIMEOUT) || 60_000, () => {
      console.error('Request has timed out.');
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
      return { error: errorContstants.TOO_MANY_REQUEST, limit: process.env.RATE_LIMIT, limitWindow: `${process.env.RATE_LIMIT_WINDOW}ms`, type: 'RateLimitError', ...errorObj };
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
  if (!process.env.CORS) return;
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
  process.env.ENCRYPTION === 'true' ? console.log('ENCRYPTION is turned ON') : console.log('ENCRYPTION is turned OFF');
  app.use((req, res, next) => {
    const originalSend = res.send;

    res.send = function send (...args) {
      let errorObj = args[0];
      try {
        errorObj = JSON.parse(args[0]);
      } catch (e) {
        console.error('Not a JSON response');
      }
      if (errorObj && typeof errorObj === 'object' && errorObj.error) {
        errorObj.method = req.method;
        errorObj.path = req.url;
        errorObj.status = res.statusCode;
        args[0] = JSON.stringify(errorObj);
        abortSession(req);
      } else commitSession(req);
      if (process.env.ENCRYPTION === 'true' && !(req.url.includes('decrypt') || req.url.includes('encrypt'))) args[0] = JSON.stringify(encryptWithAES(args[0]));
      originalSend.apply(res, args);
    };

    next();
  });
};

const setupHtmlErrorInterceptor = (app) => {
  app.use((err, req, res, next) => {
    abortSession(req);
    const errorObj = getErrorObj(req, res);
    return res.status(403).json({
      error: err.message, type: err.message.includes('CORS') ? 'CORS' : err.name, ...errorObj, status: 403
    });
    // eslint-disable-next-line no-unreachable
    next(err);
  });
};

const setupValidationErrorInterceptor = (app) => {
  app.use((err, req, res, next) => {
    const errorObj = getErrorObj(req, res);
    if (err instanceof ValidationError) {
      const error = err.details.body?.[0].message || err.details.params?.[0].message || err.details.query?.[0].message || err.details.headers?.[0].message;
      return res.status(400).json({ error, type: 'ValidationError', ...errorObj });
    }
    next(err);
  });
};

const setupPrometheus = (app) => {
  app.use(promMid({
    metricsPath: '/metrics',
    collectDefaultMetrics: true,
    requestDurationBuckets: [0.1, 0.5, 1, 3, 5, 10],
    /**
     * Uncomenting the `authenticate` callback will make the `metricsPath` route
     * require authentication. This authentication callback can make a simple
     * basic auth test, or even query a remote server to validate access.
     * To access /metrics you could do:
     * curl -X GET user:password@localhost:9091/metrics
     */
    // authenticate: req => req.headers.authorization === 'Basic dXNlcjpwYXNzd29yZA==',
    /**
     * Uncommenting the `extraMasks` config will use the list of regexes to
     * reformat URL path names and replace the values found with a placeholder value
    */
    // extraMasks: [/..:..:..:..:..:../],
    /**
     * The prefix option will cause all metrics to have the given prefix.
     * E.g.: `app_prefix_http_requests_total`
     */
    // prefix: 'app_prefix_',
    /**
     * Can add custom labels with customLabels and transformLabels options
     */
    // customLabels: ['contentType'],
    // transformLabels(labels, req) {
    //   // eslint-disable-next-line no-param-reassign
    //   labels.contentType = req.headers['content-type'];
    // },
   }));
}


const getErrorObj = (req, res) => ({
  method: req.method,
  path: req.url,
  status: res.statusCode
});

export { setupCors, setupHtmlErrorInterceptor, setupRateLimiter, setupResponseInterceptor, setupTimeout, setupValidationErrorInterceptor,setupPrometheus };
