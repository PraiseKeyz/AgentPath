import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AiService } from './ai.service.js';
import { Opportunity, OpportunitySchema } from '@/opportunities/schemas/opportunity.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Opportunity.name, schema: OpportunitySchema }]),
  ],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
