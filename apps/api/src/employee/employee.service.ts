import { Injectable } from '@nestjs/common';
import { PrismaService } from '@time-tracking-app/database/index';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
}
