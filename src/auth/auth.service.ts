import { Injectable, UnauthorizedException  } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { UsersService } from '../users/users.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { UserDoesNotExistException } from 'src/api_http_exceptions/ApiHttpExceptions';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private db: FirebaseService
    ) {}

    async isValidUserPassword(email: string, password: string) {
        const user = await this.db.getUserByEmail(email);
        console.log('inainte')
        if (user === null) throw new UserDoesNotExistException();
        console.log('dupa')

        return user.password === password;
    }

    async signIn(email: string, password: string): Promise<any> {
        console.log(email, password)
        const passwordIsValid = this.isValidUserPassword(email, password);






        // const user = await this.userService.findOne(username);
        // console.log(user)

        // if (user?.password !== pass) {
        //   throw new UnauthorizedException();
        // }

        // const payload = { sub: user.userId, username: user.username };
        // console.log(payload)

        // // return {
        // //   access_token: await this.jwtService.signAsync(payload),
        // // }
    }

    async signAuthToken(username, userId) {
        const payload = {
            sub: userId,
            username,
        };

        const authToken = await this.jwtService.signAsync(
            payload,
            {
                expiresIn: '180s',
                secret: this.configService.get('JWT_SECRET'),
            }
        );

        return { authToken }
    }
}
