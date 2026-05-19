import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver('Analytics')
export class AnalyticsResolver {
  constructor(private analyticsService: AnalyticsService) {}

  @Query('analytics')
  async getAll(@Args() filters: any) {
    return this.analyticsService.findAll(filters);
  }

  @Query('analytic')
  async getOne(@Args('id') id: string) {
    return this.analyticsService.findOne(id);
  }

  @Mutation('createAnalytic')
  @UseGuards(GqlAuthGuard)
  async create(@Args('input') dto: any) {
    return this.analyticsService.create(dto);
  }

  @Mutation('updateAnalytic')
  @UseGuards(GqlAuthGuard)
  async update(@Args('id') id: string, @Args('input') dto: any) {
    return this.analyticsService.update(id, dto);
  }

  @Mutation('deleteAnalytic')
  @UseGuards(GqlAuthGuard)
  async delete(@Args('id') id: string) {
    return this.analyticsService.remove(id);
  }
}
