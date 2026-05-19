import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver('Wishlist')
export class WishlistResolver {
  constructor(private wishlistService: WishlistService) {}

  @Query('wishlist')
  async getAll(@Args() filters: any) {
    return this.wishlistService.findAll(filters);
  }

  @Query('wishlis')
  async getOne(@Args('id') id: string) {
    return this.wishlistService.findOne(id);
  }

  @Mutation('createWishlis')
  @UseGuards(GqlAuthGuard)
  async create(@Args('input') dto: any) {
    return this.wishlistService.create(dto);
  }

  @Mutation('updateWishlis')
  @UseGuards(GqlAuthGuard)
  async update(@Args('id') id: string, @Args('input') dto: any) {
    return this.wishlistService.update(id, dto);
  }

  @Mutation('deleteWishlis')
  @UseGuards(GqlAuthGuard)
  async delete(@Args('id') id: string) {
    return this.wishlistService.remove(id);
  }
}
