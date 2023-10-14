import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
  imports: [FirebaseModule]
})
export class UsersModule {}
