import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Opportunity, OpportunityDocument } from './schemas/opportunity.schema.js';

@Injectable()
export class OpportunitiesService {
  constructor(
    @InjectModel(Opportunity.name) private readonly opportunityModel: Model<OpportunityDocument>,
  ) {}

  async findAll(query: { type?: string; tag?: string; q?: string }) {
    const filter: FilterQuery<OpportunityDocument> = { isActive: true };

    if (query.type) filter.type = query.type;
    if (query.tag) filter.tags = query.tag;
    if (query.q) {
      filter.$or = [
        { title: { $regex: query.q, $options: 'i' } },
        { description: { $regex: query.q, $options: 'i' } },
        { provider: { $regex: query.q, $options: 'i' } },
      ];
    }

    return this.opportunityModel.find(filter).sort({ deadline: 1 }).exec();
  }

  async findById(id: string) {
    const opportunity = await this.opportunityModel.findById(id).exec();
    if (!opportunity) throw new NotFoundException('Opportunity not found');
    return opportunity;
  }
}
