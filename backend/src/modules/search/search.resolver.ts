import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver('Search')
export class SearchResolver {
  constructor(private searchService: SearchService) {}

  @Query('search')
  async getAll(@Args() filters: any) {
    return this.searchService.findAll(filters);
  }

  @Query('searc')
  async getOne(@Args('id') id: string) {
    return this.searchService.findOne(id);
  }

  @Mutation('createSearc')
  @UseGuards(GqlAuthGuard)
  async create(@Args('input') dto: any) {
    return this.searchService.create(dto);
  }

  @Mutation('updateSearc')
  @UseGuards(GqlAuthGuard)
  async update(@Args('id') id: string, @Args('input') dto: any) {
    return this.searchService.update(id, dto);
  }

  @Mutation('deleteSearc')
  @UseGuards(GqlAuthGuard)
  async delete(@Args('id') id: string) {
    return this.searchService.remove(id);
  }
}
