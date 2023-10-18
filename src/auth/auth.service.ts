import { Injectable, UnauthorizedException  } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { UsersService } from '../users/users.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { UserDoesNotExistException, UserInvalidCredentialsException } from 'src/api_http_exceptions/ApiHttpExceptions';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private db: FirebaseService
    ) {}

    async isValidUserPassword(email: string, password: string, response) {
        const user = await this.db.getUserByEmail(email);

        try {
            if (user === null) throw new UserDoesNotExistException();
            
            return user.password === password;
        } catch (error) {
            response.status(403);
            response.send(error.response)
            return false;
        }
    }

    async signIn(email: string, password: string, response) {
        try {
            const passwordIsValid = await this.isValidUserPassword(email, password, response);
            console.log(passwordIsValid);

            if (!passwordIsValid) throw new UserInvalidCredentialsException();

            const user = await this.db.getUserByEmail(email);
            response.send(user)

        } catch (error) {
            response.status(401);
            response.send(error.response);
        }
    }

    async signAuthToken(username, password) {
        const payload = {
            sub: password,
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
