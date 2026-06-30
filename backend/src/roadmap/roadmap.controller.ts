import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { RoadmapService } from './roadmap.service.js';
import { CreateMilestoneDto, UpdateMilestoneDto } from './dto/milestone.dto.js';
import { CurrentUser } from '@/common/decorators/current-user.decorator.js';
import type { SafeUser } from '@/common/constants/safe-user.constant.js';

@Controller('roadmap')
export class RoadmapController {
  constructor(private readonly roadmapService: RoadmapService) {}

  @Get()
  async getRoadmap(@CurrentUser() user: SafeUser) {
    const roadmap = await this.roadmapService.getRoadmap(user.id);
    return { message: 'Roadmap fetched', data: { roadmap } };
  }

  @Post('milestones')
  async addMilestone(@CurrentUser() user: SafeUser, @Body() dto: CreateMilestoneDto) {
    const roadmap = await this.roadmapService.addMilestone(user.id, dto);
    return { message: 'Milestone added', data: { roadmap } };
  }

  @Patch('milestones/:id')
  async updateMilestone(
    @CurrentUser() user: SafeUser,
    @Param('id') id: string,
    @Body() dto: UpdateMilestoneDto,
  ) {
    const roadmap = await this.roadmapService.updateMilestone(user.id, id, dto);
    return { message: 'Milestone updated', data: { roadmap } };
  }

  @Delete('milestones/:id')
  async deleteMilestone(@CurrentUser() user: SafeUser, @Param('id') id: string) {
    const roadmap = await this.roadmapService.deleteMilestone(user.id, id);
    return { message: 'Milestone deleted', data: { roadmap } };
  }
}
