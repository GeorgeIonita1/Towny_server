import { Injectable  } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { FirebaseService } from 'src/firebase/firebase.service';
import { UserDoesNotExistException, UserInvalidCredentialsException } from 'src/api_http_exceptions/ApiHttpExceptions';

@Injectable()
export class AuthService {
    constructor(
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
            const signedAuthToken = await this.signAuthToken(user.id, user.email);
            console.log(signedAuthToken)

            response.cookie("auth-token", signedAuthToken) // to do add expiration date
            response.send({
                email: user.email,
                id: user.id,
                role: user.role
            })

        } catch (error) {
            response.status(401);
            response.send(error.response);
        }
    }

    async signAuthToken(id, email) {
        const payload = { sub: id, email };
        const authToken = await this.jwtService.signAsync(payload, {
                expiresIn: '180s',
                secret: this.configService.get('JWT_SECRET'),
            }
        );
        return authToken;
    }
}
