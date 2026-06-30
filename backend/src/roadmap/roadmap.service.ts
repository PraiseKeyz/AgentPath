import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Roadmap, RoadmapDocument } from './schemas/roadmap.schema.js';
import { CreateMilestoneDto, UpdateMilestoneDto } from './dto/milestone.dto.js';

@Injectable()
export class RoadmapService {
  constructor(@InjectModel(Roadmap.name) private readonly roadmapModel: Model<RoadmapDocument>) {}

  async getRoadmap(userId: string): Promise<RoadmapDocument> {
    let roadmap = await this.roadmapModel.findOne({ userId }).exec();
    if (!roadmap) {
      roadmap = await this.roadmapModel.create({ userId });
    }
    return roadmap;
  }

  async addMilestone(userId: string, dto: CreateMilestoneDto): Promise<RoadmapDocument> {
    const milestone = {
      _id: new Types.ObjectId(),
      title: dto.title,
      description: dto.description ?? '',
      opportunityId: dto.opportunityId ? new Types.ObjectId(dto.opportunityId) : null,
      status: 'pending' as const,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      createdAt: new Date(),
    };

    return this.roadmapModel
      .findOneAndUpdate({ userId }, { $push: { milestones: milestone } }, { new: true, upsert: true })
      .exec() as Promise<RoadmapDocument>;
  }

  async updateMilestone(userId: string, milestoneId: string, dto: UpdateMilestoneDto): Promise<RoadmapDocument> {
    const update: Record<string, any> = {};
    for (const [key, value] of Object.entries(dto)) {
      if (value !== undefined) {
        update[`milestones.$.${key}`] = key === 'dueDate' ? new Date(value as string) : value;
      }
    }

    const roadmap = await this.roadmapModel
      .findOneAndUpdate(
        { userId, 'milestones._id': new Types.ObjectId(milestoneId) },
        { $set: update },
        { new: true },
      )
      .exec();

    if (!roadmap) throw new NotFoundException('Milestone not found');
    return roadmap;
  }

  async deleteMilestone(userId: string, milestoneId: string): Promise<RoadmapDocument> {
    const roadmap = await this.roadmapModel
      .findOneAndUpdate(
        { userId },
        { $pull: { milestones: { _id: new Types.ObjectId(milestoneId) } } },
        { new: true },
      )
      .exec();

    if (!roadmap) throw new NotFoundException('Roadmap not found');
    return roadmap;
  }
}
