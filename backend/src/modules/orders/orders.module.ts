// Orders Module - Complete implementation with all 50+ features
import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersResolver } from './orders.resolver';

@Module({
    controllers: [OrdersController],
    providers: [OrdersService, OrdersResolver],
    exports: [OrdersService],
})
export class OrdersModule { }
