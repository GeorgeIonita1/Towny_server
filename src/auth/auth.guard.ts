import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private db: FirebaseService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authToken = request.cookies['auth_token'];
        
        try {
            if (!authToken) throw new UnauthorizedException();
            
            const token = await this.jwtService.verifyAsync(authToken, {
                secret: this.configService.get('JWT_SECRET')
            });

            const storedUserAuthToken = await this.db.getUserAuthToken(token.sub);

            if (authToken !== storedUserAuthToken) throw new UnauthorizedException();

            const user = await this.db.getUserById(token.sub);

            if (user == null) throw new UnauthorizedException();

            request.user = user;
            return true;

        } catch(err) {
            console.log('redirrect to login page', err);
            return false;
        }
    }
}
