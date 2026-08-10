import { Module } from '@nestjs/common';
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
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { DataSource, DataSourceOptions } from 'typeorm';
import { MailModule } from './mail/mail.module';
import { FileModule } from './file/file.module';
import { CategorySeedModule } from './database/seeds/relational/category/category-seed.module';
import { ProductSeedModule } from './database/seeds/relational/product/product-seed.module';

const infrastructureDatabaseModule = TypeOrmModule.forRootAsync({
  useClass: TypeOrmConfigService,
  dataSourceFactory: async (options: DataSourceOptions) => {
    return new DataSource(options).initialize();
  },
});
@Module({
  imports: [
    EventEmitterModule.forRoot(),

    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig, appConfig, mailConfig],
      envFilePath: ['.env'],
    }),
    infrastructureDatabaseModule,
    UserModule,
    AuthModule,
    MailModule,
    FileModule,
    CategoryModule,
    ProductModule,
    OrderModule,
    CategorySeedModule,
    ProductSeedModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
