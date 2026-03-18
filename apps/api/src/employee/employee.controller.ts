import { Controller, UseGuards } from '@nestjs/common';
import { UserService } from './employee.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //   @Get
  //   getUserByUserame;
}
