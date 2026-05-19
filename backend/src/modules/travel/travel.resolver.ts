import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TravelService } from './travel.service';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver('Travel')
export class TravelResolver {
  constructor(private travelService: TravelService) {}

  @Query('travel')
  async getAll(@Args() filters: any) {
    return this.travelService.findAll(filters);
  }

  @Query('trave')
  async getOne(@Args('id') id: string) {
    return this.travelService.findOne(id);
  }

  @Mutation('createTrave')
  @UseGuards(GqlAuthGuard)
  async create(@Args('input') dto: any) {
    return this.travelService.create(dto);
  }

  @Mutation('updateTrave')
  @UseGuards(GqlAuthGuard)
  async update(@Args('id') id: string, @Args('input') dto: any) {
    return this.travelService.update(id, dto);
  }

  @Mutation('deleteTrave')
  @UseGuards(GqlAuthGuard)
  async delete(@Args('id') id: string) {
    return this.travelService.remove(id);
  }
}
