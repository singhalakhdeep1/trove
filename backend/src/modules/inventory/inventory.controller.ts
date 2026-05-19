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
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all inventory' })
  findAll(@Query() filters: any) {
    return this.inventoryService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get inventory by id' })
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create inventory' })
  create(@Body() dto: any) {
    return this.inventoryService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update inventory' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.inventoryService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete inventory' })
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(id);
  }

  // Feature-specific endpoints

  @Post('get-inventory')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getInventory' })
  async getInventory(@Body() dto: any) {
    return this.inventoryService.getInventory(dto);
  }

  @Post('update-stock')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'updateStock' })
  async updateStock(@Body() dto: any) {
    return this.inventoryService.updateStock(dto);
  }

  @Post('add-stock')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'addStock' })
  async addStock(@Body() dto: any) {
    return this.inventoryService.addStock(dto);
  }

  @Post('remove-stock')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'removeStock' })
  async removeStock(@Body() dto: any) {
    return this.inventoryService.removeStock(dto);
  }

  @Post('transfer-stock')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'transferStock' })
  async transferStock(@Body() dto: any) {
    return this.inventoryService.transferStock(dto);
  }

  @Post('adjust-stock')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'adjustStock' })
  async adjustStock(@Body() dto: any) {
    return this.inventoryService.adjustStock(dto);
  }

  @Post('get-stock-history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getStockHistory' })
  async getStockHistory(@Body() dto: any) {
    return this.inventoryService.getStockHistory(dto);
  }

  @Post('low-stock-alerts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'lowStockAlerts' })
  async lowStockAlerts(@Body() dto: any) {
    return this.inventoryService.lowStockAlerts(dto);
  }

  @Post('out-of-stock-alerts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'outOfStockAlerts' })
  async outOfStockAlerts(@Body() dto: any) {
    return this.inventoryService.outOfStockAlerts(dto);
  }

  @Post('reorder-points')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'reorderPoints' })
  async reorderPoints(@Body() dto: any) {
    return this.inventoryService.reorderPoints(dto);
  }
}
