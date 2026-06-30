import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoadmapService } from './roadmap.service.js';
import { RoadmapController } from './roadmap.controller.js';
import { Roadmap, RoadmapSchema } from './schemas/roadmap.schema.js';

@Module({
  imports: [MongooseModule.forFeature([{ name: Roadmap.name, schema: RoadmapSchema }])],
  controllers: [RoadmapController],
  providers: [RoadmapService],
})
export class RoadmapModule {}
