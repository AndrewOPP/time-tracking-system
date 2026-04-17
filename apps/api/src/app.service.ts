import { Injectable } from '@nestjs/common';
import { PrismaService } from '@time-tracking-app/database';

// const FRONTEND_URL = 'https://viso-web.onrender.com';
const FRONTEND_URL = process.env.FRONTEND_URL;

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello() {
    return { url: FRONTEND_URL };
  }
}
