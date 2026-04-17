// import { Injectable } from '@nestjs/common';
// import { PrismaService } from '@time-tracking-app/database';

// const FRONTEND_URL = 'https://viso-web.onrender.com';

// @Injectable()
// export class AppService {
//   constructor(private readonly prisma: PrismaService) {}

//   async getHello(): Promise<string> {
//     return `Server is up, follow that link to open the project ${FRONTEND_URL} `;
//   }
// }

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@time-tracking-app/database';

// const FRONTEND_URL = 'https://viso-web.onrender.com';
const FRONTEND_URL = 'http://localhost:5173/';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello() {
    return { url: FRONTEND_URL };
  }
}
