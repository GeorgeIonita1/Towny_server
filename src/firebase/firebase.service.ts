import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const admin = require('firebase-admin');
// const { initializeApp, cert } = require('firebase-admin/app');
// const { getFirestore } = require('firebase-admin/firestore');

// const serviceAccount = require('../../firebaseKey.json');
import { UserAlreadyExistsException } from 'src/api_http_exceptions/ApiHttpExceptions';

@Injectable()
export class FirebaseService {
    private readonly db;
    
    constructor(private configService: ConfigService) {
        // initializeApp({
        //   credential: cert(serviceAccount)
        // });

        // this.db = getFirestore();
        // console.log(this.configService.get('GEORGE'))
        // const cristi = 'cristi';
        // console.log(cristi)
        // console.log({
        //     "project_id": 'projectid',
        //     cristi,
        // })


        const firebaseConfig = {
            "project_id": process.env.FIREBASE_PROJECT_ID,
            "private_key": process.env.FIREBASE_PRIVATE_KEY,
            "client_email": process.env.FIREBASE_CLIENT_EMAIL
        }

        admin.initializeApp({
            credential: admin.credential.cert(firebaseConfig),
        });

        this.db = admin.firestore();

    }

    async getUserByEmail(email: string) {
        const collectionRef = this.db.collection('users');
        const userRef = await collectionRef.where('email', '==', email).get();

        if (userRef.empty) return null;

        return userRef.docs[0].data();
    }

    async getAllUsers() {
        console.log("getting all users");
        const collectionRef = this.db.collection('users');
        const snapshot = await collectionRef.get();
        snapshot.forEach(doc => {
            const data = doc.data();
            console.log('Document ID:', doc.id, 'Data:', data);
        })
    }

    async createUser(userDetails, encryptedPassword) {
        const { email } = userDetails;
        const userCollectionRef = this.db.collection('users');
        const userRef = await userCollectionRef.where('email', '==', email).get();

        if (!userRef.empty) {
            console.log('Exista deja un user');
            throw new UserAlreadyExistsException();
        }

        const res = await userCollectionRef.add({
            email,
            encryptedPassword,
            role: 'user'
        });

        await res.update({ id: res.id });
        
        return { type: 'Success', message: 'Account created', solution: 'Please login' };
    }

    async storeUserAuthToken(id, signedAuthToken) {
        const authTokensCollectionRef = this.db.collection('authTokens');
        const userAuthTokenRef = await authTokensCollectionRef.where('userId', '==', id).get();

        if (userAuthTokenRef.empty) {
            const newToken = {
                userId: id,
                token: signedAuthToken
            };

            await this.db.collection('authTokens').add(newToken);

            return;
        }

        await userAuthTokenRef.docs[0].ref.update({ token: signedAuthToken });

        return;
    }

    async getUserAuthToken(id) {
        const usersAuthTokenCollection = this.db.collection('authTokens');
        const userAuthTokenRef = await usersAuthTokenCollection.where('userId', '==', id).get();

        if (userAuthTokenRef.empty) return null;

        return userAuthTokenRef.docs[0].data().token;
    }

    async getUserById(userId) {
        const userCollectionRef = this.db.collection('users');
        const userRef = await userCollectionRef.where('id', '==', userId).get();

        if (userRef.empty) return null;

        const userData = userRef.docs[0].data();

        const userDataWithoutPassword = {
            email: userData.email,
            role: userData.role,
            id: userData.id
        }

        return userDataWithoutPassword;
    }
}
