import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver('Recommendations')
export class RecommendationsResolver {
  constructor(private recommendationsService: RecommendationsService) {}

  @Query('recommendations')
  async getAll(@Args() filters: any) {
    return this.recommendationsService.findAll(filters);
  }

  @Query('recommendation')
  async getOne(@Args('id') id: string) {
    return this.recommendationsService.findOne(id);
  }

  @Mutation('createRecommendation')
  @UseGuards(GqlAuthGuard)
  async create(@Args('input') dto: any) {
    return this.recommendationsService.create(dto);
  }

  @Mutation('updateRecommendation')
  @UseGuards(GqlAuthGuard)
  async update(@Args('id') id: string, @Args('input') dto: any) {
    return this.recommendationsService.update(id, dto);
  }

  @Mutation('deleteRecommendation')
  @UseGuards(GqlAuthGuard)
  async delete(@Args('id') id: string) {
    return this.recommendationsService.remove(id);
  }
}
