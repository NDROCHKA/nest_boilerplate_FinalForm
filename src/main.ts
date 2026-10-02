import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
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

interface ProxyConfigurableServer {
  set(setting: 'trust proxy', value: number): void;
}

const isProxyConfigurableServer = (
  value: unknown,
): value is ProxyConfigurableServer =>
  typeof value === 'object' &&
  value !== null &&
  'set' in value &&
  typeof value.set === 'function';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService<AllConfigType>);
  const nodeEnv = configService.getOrThrow('app.nodeEnv', { infer: true });
  const frontendDomain = configService.get('app.frontendDomain', {
    infer: true,
  });
  const uploadsDirectory = configService.getOrThrow('app.uploadsDirectory', {
    infer: true,
  });
  const trustProxyHops = configService.getOrThrow('app.trustProxyHops', {
    infer: true,
  });

  if (trustProxyHops > 0) {
    const server: unknown = app.getHttpAdapter().getInstance();
    if (!isProxyConfigurableServer(server)) {
      throw new Error(
        'The configured HTTP adapter does not support trust proxy',
      );
    }
    server.set('trust proxy', trustProxyHops);
  }

  app.enableShutdownHooks();
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ limit: '1mb', extended: true }));
  app.use(
    '/uploads',
    express.static(uploadsDirectory, {
      dotfiles: 'deny',
      fallthrough: false,
      setHeaders: (response) => {
        response.setHeader('X-Content-Type-Options', 'nosniff');
        response.setHeader(
          'Cache-Control',
          'public, max-age=31536000, immutable',
        );
      },
    }),
  );

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
    new ClassSerializerInterceptor(app.get(Reflector)),
    new ResponseTransformInterceptor(),
    new ErrorHandlingInterceptor(),
  );

  app.enableCors({
    origin: frontendDomain ?? false,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: false,
  });

  if (nodeEnv !== 'production') {
    const options = createSwaggerDocumentBuilder();
    const document = SwaggerModule.createDocument(app, options);
    const swaggerDarkCss = getSwaggerDarkCss();

    SwaggerModule.setup('docs', app, document, {
      swaggerOptions,
      customCss: swaggerDarkCss,
    });
  }

  await app.listen(
    configService.getOrThrow('app.port', { infer: true }),
    '0.0.0.0',
  );
}

void bootstrap().catch((error: unknown) => {
  const logger = new Logger('Bootstrap');
  logger.error(
    'Application failed to start',
    error instanceof Error ? error.stack : String(error),
  );
  process.exitCode = 1;
});
