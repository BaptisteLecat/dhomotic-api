import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../app.module';

const config = new DocumentBuilder()
  .setTitle('API ChatGPT')
  .setDescription('API ChatGPT pour les entreprises')
  .setVersion('1.0')
  .addTag('Discussions')
  .setExternalDoc('Postman Collection', '/docs-json')
  .build();

const options = new DocumentBuilder()
  .setTitle('API ChatGPT')
  .setDescription('API ChatGPT pour les entreprises')
  .setVersion('1.0')
  .addTag('Discussions')
  .setExternalDoc('Postman Collection', '/docs-json')
  .addApiKey(
    {
      type: 'apiKey',
      name: 'api-key', // Nom de l'en-tête de la clé d'API
      in: 'header',
    },
    "ApiKey"
  )
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
    'JWT-auth'
  )
  .build();

export const swaggerOptions = {
  ...options,
  swaggerDefinition: {
    openapi: '3.0.0', // version d'OpenAPI
    info: config, // informations sur l'API
  },
  apis: [`${__dirname}/../modules/**/*.controller.ts`],
};

