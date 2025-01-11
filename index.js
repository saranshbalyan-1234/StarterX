import '#utils/ApiError.js';

import parser from 'body-parser';
import express from 'express';
import fileupload from 'express-fileupload';
// Import { scheduleInit } from "#scheduler/Service/schedulerService.js";
import expressListRoutes from 'express-list-routes';
import helmet from 'helmet';
import '#notification/Whatsapp/whatsapp.service.js'

import defaultMiddleware from '#middlewares/default.middleware.js';
import { setupCors, setupHtmlErrorInterceptor, setupRateLimiter, setupResponseInterceptor, setupTimeout, setupValidationErrorInterceptor } from '#middlewares/server.middleware.js';
import seedSuperAdmin from '#user/Seed/superadmin.seed.js';
import morgalApiLogger from '#utils/Logger/api.logger.js';
import overrideConsole from '#utils/Logger/console.logger.js';
import { getTenantDB } from '#utils/Mongo/mongo.connection.js';
import registerRoutes from '#utils/registerRoutes.js';

const app = express();

app.use(express.static('assets'));
app.use(defaultMiddleware());

overrideConsole();

/*
 * console.debug('======================ENV======================');
 * console.debug(process.env);
 * console.debug('======================ENV======================');
 */

await getTenantDB().then(() => seedSuperAdmin());

app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
app.use(helmet());
app.use(fileupload());
app.enable('strict routing');

setupCors(app);
setupTimeout(app);
setupRateLimiter(app);
morgalApiLogger(app);
setupHtmlErrorInterceptor(app);
setupResponseInterceptor(app);

await registerRoutes(app);

expressListRoutes(app);
setupValidationErrorInterceptor(app);

app.listen(process.env.PORT, () => {
  console.success(`Server started on PORT ${process.env.PORT} PROCESS_ID ${process.pid}`);
  // ScheduleInit();
});

process.on('uncaughtException', (err) => console.log('Caught uncought exception: ', err));
