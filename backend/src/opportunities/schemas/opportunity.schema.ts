import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OpportunityDocument = Opportunity & Document;

@Schema({ timestamps: true })
export class Opportunity {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    enum: ['scholarship', 'fellowship', 'internship', 'competition', 'grant'],
    required: true,
  })
  type: string;

  @Prop({ required: true })
  provider: string;

  @Prop({ type: Date, default: null })
  deadline: Date | null;

  @Prop({ required: true })
  eligibility: string;

  @Prop({ required: true })
  applicationUrl: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const OpportunitySchema = SchemaFactory.createForClass(Opportunity);
OpportunitySchema.index({ tags: 1, type: 1, isActive: 1 });
