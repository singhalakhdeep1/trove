import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver('Notifications')
export class NotificationsResolver {
  constructor(private notificationsService: NotificationsService) {}

  @Query('notifications')
  async getAll(@Args() filters: any) {
    return this.notificationsService.findAll(filters);
  }

  @Query('notification')
  async getOne(@Args('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Mutation('createNotification')
  @UseGuards(GqlAuthGuard)
  async create(@Args('input') dto: any) {
    return this.notificationsService.create(dto);
  }

  @Mutation('updateNotification')
  @UseGuards(GqlAuthGuard)
  async update(@Args('id') id: string, @Args('input') dto: any) {
    return this.notificationsService.update(id, dto);
  }

  @Mutation('deleteNotification')
  @UseGuards(GqlAuthGuard)
  async delete(@Args('id') id: string) {
    return this.notificationsService.remove(id);
  }
}
