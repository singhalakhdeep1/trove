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
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  @ApiOperation({ summary: 'Get all chat' })
  findAll(@Query() filters: any) {
    return this.chatService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get chat by id' })
  findOne(@Param('id') id: string) {
    return this.chatService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create chat' })
  create(@Body() dto: any) {
    return this.chatService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update chat' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.chatService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete chat' })
  remove(@Param('id') id: string) {
    return this.chatService.remove(id);
  }

  // Feature-specific endpoints

  @Post('send-message')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'sendMessage' })
  async sendMessage(@Body() dto: any) {
    return this.chatService.sendMessage(dto);
  }

  @Post('get-messages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getMessages' })
  async getMessages(@Body() dto: any) {
    return this.chatService.getMessages(dto);
  }

  @Post('get-chat-rooms')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getChatRooms' })
  async getChatRooms(@Body() dto: any) {
    return this.chatService.getChatRooms(dto);
  }

  @Post('create-chat-room')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'createChatRoom' })
  async createChatRoom(@Body() dto: any) {
    return this.chatService.createChatRoom(dto);
  }

  @Post('join-chat-room')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'joinChatRoom' })
  async joinChatRoom(@Body() dto: any) {
    return this.chatService.joinChatRoom(dto);
  }

  @Post('leave-chat-room')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'leaveChatRoom' })
  async leaveChatRoom(@Body() dto: any) {
    return this.chatService.leaveChatRoom(dto);
  }

  @Post('delete-message')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'deleteMessage' })
  async deleteMessage(@Body() dto: any) {
    return this.chatService.deleteMessage(dto);
  }

  @Post('edit-message')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'editMessage' })
  async editMessage(@Body() dto: any) {
    return this.chatService.editMessage(dto);
  }

  @Post('mark-as-read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'markAsRead' })
  async markAsRead(@Body() dto: any) {
    return this.chatService.markAsRead(dto);
  }

  @Post('upload-attachment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'uploadAttachment' })
  async uploadAttachment(@Body() dto: any) {
    return this.chatService.uploadAttachment(dto);
  }
}
