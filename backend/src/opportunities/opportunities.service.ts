import { Injectable, NotFoundException, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Opportunity, OpportunityDocument } from './schemas/opportunity.schema.js';

@Injectable()
export class OpportunitiesService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(Opportunity.name) private readonly opportunityModel: Model<OpportunityDocument>,
  ) {}

  async onApplicationBootstrap() {
    const count = await this.opportunityModel.countDocuments().exec();
    if (count === 0) {
      console.log('[AgentPath API] Seeding initial opportunities into MongoDB...');
      await this.opportunityModel.create([
        {
          title: 'MTN Foundation Scholarship',
          description: 'A yearly financial award for high-performing science and technology students in public universities.',
          type: 'scholarship',
          provider: 'MTN Nigeria Foundation',
          deadline: new Date('2026-10-15'),
          eligibility: '3rd year students in federal or state universities with a minimum CGPA of 3.5/5.0.',
          applicationUrl: 'https://www.mtn.ng/scholarships/',
          tags: ['undergraduate', 'science', 'technology', 'nigeria'],
          isActive: true,
        },
        {
          title: 'NLNG Undergraduate Scholarship Scheme',
          description: 'A prestigious scholarship that covers full tuition and living expenses for outstanding undergraduates.',
          type: 'scholarship',
          provider: 'Nigeria LNG Limited',
          deadline: new Date('2026-11-30'),
          eligibility: '1st year students in public universities with excellent secondary school cert results.',
          applicationUrl: 'https://www.nigerialng.com/Careers-Scholarships/Pages/Undergraduate-Scholarship.aspx',
          tags: ['undergraduate', 'all-courses', 'nigeria'],
          isActive: true,
        },
        {
          title: 'Google STEP Internship',
          description: 'A 12-week developmental summer internship for first and second-year undergraduate students studying computer science.',
          type: 'internship',
          provider: 'Google Africa',
          deadline: new Date('2026-09-01'),
          eligibility: '1st or 2nd year undergraduate students pursuing a BSc in Computer Science or related fields.',
          applicationUrl: 'https://buildyourfuture.withgoogle.com/programs/step/',
          tags: ['undergraduate', 'computer-science', 'software-engineering'],
          isActive: true,
        },
        {
          title: 'ALX Software Engineering Fellowship',
          description: 'A comprehensive, zero-tuition software engineering program designed to prepare young Africans for global careers.',
          type: 'fellowship',
          provider: 'ALX Africa',
          deadline: new Date('2026-12-15'),
          eligibility: 'Young Africans aged 18–34 with access to a computer and internet connectivity.',
          applicationUrl: 'https://www.alxafrica.com/software-engineering/',
          tags: ['fellowship', 'tech', 'software-engineering', 'post-graduate'],
          isActive: true,
        },
        {
          title: 'Shell Nigeria SPDC Joint Venture Scholarship',
          description: 'A scholarship scheme aiming to support academic excellence and improve skills among Nigerian youths.',
          type: 'scholarship',
          provider: 'Shell Petroleum Development Company',
          deadline: new Date('2026-08-31'),
          eligibility: 'Full-time 2nd year students in federal/state universities in Nigeria.',
          applicationUrl: 'https://www.shell.com.ng/sustainability/shell-energy-host-communities/scholarship-programmes.html',
          tags: ['undergraduate', 'engineering', 'science', 'nigeria'],
          isActive: true,
        }
      ]);
      console.log('[AgentPath API] Successfully seeded 5 initial opportunities.');
    }
  }

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
