import { Body, Controller, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
    @Post('new-user')
    createNewUser(@Body() userDetails) {
        console.log(userDetails)
        return userDetails;
    }
}
