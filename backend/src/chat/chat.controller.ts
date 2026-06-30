import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ChatService } from './chat.service.js';
import { SendMessageDto } from './dto/send-message.dto.js';
import { CurrentUser } from '@/common/decorators/current-user.decorator.js';
import type { SafeUser } from '@/common/constants/safe-user.constant.js';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  async getConversations(@CurrentUser() user: SafeUser) {
    const conversations = await this.chatService.getConversations(user.id);
    return { message: 'Conversations fetched', data: { conversations } };
  }

  @Post('conversations')
  async createConversation(@CurrentUser() user: SafeUser) {
    const conversation = await this.chatService.createConversation(user.id);
    return { message: 'Conversation created', data: { conversation } };
  }

  @Get('conversations/:id')
  async getConversation(@Param('id') id: string, @CurrentUser() user: SafeUser) {
    const result = await this.chatService.getConversationWithMessages(id, user.id);
    return { message: 'Conversation fetched', data: result };
  }

  @Delete('conversations/:id')
  async deleteConversation(@Param('id') id: string, @CurrentUser() user: SafeUser) {
    await this.chatService.deleteConversation(id, user.id);
    return { message: 'Conversation deleted' };
  }

  @Post('conversations/:id/messages')
  async sendMessage(
    @Param('id') id: string,
    @CurrentUser() user: SafeUser,
    @Body() dto: SendMessageDto,
    @Res() res: Response,
  ) {
    await this.chatService.sendMessage(id, user, dto, res);
  }
}
