import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver('Reviews')
export class ReviewsResolver {
  constructor(private reviewsService: ReviewsService) {}

  @Query('reviews')
  async getAll(@Args() filters: any) {
    return this.reviewsService.findAll(filters);
  }

  @Query('review')
  async getOne(@Args('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Mutation('createReview')
  @UseGuards(GqlAuthGuard)
  async create(@Args('input') dto: any) {
    return this.reviewsService.create(dto);
  }

  @Mutation('updateReview')
  @UseGuards(GqlAuthGuard)
  async update(@Args('id') id: string, @Args('input') dto: any) {
    return this.reviewsService.update(id, dto);
  }

  @Mutation('deleteReview')
  @UseGuards(GqlAuthGuard)
  async delete(@Args('id') id: string) {
    return this.reviewsService.remove(id);
  }
}
