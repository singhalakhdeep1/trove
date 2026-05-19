import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { GqlAuthGuard } from './guards/gql-auth.guard';

@Resolver('Auth')
export class AuthResolver {
    constructor(private authService: AuthService) { }

    @Mutation('register')
    async register(@Args('input') dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Mutation('login')
    async login(@Args('input') dto: LoginDto) {
        return this.authService.login(dto);
    }

    @Mutation('logout')
    @UseGuards(GqlAuthGuard)
    async logout(@Context() context: any) {
        const token = context.req.headers.authorization?.split(' ')[1];
        return this.authService.logout(context.req.user.id, token);
    }

    @Query('me')
    @UseGuards(GqlAuthGuard)
    async me(@Context() context: any) {
        return this.authService.validateUser(context.req.user.id);
    }
}
