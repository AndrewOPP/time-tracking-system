import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';

import { Response } from 'express';
import { AiChatRequestDto } from './dto/ai-chat.dto';
import { AichatService } from './aichat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('/chat')
export class AichatController {
  constructor(private readonly aichatService: AichatService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async root(@Res() res: Response, @Body() body: AiChatRequestDto) {
    const result = await this.aichatService.generateResponseStream(body.messages);

    result.pipeUIMessageStreamToResponse(res);
  }
}
