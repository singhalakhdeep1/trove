import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver('Product')
export class ProductsResolver {
    constructor(private productsService: ProductsService) { }

    @Query('products')
    async products(@Args() filters: any) {
        return this.productsService.findAll(filters);
    }

    @Query('product')
    async product(@Args('id') id: string) {
        return this.productsService.findOne(id);
    }

    @Query('featuredProducts')
    async featuredProducts(@Args('limit') limit?: number) {
        return this.productsService.getFeaturedProducts(limit);
    }

    @Query('popularProducts')
    async popularProducts(@Args('limit') limit?: number) {
        return this.productsService.getPopularProducts(limit);
    }

    @Mutation('createProduct')
    @UseGuards(GqlAuthGuard)
    async createProduct(@Context() context: any, @Args('input') dto: any) {
        return this.productsService.create(context.req.user.sellerProfile.id, dto);
    }

    @Mutation('updateProduct')
    @UseGuards(GqlAuthGuard)
    async updateProduct(
        @Args('id') id: string,
        @Context() context: any,
        @Args('input') dto: any,
    ) {
        return this.productsService.update(id, context.req.user.sellerProfile.id, dto);
    }

    @Mutation('deleteProduct')
    @UseGuards(GqlAuthGuard)
    async deleteProduct(@Args('id') id: string, @Context() context: any) {
        return this.productsService.remove(id, context.req.user.sellerProfile.id);
    }
}
