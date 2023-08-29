import { Injectable } from '@nestjs/common';
import { createUserWithEmailAndPassword } from "firebase/auth";

import { auth } from 'firebase-config';

@Injectable()
export class AuthService {
    getTitle(): string {
        createUserWithEmailAndPassword(auth, 'gddd3orrg301@gmail.com', 'Ienupar3')
            .then(userCredential => {
                const user = userCredential.user;
                console.log(user)
            })
            .catch(error => {
                const errorCode = error.code;
                const errorMessage = error.message;
            })
        
        return 'auth route';
    }
}
