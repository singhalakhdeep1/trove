import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver('Services')
export class ServicesResolver {
  constructor(private servicesService: ServicesService) {}

  @Query('services')
  async getAll(@Args() filters: any) {
    return this.servicesService.findAll(filters);
  }

  @Query('service')
  async getOne(@Args('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Mutation('createService')
  @UseGuards(GqlAuthGuard)
  async create(@Args('input') dto: any) {
    return this.servicesService.create(dto);
  }

  @Mutation('updateService')
  @UseGuards(GqlAuthGuard)
  async update(@Args('id') id: string, @Args('input') dto: any) {
    return this.servicesService.update(id, dto);
  }

  @Mutation('deleteService')
  @UseGuards(GqlAuthGuard)
  async delete(@Args('id') id: string) {
    return this.servicesService.remove(id);
  }
}
