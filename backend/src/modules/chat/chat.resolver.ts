import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver('Chat')
export class ChatResolver {
  constructor(private chatService: ChatService) {}

  @Query('chat')
  async getAll(@Args() filters: any) {
    return this.chatService.findAll(filters);
  }

  @Query('cha')
  async getOne(@Args('id') id: string) {
    return this.chatService.findOne(id);
  }

  @Mutation('createCha')
  @UseGuards(GqlAuthGuard)
  async create(@Args('input') dto: any) {
    return this.chatService.create(dto);
  }

  @Mutation('updateCha')
  @UseGuards(GqlAuthGuard)
  async update(@Args('id') id: string, @Args('input') dto: any) {
    return this.chatService.update(id, dto);
  }

  @Mutation('deleteCha')
  @UseGuards(GqlAuthGuard)
  async delete(@Args('id') id: string) {
    return this.chatService.remove(id);
  }
}
