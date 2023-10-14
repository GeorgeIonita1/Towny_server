import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [
    AuthModule, 
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FirebaseModule
  ],
})
export class AppModule {}
