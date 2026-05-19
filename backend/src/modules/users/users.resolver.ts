import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver('User')
@UseGuards(GqlAuthGuard)
export class UsersResolver {
    constructor(private usersService: UsersService) { }

    @Query('users')
    async users(@Args('page') page?: number, @Args('limit') limit?: number) {
        return this.usersService.findAll(page, limit);
    }

    @Query('user')
    async user(@Args('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Query('me')
    async me(@Context() context: any) {
        return this.usersService.findOne(context.req.user.id);
    }

    @Mutation('updateUser')
    async updateUser(@Context() context: any, @Args('input') dto: any) {
        return this.usersService.update(context.req.user.id, dto);
    }

    @Mutation('deleteUser')
    async deleteUser(@Args('id') id: string) {
        return this.usersService.remove(id);
    }
}
