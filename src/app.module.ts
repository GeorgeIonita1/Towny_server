import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule, 
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    })
  ],
})
export class AppModule {}
