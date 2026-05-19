import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { FoodService } from './food.service';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver('Food')
export class FoodResolver {
  constructor(private foodService: FoodService) {}

  @Query('food')
  async getAll(@Args() filters: any) {
    return this.foodService.findAll(filters);
  }

  @Query('foo')
  async getOne(@Args('id') id: string) {
    return this.foodService.findOne(id);
  }

  @Mutation('createFoo')
  @UseGuards(GqlAuthGuard)
  async create(@Args('input') dto: any) {
    return this.foodService.create(dto);
  }

  @Mutation('updateFoo')
  @UseGuards(GqlAuthGuard)
  async update(@Args('id') id: string, @Args('input') dto: any) {
    return this.foodService.update(id, dto);
  }

  @Mutation('deleteFoo')
  @UseGuards(GqlAuthGuard)
  async delete(@Args('id') id: string) {
    return this.foodService.remove(id);
  }
}
