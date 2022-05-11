import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
// import { ExceptionFilter } from './exception.filter';
import { AllExceptionsFilter } from './http-exception.filter';

// const microserviceOptions = {
//   transport: Transport.TCP,
//   options: {
//     host: process.env.LOCAL_HOST,
//     port: process.env.MICROSERVICE_PORT,
//   },
// };

// async function bootstrap() {
//   const app = await NestFactory.createMicroservice(AppModule, microserviceOptions);
//   app.useGlobalFilters(new AllExceptionsFilter());
//   app.listen();
// }

async function Localbootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted:true,
    skipMissingProperties: true
  }))
  app.useGlobalFilters(new AllExceptionsFilter());
  // app.useGlobalFilters(new ExceptionFilter());
  app.setGlobalPrefix('yspot/api/v1');
  const options = new DocumentBuilder()
  .setTitle("YSpot Apis")
  .setDescription("The objective of this project is to develop efficient mobile application on android and iOS technology a platform where the youth will be able to engage with their fellow peers and business who are looking for hiring.")
  .addBearerAuth({
    type: 'http',
    scheme: 'bearer',
    name: 'JWT',
    description: 'Enter JWT token'
  })
  .addBasicAuth()
  .build()
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api", app, document);
  app.listen(process.env.PORT || 3000);
}
// bootstrap();
Localbootstrap();
