import { Body, Controller, Post, Res, UseGuards, Req } from '@nestjs/common';
import { Response } from 'express';
import { AiChatRequestDto } from './dto/ai-chat.dto';
import { AichatService } from './aichat.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/auth/types/oauth.types';
import { StreamRateLimitGuard } from './guards/StreamRateLimitGuard';

@Controller('/chat')
export class AichatController {
  constructor(private readonly aichatService: AichatService) {}

  @Post()
  @UseGuards(JwtAuthGuard, StreamRateLimitGuard)
  async root(@Req() req: RequestWithUser, @Res() res: Response, @Body() body: AiChatRequestDto) {
    const userId = req.user.sub;

    const { result, chatId } = await this.aichatService.generateResponseStream(
      body.messages,
      userId,
      body.chatId
    );

    if (chatId) {
      res.setHeader('x-chat-id', chatId);
      res.setHeader('Access-Control-Expose-Headers', 'x-chat-id');
    }

    result.pipeUIMessageStreamToResponse(res);
  }
}
