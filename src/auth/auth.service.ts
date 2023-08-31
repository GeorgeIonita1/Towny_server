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
        
    }

    

    async signAuthToken(username, userId) {
        const payload = {
            sub: userId,
            username,
        };

        const authToken = await this.jwtService.signAsync(
            payload,
            {
                expiresIn: '120s',
                secret: this.configService.get('JWT_SECRET'),
            }
        );

        return { authToken }
    }
}
