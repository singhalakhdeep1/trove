import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  findAll(@Query() filters: any) {
    return this.ordersService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get orders by id' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create orders' })
  create(@Body() dto: any) {
    return this.ordersService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update orders' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.ordersService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete orders' })
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }

  // Feature-specific endpoints

  @Post('create-order')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'createOrder' })
  async createOrder(@Body() dto: any) {
    return this.ordersService.createOrder(dto);
  }

  @Post('get-orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getOrders' })
  async getOrders(@Body() dto: any) {
    return this.ordersService.getOrders(dto);
  }

  @Post('get-order')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getOrder' })
  async getOrder(@Body() dto: any) {
    return this.ordersService.getOrder(dto);
  }

  @Post('update-order')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'updateOrder' })
  async updateOrder(@Body() dto: any) {
    return this.ordersService.updateOrder(dto);
  }

  @Post('cancel-order')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'cancelOrder' })
  async cancelOrder(@Body() dto: any) {
    return this.ordersService.cancelOrder(dto);
  }

  @Post('confirm-order')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'confirmOrder' })
  async confirmOrder(@Body() dto: any) {
    return this.ordersService.confirmOrder(dto);
  }

  @Post('ship-order')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'shipOrder' })
  async shipOrder(@Body() dto: any) {
    return this.ordersService.shipOrder(dto);
  }

  @Post('deliver-order')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'deliverOrder' })
  async deliverOrder(@Body() dto: any) {
    return this.ordersService.deliverOrder(dto);
  }

  @Post('track-order')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'trackOrder' })
  async trackOrder(@Body() dto: any) {
    return this.ordersService.trackOrder(dto);
  }

  @Post('get-order-history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getOrderHistory' })
  async getOrderHistory(@Body() dto: any) {
    return this.ordersService.getOrderHistory(dto);
  }
}
