import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OpportunitiesService } from './opportunities.service.js';
import { OpportunitiesController } from './opportunities.controller.js';
import { Opportunity, OpportunitySchema } from './schemas/opportunity.schema.js';

@Module({
  imports: [MongooseModule.forFeature([{ name: Opportunity.name, schema: OpportunitySchema }])],
  controllers: [OpportunitiesController],
  providers: [OpportunitiesService],
  exports: [OpportunitiesService],
})
export class OpportunitiesModule {}
