import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, } from '@nestjs/common';
import { Request } from 'express';
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

            console.log(token)

            const storedUserAuthToken = await this.db.getUserAuthToken(token.sub);
            console.log(storedUserAuthToken)

            if (authToken !== storedUserAuthToken) throw new UnauthorizedException();

            const user = await this.db.getUserById(token.sub);
            console.log(user)

            if (user == null) throw new UnauthorizedException();

            request.user = user;

        } catch(err) {
            console.log('redirrect to login page');
            
            return false;
        }


        // try {
        //     const payload = await this.jwtService.verifyAsync(
        //         token,
        //         {
        //             secret: this.configService.get('JWT_SECRET'),
        //         }
        //     );

        //     console.log(payload)

        //     request['user'] = payload;
        // } catch {
        //     throw new UnauthorizedException();
        // }

        return true;
    }
}