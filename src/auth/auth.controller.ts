import {  Body, Controller, Post, HttpCode, HttpStatus, UseFilters, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

import { AuthGuard } from './auth.guard';
import { SignInDto } from './dto/auth.dto';
import { HttpExceptionFilter } from 'src/exception_filters/default_exception.filter';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    
    // @HttpCode(HttpStatus.OK)
    @UseFilters(HttpExceptionFilter)
    @Post('signin')
    signIn(@Body() signInDto: SignInDto) {
        console.log(signInDto)
        return this.authService.signIn(signInDto.email, signInDto.password);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @Post('token')
    getToken(@Body() token) {
        return this.authService.signAuthToken(token.username, token.userId);
    }
}
