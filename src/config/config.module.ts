import { LoggerService } from 'src/common/logger/logger.service';

import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ConfigService } from './config.service';

const providers = [ConfigService, LoggerService];

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.production'],
    }),
  ],
  providers,
  exports: [...providers],
})
class ConfigurationModule {}
export { ConfigurationModule as ConfigModule };
