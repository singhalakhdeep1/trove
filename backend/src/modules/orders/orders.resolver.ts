import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver('Orders')
export class OrdersResolver {
  constructor(private ordersService: OrdersService) {}

  @Query('orders')
  async getAll(@Args() filters: any) {
    return this.ordersService.findAll(filters);
  }

  @Query('order')
  async getOne(@Args('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Mutation('createOrder')
  @UseGuards(GqlAuthGuard)
  async create(@Args('input') dto: any) {
    return this.ordersService.create(dto);
  }

  @Mutation('updateOrder')
  @UseGuards(GqlAuthGuard)
  async update(@Args('id') id: string, @Args('input') dto: any) {
    return this.ordersService.update(id, dto);
  }

  @Mutation('deleteOrder')
  @UseGuards(GqlAuthGuard)
  async delete(@Args('id') id: string) {
    return this.ordersService.remove(id);
  }
}
