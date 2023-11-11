import { Injectable } from '@nestjs/common';
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = require('../../firebaseKey.json');
import { UserAlreadyExistsException } from 'src/api_http_exceptions/ApiHttpExceptions';

@Injectable()
export class FirebaseService {
    private readonly db;
    
    constructor() {
        initializeApp({
          credential: cert(serviceAccount)
        });

        this.db = getFirestore();
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
}
