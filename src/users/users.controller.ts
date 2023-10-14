import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}

    @Post('register')
    createNewUser(@Body() userDetails) {
        console.log(userDetails);
        this.userService.createUser();
        return userDetails;
    }
}
