import { Controller, Get, Post, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/auth/types/oauth.types';
import { ChatHistoryService } from './aichatHistory.service';

@Controller('/chat-history')
@UseGuards(JwtAuthGuard)
export class ChatHistoryController {
  constructor(private readonly chatHistoryService: ChatHistoryService) {}

  @Get()
  async getChats(@Req() req: RequestWithUser) {
    return this.chatHistoryService.getUserChats(req.user.sub);
  }

  @Post()
  async createChat(@Req() req: RequestWithUser) {
    return this.chatHistoryService.createChatSession(req.user.sub);
  }

  @Get(':id/messages')
  async getMessages(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.chatHistoryService.getChatMessages(id, req.user.sub);
  }

  @Delete(':id')
  async deleteChat(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.chatHistoryService.deleteChatSession(id, req.user.sub);
  }
}
