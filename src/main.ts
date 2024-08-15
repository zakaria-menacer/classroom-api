import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpResponseInterceptor } from './interceptors/http-response-interceptor.interceptor';
import {
  AxiosExceptionFilter,
  ExceptionFilter,
  PrismaExceptionFilter,
} from './exception-filters/exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new HttpResponseInterceptor(reflector)); // Apply the interceptor globally

  // interceptor globally
  app.useGlobalFilters(
    new ExceptionFilter(),
    new ExceptionFilter(),
    new AxiosExceptionFilter(),
    new PrismaExceptionFilter(),
  ); // filter order => (3rd , 2nd , 1st)

  app.setGlobalPrefix('/api/v1');

  // * swagger setup
  const config = new DocumentBuilder()
    .setTitle('Classroom API')
    // .setDescription('API for managing roles and permissions')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1', app, document);

  const port = process.env.PORT;
  app.use(helmet());
  await app.listen(port, () =>
    console.log(`server is listening on port ${port}`),
  );
}
bootstrap();
