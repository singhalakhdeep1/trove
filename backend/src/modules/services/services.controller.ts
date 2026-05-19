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
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all services' })
  findAll(@Query() filters: any) {
    return this.servicesService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get services by id' })
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create services' })
  create(@Body() dto: any) {
    return this.servicesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update services' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.servicesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete services' })
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }

  // Feature-specific endpoints

  @Post('create-service')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'createService' })
  async createService(@Body() dto: any) {
    return this.servicesService.createService(dto);
  }

  @Post('update-service')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'updateService' })
  async updateService(@Body() dto: any) {
    return this.servicesService.updateService(dto);
  }

  @Post('delete-service')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'deleteService' })
  async deleteService(@Body() dto: any) {
    return this.servicesService.deleteService(dto);
  }

  @Post('get-services')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getServices' })
  async getServices(@Body() dto: any) {
    return this.servicesService.getServices(dto);
  }

  @Post('get-service')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getService' })
  async getService(@Body() dto: any) {
    return this.servicesService.getService(dto);
  }

  @Post('search-services')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'searchServices' })
  async searchServices(@Body() dto: any) {
    return this.servicesService.searchServices(dto);
  }

  @Post('book-service')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'bookService' })
  async bookService(@Body() dto: any) {
    return this.servicesService.bookService(dto);
  }

  @Post('cancel-booking')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'cancelBooking' })
  async cancelBooking(@Body() dto: any) {
    return this.servicesService.cancelBooking(dto);
  }

  @Post('reschedule-booking')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'rescheduleBooking' })
  async rescheduleBooking(@Body() dto: any) {
    return this.servicesService.rescheduleBooking(dto);
  }

  @Post('get-bookings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getBookings' })
  async getBookings(@Body() dto: any) {
    return this.servicesService.getBookings(dto);
  }
}
