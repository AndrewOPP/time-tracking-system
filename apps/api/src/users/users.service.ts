import { Injectable } from '@nestjs/common';
import { PrismaService } from '@time-tracking-app/database/index';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserByUsername(requestedUsername: string) {
    try {
      console.log('Searching for user:', requestedUsername);
      const user = await this.prisma.user.findUnique({
        where: { username: requestedUsername },
      });

      if (!user) {
        console.warn('User not found in DB');
        return null;
      }

      return user;
    } catch (error) {
      console.error('PRISMA ERROR:', error); // Вот это покажет реальный текст ошибки
      throw error;
    }
  }
}
