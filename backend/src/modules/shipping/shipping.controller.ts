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
import { ShippingService } from './shipping.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Shipping')
@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Get()
  @ApiOperation({ summary: 'Get all shipping' })
  findAll(@Query() filters: any) {
    return this.shippingService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get shipping by id' })
  findOne(@Param('id') id: string) {
    return this.shippingService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create shipping' })
  create(@Body() dto: any) {
    return this.shippingService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update shipping' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.shippingService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete shipping' })
  remove(@Param('id') id: string) {
    return this.shippingService.remove(id);
  }

  // Feature-specific endpoints

  @Post('calculate-shipping')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'calculateShipping' })
  async calculateShipping(@Body() dto: any) {
    return this.shippingService.calculateShipping(dto);
  }

  @Post('get-shipping-rates')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getShippingRates' })
  async getShippingRates(@Body() dto: any) {
    return this.shippingService.getShippingRates(dto);
  }

  @Post('create-shipment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'createShipment' })
  async createShipment(@Body() dto: any) {
    return this.shippingService.createShipment(dto);
  }

  @Post('track-shipment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'trackShipment' })
  async trackShipment(@Body() dto: any) {
    return this.shippingService.trackShipment(dto);
  }

  @Post('cancel-shipment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'cancelShipment' })
  async cancelShipment(@Body() dto: any) {
    return this.shippingService.cancelShipment(dto);
  }

  @Post('schedule-pickup')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'schedulePickup' })
  async schedulePickup(@Body() dto: any) {
    return this.shippingService.schedulePickup(dto);
  }

  @Post('generate-label')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'generateLabel' })
  async generateLabel(@Body() dto: any) {
    return this.shippingService.generateLabel(dto);
  }

  @Post('print-label')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'printLabel' })
  async printLabel(@Body() dto: any) {
    return this.shippingService.printLabel(dto);
  }

  @Post('get-carriers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getCarriers' })
  async getCarriers(@Body() dto: any) {
    return this.shippingService.getCarriers(dto);
  }

  @Post('compare-rates')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'compareRates' })
  async compareRates(@Body() dto: any) {
    return this.shippingService.compareRates(dto);
  }
}
