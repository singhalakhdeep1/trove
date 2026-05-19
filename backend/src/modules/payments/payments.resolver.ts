import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver('Payments')
export class PaymentsResolver {
  constructor(private paymentsService: PaymentsService) {}

  @Query('payments')
  async getAll(@Args() filters: any) {
    return this.paymentsService.findAll(filters);
  }

  @Query('payment')
  async getOne(@Args('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Mutation('createPayment')
  @UseGuards(GqlAuthGuard)
  async create(@Args('input') dto: any) {
    return this.paymentsService.create(dto);
  }

  @Mutation('updatePayment')
  @UseGuards(GqlAuthGuard)
  async update(@Args('id') id: string, @Args('input') dto: any) {
    return this.paymentsService.update(id, dto);
  }

  @Mutation('deletePayment')
  @UseGuards(GqlAuthGuard)
  async delete(@Args('id') id: string) {
    return this.paymentsService.remove(id);
  }
}
