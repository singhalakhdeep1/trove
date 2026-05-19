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
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all payments' })
  findAll(@Query() filters: any) {
    return this.paymentsService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payments by id' })
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create payments' })
  create(@Body() dto: any) {
    return this.paymentsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update payments' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.paymentsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete payments' })
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(id);
  }

  // Feature-specific endpoints

  @Post('process-payment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'processPayment' })
  async processPayment(@Body() dto: any) {
    return this.paymentsService.processPayment(dto);
  }

  @Post('refund-payment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'refundPayment' })
  async refundPayment(@Body() dto: any) {
    return this.paymentsService.refundPayment(dto);
  }

  @Post('capture-payment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'capturePayment' })
  async capturePayment(@Body() dto: any) {
    return this.paymentsService.capturePayment(dto);
  }

  @Post('void-payment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'voidPayment' })
  async voidPayment(@Body() dto: any) {
    return this.paymentsService.voidPayment(dto);
  }

  @Post('create-payment-intent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'createPaymentIntent' })
  async createPaymentIntent(@Body() dto: any) {
    return this.paymentsService.createPaymentIntent(dto);
  }

  @Post('confirm-payment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'confirmPayment' })
  async confirmPayment(@Body() dto: any) {
    return this.paymentsService.confirmPayment(dto);
  }

  @Post('get-payment-methods')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getPaymentMethods' })
  async getPaymentMethods(@Body() dto: any) {
    return this.paymentsService.getPaymentMethods(dto);
  }

  @Post('save-payment-method')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'savePaymentMethod' })
  async savePaymentMethod(@Body() dto: any) {
    return this.paymentsService.savePaymentMethod(dto);
  }

  @Post('delete-payment-method')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'deletePaymentMethod' })
  async deletePaymentMethod(@Body() dto: any) {
    return this.paymentsService.deletePaymentMethod(dto);
  }

  @Post('set-default-payment-method')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'setDefaultPaymentMethod' })
  async setDefaultPaymentMethod(@Body() dto: any) {
    return this.paymentsService.setDefaultPaymentMethod(dto);
  }
}
