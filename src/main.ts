import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as cors from 'cors'

function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('Title here')
    .setDescription('Description here')
    .setVersion('1.0.0')
    .addTag('users')
    .addTag('auth')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api', app, document)
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cors())
  setupSwagger(app)

  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
