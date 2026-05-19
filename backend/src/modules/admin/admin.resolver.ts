import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver('Admin')
export class AdminResolver {
  constructor(private adminService: AdminService) {}

  @Query('admin')
  async getAll(@Args() filters: any) {
    return this.adminService.findAll(filters);
  }

  @Query('admi')
  async getOne(@Args('id') id: string) {
    return this.adminService.findOne(id);
  }

  @Mutation('createAdmi')
  @UseGuards(GqlAuthGuard)
  async create(@Args('input') dto: any) {
    return this.adminService.create(dto);
  }

  @Mutation('updateAdmi')
  @UseGuards(GqlAuthGuard)
  async update(@Args('id') id: string, @Args('input') dto: any) {
    return this.adminService.update(id, dto);
  }

  @Mutation('deleteAdmi')
  @UseGuards(GqlAuthGuard)
  async delete(@Args('id') id: string) {
    return this.adminService.remove(id);
  }
}
