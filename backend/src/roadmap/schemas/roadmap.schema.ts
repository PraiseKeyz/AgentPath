import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RoadmapDocument = Roadmap & Document;

@Schema({ _id: true, timestamps: false })
export class Milestone {
  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'Opportunity', default: null })
  opportunityId: Types.ObjectId;

  @Prop({ enum: ['pending', 'in_progress', 'done'], default: 'pending' })
  status: 'pending' | 'in_progress' | 'done';

  @Prop({ type: Date, default: null })
  dueDate: Date | null;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const MilestoneSchema = SchemaFactory.createForClass(Milestone);

@Schema({ timestamps: true })
export class Roadmap {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ type: [MilestoneSchema], default: [] })
  milestones: Milestone[];
}

export const RoadmapSchema = SchemaFactory.createForClass(Roadmap);
