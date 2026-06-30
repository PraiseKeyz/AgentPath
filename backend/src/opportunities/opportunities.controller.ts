import { Controller, Get, Param, Query } from '@nestjs/common';
import { OpportunitiesService } from './opportunities.service.js';

@Controller('opportunities')
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  @Get()
  async findAll(@Query('type') type?: string, @Query('tag') tag?: string, @Query('q') q?: string) {
    const opportunities = await this.opportunitiesService.findAll({ type, tag, q });
    return { message: 'Opportunities fetched', data: { opportunities } };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const opportunity = await this.opportunitiesService.findById(id);
    return { message: 'Opportunity fetched', data: { opportunity } };
  }
}
