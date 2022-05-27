import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
// import { ExceptionFilter } from './exception.filter';
import { AllExceptionsFilter } from './http-exception.filter';
import * as firebaseAdmin from 'firebase-admin';

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
  let firebaseConfig:any  = {
    apiKey: "AIzaSyAp2YHtgKStVVGH9d6e4p2XwXtarHsFdyU",
    authDomain: "yspot-a72f2.firebaseapp.com",
    projectId: "yspot-a72f2",
    storageBucket: "yspot-a72f2.appspot.com",
    messagingSenderId: "920595787966",
    appId: "1:920595787966:web:f8c45097096c92a7a8aeef",
    measurementId: "G-JKKMEVD51L" 
  }
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(
      "yspot-firebase.json",
    ),
  }); 
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
