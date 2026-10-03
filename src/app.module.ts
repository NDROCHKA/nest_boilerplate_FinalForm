import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import appConfig from './config/app.config';
import authConfig from './config/auth/auth.config';
import mailConfig from './config/mail/mail.config';
import databaseConfig from './database/config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { DataSource, DataSourceOptions } from 'typeorm';
import { MailModule } from './mail/mail.module';
import { FileModule } from './file/file.module';
import { HealthController } from './health/health.controller';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppThrottlerGuard } from './utils/guards/app-throttler.guard';

const infrastructureDatabaseModule = TypeOrmModule.forRootAsync({
  useClass: TypeOrmConfigService,
  dataSourceFactory: async (options: DataSourceOptions) => {
    return new DataSource(options).initialize();
  },
});
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig, appConfig, mailConfig],
      envFilePath: ['.env'],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 120,
      },
    ]),
    infrastructureDatabaseModule,
    UserModule,
    AuthModule,
    MailModule,
    FileModule,
    CategoryModule,
    ProductModule,
    OrderModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AppThrottlerGuard,
    },
  ],
  exports: [],
})
export class AppModule {}
