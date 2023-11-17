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
        try {
            const user = await this.db.getUserByEmail(email);

            if (user === null) throw new UserDoesNotExistException();

            const passwordMatches = await bcrypt.compareSync(password, user.encryptedPassword);

            return passwordMatches;
        } catch (error) {
            throw error;
        }
    }

    async signIn(userEmail: string, password: string, response) {
        try {
            const passwordIsValid = await this.isValidUserPassword(userEmail, password, response);

            if (!passwordIsValid) throw new UserInvalidCredentialsException();

            const user = await this.db.getUserByEmail(userEmail);
            const { id, email } = user;

            const signedAuthToken = await this.signAuthToken(id, email);
            console.log(signedAuthToken);
            this.db.storeUserAuthToken(id, signedAuthToken);
            response.cookie('auth_token', signedAuthToken, { 
                maxAge: 1000 * 60 * 5,
                sameSite: 'None',
                secure: true
            });

            return {
                email: user.email,
                id: user.id,
                role: user.role
            }
            
        } catch(err) {
            response.status(403);
            return err.response;
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
            
            response.cookie('auth_token', signedAuthToken, { 
                maxAge: 1000 * 60 * 5,
                sameSite: 'None',
                secure: true
            });

            return {
                email: user.email,
                id: user.id,
                role: user.role
            }

        } catch (err) {
            console.log('asta e eroarea',err)
            response.status(401);
            return err.response;
        }
    }

    private async signAuthToken(id, email) {
        const payload = { sub: id, email };
        const authToken = await this.jwtService.signAsync(payload, {
                expiresIn: '5 minutes',
                secret: this.configService.get('JWT_SECRET')
            }
        );
        return authToken;
    }
}
