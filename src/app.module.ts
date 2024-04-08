import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { MongooseConfigService } from './config/MongooseConfigService';
import configuration from './config/configuration';
import { CostsModule } from './costs/costs.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,
    CostsModule,
    AuthModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongooseConfigService,
    }),
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
})
export class AppModule {}
