import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { RequestResponseInterceptor } from './interceptors/request-response.interceptor';
import { LoggerService } from './services/logger.service';
import { join } from 'path';
import helmet from '@fastify/helmet';
import multiPart from '@fastify/multipart';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  // const httpsOptions = {
  //   key: readFileSync('./keys/private-key.pem'),
  //   cert: readFileSync('./keys/public-cert.pem'),
  // };

  const loggerService = new LoggerService();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: WinstonModule.createLogger(loggerService.createLoggerConfig),
    },
  );

  await app.register(helmet);
  await app.register(multiPart);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new RequestResponseInterceptor());
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  app.useStaticAssets({
    root: join(__dirname, '..', 'public'),
    prefix: '/public/',
  });

  app.setViewEngine({
    engine: {
      handlebars: require('handlebars'),
    },
    templates: join(__dirname, '..', 'templates'),
  });

  await app.listen(3000);

  // const server = app.getHttpServer();

  // const router = (server as any)._events.request._router;

  // const existingRoutes: [] = router.stack
  //   .map((routeObj) => {
  //     if (routeObj.route) {
  //       return {
  //         route: {
  //           path: routeObj.route?.path,
  //           method: routeObj.route?.stack[0].method,
  //         },
  //       };
  //     }
  //   })
  //   .filter((item) => item !== undefined);
  // console.log(existingRoutes);
}
bootstrap();
