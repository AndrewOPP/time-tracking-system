import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@time-tracking-app/database/index';

@Injectable()
export class ChatHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserChats(userId: string) {
    return this.prisma.chatSession.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        updatedAt: true,
      },
    });
  }

  async getChatMessages(sessionId: string, userId: string) {
    const session = await this.prisma.chatSession.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) {
      throw new NotFoundException('Chat session not found');
    }

    return this.prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        role: true,
        content: true,
      },
    });
  }

  async createChatSession(userId: string, title: string = 'New Chat') {
    if (!userId) {
      throw new Error('UserId is required to create a chat session');
    }

    return this.prisma.chatSession.create({
      data: {
        title,
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  async deleteChatSession(sessionId: string, userId: string) {
    const session = await this.prisma.chatSession.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) {
      throw new NotFoundException('Chat session not found or access denied');
    }

    return this.prisma.chatSession.delete({
      where: { id: sessionId },
    });
  }

  async saveMessage(sessionId: string, role: string, content: string) {
    return this.prisma.chatMessage.create({
      data: {
        role,
        content,
        session: {
          connect: { id: sessionId },
        },
      },
    });
  }

  async updateChatTitle(sessionId: string, title: string) {
    return this.prisma.chatSession.update({
      where: { id: sessionId },
      data: { title: title.substring(0, 50) },
    });
  }
}
