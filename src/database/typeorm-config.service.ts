import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';
import { AllConfigType } from '../config/config.type';

class CamelCaseNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface
{
  columnName(propertyName: string, customName: string): string {
    return customName || propertyName;
  }
}

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService<AllConfigType>) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const database = this.configService.getOrThrow('database', { infer: true });
    const options: TypeOrmModuleOptions = {
      type: 'postgres',
      url: database.url,
      host: database.host,
      port: database.port,
      username: database.username,
      password: database.password,
      database: database.name,
      synchronize: database.synchronize,
      dropSchema: false,
      logging: false,
      namingStrategy: new CamelCaseNamingStrategy(),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      extra: {
        // based on https://node-postgres.com/apis/pool
        // max connection pool size
        max: database.maxConnections,
        // Prevent runaway transactions - auto-terminate after 5 minutes in prod, 10 minutes in dev
        idle_in_transaction_session_timeout: 30000, // 30 seconds for ALL environments
        ssl: database.sslEnabled
          ? {
              rejectUnauthorized: database.rejectUnauthorized,
              ca: database.ca,
              key: database.key,
              cert: database.cert,
            }
          : undefined,
      },
    };
    return options;
  }
}
