import { Injectable, UnauthorizedException  } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    async signIn(username: string, pass: string): Promise<any> {
        console.log(username, pass)
        const user = await this.userService.findOne(username);
        console.log(user)

        if (user?.password !== pass) {
          throw new UnauthorizedException();
        }

        const payload = { sub: user.userId, username: user.username };
        console.log(payload)

        // return {
        //   access_token: await this.jwtService.signAsync(payload),
        // }
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
