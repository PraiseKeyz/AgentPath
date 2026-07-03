import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Anthropic from '@anthropic-ai/sdk';
import type { SafeUser } from '@/common/constants/safe-user.constant.js';
import type { MessageDocument } from '@/chat/schemas/message.schema.js';
import { Opportunity, OpportunityDocument } from '@/opportunities/schemas/opportunity.schema.js';

@Injectable()
export class AiService {
  private readonly client: Anthropic;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Opportunity.name) private readonly opportunityModel: Model<OpportunityDocument>,
  ) {
    this.client = new Anthropic({
      apiKey: this.configService.get<string>('ANTHROPIC_API_KEY'),
    });
  }

  async *streamResponse(user: SafeUser, history: MessageDocument[]): AsyncGenerator<string> {
    // Query active opportunities to inject into system prompt
    const opportunities = await this.opportunityModel.find({ isActive: true }).exec();
    const systemPrompt = this.buildSystemPrompt(user, opportunities);

    const messages: Anthropic.MessageParam[] = history.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const stream = await this.client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        yield event.delta.text;
      }
    }
  }

  private buildSystemPrompt(user: SafeUser, opportunities: OpportunityDocument[]): string {
    const goalsText = user.goals.length
      ? `Their stated goals are: ${user.goals.join(', ')}.`
      : 'They have not stated specific goals yet.';

    const opportunitiesSummary = opportunities.length
      ? opportunities
          .map(
            (o) =>
              `- [${o.type.toUpperCase()}] "${o.title}" provided by ${o.provider}. Eligibility: ${o.eligibility}. Deadline: ${o.deadline ? o.deadline.toDateString() : 'N/A'}. Details: ${o.description}`,
          )
          .join('\n')
      : 'No opportunities are currently available in the database.';

    return `You are AgentPath, an AI mentor for first-generation Nigerian university students.

Student profile:
- Name: ${user.name}
- University: ${user.university || 'not specified'}
- Course of study: ${user.courseOfStudy || 'not specified'}
- Year of study: ${user.yearOfStudy}
- ${goalsText}

Available Opportunities in Database:
${opportunitiesSummary}

Your core principle is AGENCY FIRST. You never open with a list of suggestions or resources. You always begin by asking the student what they think, what they want, or what is on their mind. You treat the student as a capable contributor, not a recipient.

Guidelines:
- Use warm, peer-like language. Never condescending.
- Always explain acronyms and jargon — assume no prior exposure to professional or academic norms.
- When a student asks about an opportunity, explain it in plain language before listing requirements.
- If they ask for help writing an essay or email, ask them what they want to say first, then help them shape it.
- Surface matching opportunities from the "Available Opportunities in Database" list above, but only after engaging with the student and understanding what they need.
- If they seem lost or unsure, ask one focused question to help them find direction. Do not overwhelm them with options.

Remember: the most important thing John Amhanesi ever received was being asked "what do you think?" — give every student that same moment.`;
  }
}
