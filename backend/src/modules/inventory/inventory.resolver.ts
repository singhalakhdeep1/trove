import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver('Inventory')
export class InventoryResolver {
  constructor(private inventoryService: InventoryService) {}

  @Query('inventory')
  async getAll(@Args() filters: any) {
    return this.inventoryService.findAll(filters);
  }

  @Query('inventor')
  async getOne(@Args('id') id: string) {
    return this.inventoryService.findOne(id);
  }

  @Mutation('createInventor')
  @UseGuards(GqlAuthGuard)
  async create(@Args('input') dto: any) {
    return this.inventoryService.create(dto);
  }

  @Mutation('updateInventor')
  @UseGuards(GqlAuthGuard)
  async update(@Args('id') id: string, @Args('input') dto: any) {
    return this.inventoryService.update(id, dto);
  }

  @Mutation('deleteInventor')
  @UseGuards(GqlAuthGuard)
  async delete(@Args('id') id: string) {
    return this.inventoryService.remove(id);
  }
}
