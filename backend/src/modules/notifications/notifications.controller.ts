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
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notifications' })
  findAll(@Query() filters: any) {
    return this.notificationsService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notifications by id' })
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create notifications' })
  create(@Body() dto: any) {
    return this.notificationsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update notifications' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.notificationsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete notifications' })
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(id);
  }

  // Feature-specific endpoints

  @Post('send-notification')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'sendNotification' })
  async sendNotification(@Body() dto: any) {
    return this.notificationsService.sendNotification(dto);
  }

  @Post('get-notifications')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getNotifications' })
  async getNotifications(@Body() dto: any) {
    return this.notificationsService.getNotifications(dto);
  }

  @Post('mark-as-read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'markAsRead' })
  async markAsRead(@Body() dto: any) {
    return this.notificationsService.markAsRead(dto);
  }

  @Post('mark-all-as-read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'markAllAsRead' })
  async markAllAsRead(@Body() dto: any) {
    return this.notificationsService.markAllAsRead(dto);
  }

  @Post('delete-notification')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'deleteNotification' })
  async deleteNotification(@Body() dto: any) {
    return this.notificationsService.deleteNotification(dto);
  }

  @Post('get-notification-settings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getNotificationSettings' })
  async getNotificationSettings(@Body() dto: any) {
    return this.notificationsService.getNotificationSettings(dto);
  }

  @Post('update-notification-settings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'updateNotificationSettings' })
  async updateNotificationSettings(@Body() dto: any) {
    return this.notificationsService.updateNotificationSettings(dto);
  }

  @Post('subscribe-to-topic')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'subscribeToTopic' })
  async subscribeToTopic(@Body() dto: any) {
    return this.notificationsService.subscribeToTopic(dto);
  }

  @Post('unsubscribe-from-topic')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'unsubscribeFromTopic' })
  async unsubscribeFromTopic(@Body() dto: any) {
    return this.notificationsService.unsubscribeFromTopic(dto);
  }

  @Post('send-push-notification')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'sendPushNotification' })
  async sendPushNotification(@Body() dto: any) {
    return this.notificationsService.sendPushNotification(dto);
  }
}
