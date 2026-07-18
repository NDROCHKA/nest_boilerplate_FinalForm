import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from './config/config.type';
import { validationOptions } from './utils/helpers';
import { ResponseTransformInterceptor } from './utils/interceptors/transform.interceptor';
import { ErrorHandlingInterceptor } from './utils/interceptors/error.interceptor';
import { ResolvePromisesInterceptor } from './utils/interceptors/serializer.interceptor';
import {
  createSwaggerDocumentBuilder,
  getSwaggerDarkCss,
  swaggerOptions,
} from './swagger-ui/swagger.config';
import { UserService } from './user/user.service';
import { RoleEnum } from './utils/enums/roles.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService<AllConfigType>);

  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    {
      exclude: ['/'],
    },
  );

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(new ValidationPipe(validationOptions));

  app.useGlobalInterceptors(
    // ResolvePromisesInterceptor is used to resolve promises in responses because class-transformer can't do it
    // https://github.com/typestack/class-transformer/issues/549
    new ResolvePromisesInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),// here ask 
    new ResponseTransformInterceptor(),
    new ErrorHandlingInterceptor(),
  );

  app.use(bodyParser.json({ limit: '50mb' })); // Set the limit to 50MB or any size you need
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // Enable CORS for your Vercel domain
  app.enableCors({
    origin: '*', // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true, // If you need to send cookies or authentication headers
  });

  const options = createSwaggerDocumentBuilder();
  const document = SwaggerModule.createDocument(app, options);
  const swaggerDarkCss = getSwaggerDarkCss();

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions,
    customCss: swaggerDarkCss,
  });

  // Idempotently seed default users on startup
  const userService = app.get(UserService);
  
  const superAdminEmail = 'cbksuperadmin@gmail.com';
  const existingSuperAdmin = await userService.findOneByEmail({ email: superAdminEmail });
  if (!existingSuperAdmin) {
    const superAdmin = await userService.create({
      createUserDto: {
        email: superAdminEmail,
        password: 'cbkthebest',
        firstName: 'Super',
        lastName: 'Admin',
        phoneNumber: '+1234567890',
        role: RoleEnum.superAdmin,
      },
    });
    await userService.markEmailVerified({ id: superAdmin.id });
    console.log('Seeded default superAdmin on startup: cbksuperadmin@gmail.com');
  }

  const userEmail = 'cbk@gmail.com';
  const existingUser = await userService.findOneByEmail({ email: userEmail });
  if (!existingUser) {
    const regularUser = await userService.create({
      createUserDto: {
        email: userEmail,
        password: 'cbkthebest',
        firstName: 'Regular',
        lastName: 'User',
        phoneNumber: '+1234567892',
        role: RoleEnum.user,
      },
    });
    await userService.markEmailVerified({ id: regularUser.id });
    console.log('Seeded default user on startup: cbk@gmail.com');
  }

  await app.listen(configService.getOrThrow('app.port', { infer: true }));
}
bootstrap();
