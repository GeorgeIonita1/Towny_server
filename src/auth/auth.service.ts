import { Injectable  } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { FirebaseService } from 'src/firebase/firebase.service';
import { UnauthorizedHttpException, UserDoesNotExistException, UserInvalidCredentialsException } from 'src/api_http_exceptions/ApiHttpExceptions';

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

            const passwordMatches = await bcrypt.compareSync(password, user.encryptedPassword);
            
            return passwordMatches;
        } catch (error) {
            response.status(403);
            response.send(error.response)
            
            return false;
        }
    }

    async signIn(userEmail: string, password: string, response) {
        try {
            const passwordIsValid = await this.isValidUserPassword(userEmail, password, response);
            console.log(passwordIsValid);

            if (!passwordIsValid) throw new UserInvalidCredentialsException();

            const user = await this.db.getUserByEmail(userEmail);
            const { id, email } = user;
            const signedAuthToken = await this.signAuthToken(id, email);
            console.log(signedAuthToken)
            
            this.db.storeUserAuthToken(id, signedAuthToken);
            response.cookie('auth_token', signedAuthToken) // to do add expiration date

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

    async refreshAuth(userId, response) {
        try {
            const user = await this.db.getUserById(userId);

            if (user === null) throw new UnauthorizedHttpException();

            const { id, email } = user;
            const signedAuthToken = await this.signAuthToken(id, email);
            console.log('aaaiicii', signedAuthToken);
            this.db.storeUserAuthToken(id, signedAuthToken);
            response.cookie('auth_token', signedAuthToken) // to do add expiration date

            response.send({
                email: user.email,
                id: user.id,
                role: user.role
            })

        } catch (err) {
            console.log('asta e eroarea',err)
            response.status(401);
            response.send(err.response);
        }
    }

    private async signAuthToken(id, email) {
        const payload = { sub: id, email };
        const authToken = await this.jwtService.signAsync(payload, {
                expiresIn: '180s',
                secret: this.configService.get('JWT_SECRET')
            }
        );
        return authToken;
    }
}
