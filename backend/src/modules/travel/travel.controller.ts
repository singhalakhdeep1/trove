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
import { TravelService } from './travel.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Travel')
@Controller('travel')
export class TravelController {
  constructor(private readonly travelService: TravelService) {}

  @Get()
  @ApiOperation({ summary: 'Get all travel' })
  findAll(@Query() filters: any) {
    return this.travelService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get travel by id' })
  findOne(@Param('id') id: string) {
    return this.travelService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create travel' })
  create(@Body() dto: any) {
    return this.travelService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update travel' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.travelService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete travel' })
  remove(@Param('id') id: string) {
    return this.travelService.remove(id);
  }

  // Feature-specific endpoints

  @Post('search-hotels')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'searchHotels' })
  async searchHotels(@Body() dto: any) {
    return this.travelService.searchHotels(dto);
  }

  @Post('get-hotel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getHotel' })
  async getHotel(@Body() dto: any) {
    return this.travelService.getHotel(dto);
  }

  @Post('get-hotel-rooms')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getHotelRooms' })
  async getHotelRooms(@Body() dto: any) {
    return this.travelService.getHotelRooms(dto);
  }

  @Post('book-hotel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'bookHotel' })
  async bookHotel(@Body() dto: any) {
    return this.travelService.bookHotel(dto);
  }

  @Post('cancel-booking')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'cancelBooking' })
  async cancelBooking(@Body() dto: any) {
    return this.travelService.cancelBooking(dto);
  }

  @Post('modify-booking')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'modifyBooking' })
  async modifyBooking(@Body() dto: any) {
    return this.travelService.modifyBooking(dto);
  }

  @Post('get-bookings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getBookings' })
  async getBookings(@Body() dto: any) {
    return this.travelService.getBookings(dto);
  }

  @Post('check-availability')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'checkAvailability' })
  async checkAvailability(@Body() dto: any) {
    return this.travelService.checkAvailability(dto);
  }

  @Post('calculate-price')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'calculatePrice' })
  async calculatePrice(@Body() dto: any) {
    return this.travelService.calculatePrice(dto);
  }

  @Post('apply-discounts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'applyDiscounts' })
  async applyDiscounts(@Body() dto: any) {
    return this.travelService.applyDiscounts(dto);
  }
}
