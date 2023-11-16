import {  Body, Controller, Post, UseFilters, Get, UseGuards, Res, Req } from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { SignInDto } from './dto/auth.dto';
import { HttpExceptionFilter } from 'src/exception_filters/default_exception.filter';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    
    @UseFilters(HttpExceptionFilter) // can i remove the filter?
    @Post('signin')
    signIn(@Body() signInDto: SignInDto, @Res() response: Response) {
        this.authService.signIn(signInDto.email, signInDto.password, response);
    }
    
    @UseGuards(AuthGuard)
    @Get('refresh')
    refreshAuth(@Req() requestWithAuth, @Res() response: Response) {
        const userId = requestWithAuth.user.id;
        this.authService.refreshAuth(userId, response)
    }

    @Get()
    test() {
        return 'I am grootss2'
    }
}
