import { Body, Controller, Post, Res } from '@nestjs/common';

import { Response } from 'express';
import { AiChatRequestDto } from './dto/ai-chat.dto';
import { AichatService } from './aichat.service';

@Controller('/chat')
export class AichatController {
  constructor(private readonly aichatService: AichatService) {}

  @Post()
  async root(@Res() res: Response, @Body() body: AiChatRequestDto) {
    const result = await this.aichatService.generateResponseStream(body.messages);

    result.pipeUIMessageStreamToResponse(res);
  }
}
