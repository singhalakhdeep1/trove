import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SellersService } from './sellers.service';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver('Sellers')
export class SellersResolver {
  constructor(private sellersService: SellersService) {}

  @Query('sellers')
  async getAll(@Args() filters: any) {
    return this.sellersService.findAll(filters);
  }

  @Query('seller')
  async getOne(@Args('id') id: string) {
    return this.sellersService.findOne(id);
  }

  @Mutation('createSeller')
  @UseGuards(GqlAuthGuard)
  async create(@Args('input') dto: any) {
    return this.sellersService.create(dto);
  }

  @Mutation('updateSeller')
  @UseGuards(GqlAuthGuard)
  async update(@Args('id') id: string, @Args('input') dto: any) {
    return this.sellersService.update(id, dto);
  }

  @Mutation('deleteSeller')
  @UseGuards(GqlAuthGuard)
  async delete(@Args('id') id: string) {
    return this.sellersService.remove(id);
  }
}
