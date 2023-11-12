import {  Body, Controller, Post, UseFilters, Get, UseGuards, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

import { AuthGuard } from './auth.guard';
import { SignInDto } from './dto/auth.dto';
import { HttpExceptionFilter } from 'src/exception_filters/default_exception.filter';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    
    @UseFilters(HttpExceptionFilter)
    @Post('signin')
    signIn(@Body() signInDto: SignInDto, @Res() response: Response) {
        this.authService.signIn(signInDto.email, signInDto.password, response);
    }

    @UseGuards(AuthGuard)
    @Get('refresh')
    refreshAuth(@Req() requestWithAuth) {
        console.log('refreshing auth');
        console.log(requestWithAuth.user.id)
    }

    @Get()
    test() {
        return 'I am grootss2'
    }
}
