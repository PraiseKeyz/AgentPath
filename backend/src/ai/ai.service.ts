import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Groq from 'groq-sdk';
import type { SafeUser } from '@/common/constants/safe-user.constant.js';
import type { MessageDocument } from '@/chat/schemas/message.schema.js';
import { Opportunity, OpportunityDocument } from '@/opportunities/schemas/opportunity.schema.js';

// Swap AI_MODEL in .env to change models without touching code:
//   llama-3.3-70b-versatile  (default — best quality, free on Groq)
//   llama-3.1-8b-instant     (faster, lower latency)
//   mixtral-8x7b-32768       (large context window)

@Injectable()
export class AiService {
  private readonly groq: Groq;
  private readonly model: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Opportunity.name) private readonly opportunityModel: Model<OpportunityDocument>,
  ) {
    this.groq = new Groq({
      apiKey: this.configService.get<string>('GROQ_API_KEY'),
    });
    this.model =
      this.configService.get<string>('AI_MODEL') ?? 'llama-3.3-70b-versatile';
  }

  async *streamResponse(user: SafeUser, history: MessageDocument[]): AsyncGenerator<string> {
    const opportunities = await this.opportunityModel.find({ isActive: true }).exec();
    const systemPrompt = this.buildSystemPrompt(user, opportunities);

    const messages: Groq.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...history.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    ];

    const stream = await this.groq.chat.completions.create({
      model: this.model,
      max_tokens: 1024,
      messages,
      stream: true,
    });

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content;
      if (text) yield text;
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
              `- [${o.type.toUpperCase()}] "${o.title}" by ${o.provider}. ` +
              `Eligibility: ${o.eligibility}. ` +
              `Deadline: ${o.deadline ? o.deadline.toDateString() : 'Rolling/No deadline'}. ` +
              `Description: ${o.description}`,
          )
          .join('\n')
      : 'No opportunities are currently in the database.';

    return `You are AgentPath, an AI mentor for first-generation Nigerian university students.

Student profile:
- Name: ${user.name}
- University: ${user.university || 'not specified'}
- Course of study: ${user.courseOfStudy || 'not specified'}
- Year of study: Year ${user.yearOfStudy}
- ${goalsText}

Available opportunities in the AgentPath database:
${opportunitiesSummary}

Your core principle is AGENCY FIRST. You never open with a list of suggestions or resources. You always begin by asking the student what they think, what they want, or what is on their mind. You treat the student as a capable contributor, not a recipient.

Guidelines:
- Use warm, peer-like language. Never condescending.
- Always explain acronyms and jargon — assume no prior exposure to professional or academic norms.
- When a student asks about an opportunity, explain it in plain language before listing requirements.
- If they ask for help writing an essay or email, ask them what they want to say first, then help them shape it.
- Surface matching opportunities from the database list above, but only after engaging with the student and understanding what they need.
- If they seem lost or unsure, ask one focused question to help them find direction. Do not overwhelm them with options.

Remember: the most important thing John Amhanesi ever received was being asked "what do you think?" — give every student that same moment.`;
  }
}
