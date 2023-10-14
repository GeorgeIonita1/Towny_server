import { Body, Controller, ForbiddenException, Post, UseFilters, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { HttpExceptionFilter } from 'src/exception_filters/default_exception.filter';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}

    @Post('register')
    @UseFilters(new HttpExceptionFilter())
    createNewUser(@Body() userDetails) {
        console.log(userDetails);
        // this.userService.createUser(userDetails);
        throw new UnauthorizedException();
        return userDetails;
    }
}
