import { Module } from '@nestjs/common';
import { UserController } from './employee.controller';
import { UserService } from './employee.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
