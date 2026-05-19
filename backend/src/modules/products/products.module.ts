import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsResolver } from './products.resolver';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';

@Module({
    controllers: [ProductsController, CategoriesController],
    providers: [ProductsService, ProductsResolver, CategoriesService],
    exports: [ProductsService, CategoriesService],
})
export class ProductsModule { }
