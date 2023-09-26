import { Body, Controller, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {

    @Post('register')
    createNewUser(@Body() userDetails) {
        console.log(userDetails)
        return userDetails;
    }
}
