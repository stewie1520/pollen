import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { commands } from './commands';
import { CoreModule } from './core/core.module';
import { DatabaseModule } from './shared/database/database.module';
import { HealthCheckModule } from './shared/healthcheck/healthcheck.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    HealthCheckModule,
    CoreModule,
  ],
  providers: [...commands],
})
export class AppModule {}
