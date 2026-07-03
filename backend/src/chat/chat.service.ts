import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Conversation, ConversationDocument } from './schemas/conversation.schema.js';
import { Message, MessageDocument } from './schemas/message.schema.js';
import { AiService } from '@/ai/ai.service.js';
import type { SafeUser } from '@/common/constants/safe-user.constant.js';
import { SendMessageDto } from './dto/send-message.dto.js';
import type { Response } from 'express';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Conversation.name) private readonly conversationModel: Model<ConversationDocument>,
    @InjectModel(Message.name) private readonly messageModel: Model<MessageDocument>,
    private readonly aiService: AiService,
  ) {}

  async getConversations(userId: string) {
    return this.conversationModel.find({ userId }).sort({ updatedAt: -1 }).exec();
  }

  async createConversation(userId: string) {
    return this.conversationModel.create({ userId });
  }

  async getConversationWithMessages(id: string, userId: string) {
    const conversation = await this.conversationModel.findById(id).exec();
    if (!conversation) throw new NotFoundException('Conversation not found');
    if (conversation.userId.toString() !== userId) throw new ForbiddenException();

    const messages = await this.messageModel
      .find({ conversationId: new Types.ObjectId(id) })
      .sort({ createdAt: 1 })
      .exec();

    return { conversation, messages };
  }

  async deleteConversation(id: string, userId: string) {
    const conversation = await this.conversationModel.findById(id).exec();
    if (!conversation) throw new NotFoundException('Conversation not found');
    if (conversation.userId.toString() !== userId) throw new ForbiddenException();

    await this.messageModel.deleteMany({ conversationId: new Types.ObjectId(id) });
    await conversation.deleteOne();
  }

  async sendMessage(id: string, user: SafeUser, dto: SendMessageDto, res: Response) {
    const conversation = await this.conversationModel.findById(id).exec();
    if (!conversation) throw new NotFoundException('Conversation not found');
    if (conversation.userId.toString() !== user.id) throw new ForbiddenException();

    // Save the user message
    await this.messageModel.create({
      conversationId: new Types.ObjectId(id),
      role: 'user',
      content: dto.content,
    });

    // Update conversation title from first user message
    if (conversation.title === 'New conversation') {
      const title = dto.content.slice(0, 60);
      await this.conversationModel.findByIdAndUpdate(id, { title });
    }

    // Load full history for context
    const history = await this.messageModel
      .find({ conversationId: new Types.ObjectId(id) })
      .sort({ createdAt: 1 })
      .exec();

    // Stream AI response via SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let fullResponse = '';

    const stream = this.aiService.streamResponse(user, history);

    for await (const chunk of stream) {
      fullResponse += chunk;
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    }

    // Persist AI response
    await this.messageModel.create({
      conversationId: new Types.ObjectId(id),
      role: 'assistant',
      content: fullResponse,
    });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  }
}
