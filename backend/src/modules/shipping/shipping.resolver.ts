import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver('Shipping')
export class ShippingResolver {
  constructor(private shippingService: ShippingService) {}

  @Query('shipping')
  async getAll(@Args() filters: any) {
    return this.shippingService.findAll(filters);
  }

  @Query('shippin')
  async getOne(@Args('id') id: string) {
    return this.shippingService.findOne(id);
  }

  @Mutation('createShippin')
  @UseGuards(GqlAuthGuard)
  async create(@Args('input') dto: any) {
    return this.shippingService.create(dto);
  }

  @Mutation('updateShippin')
  @UseGuards(GqlAuthGuard)
  async update(@Args('id') id: string, @Args('input') dto: any) {
    return this.shippingService.update(id, dto);
  }

  @Mutation('deleteShippin')
  @UseGuards(GqlAuthGuard)
  async delete(@Args('id') id: string) {
    return this.shippingService.remove(id);
  }
}
