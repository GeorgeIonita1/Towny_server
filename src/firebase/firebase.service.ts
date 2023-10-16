import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserExistsException } from 'src/api_http_exceptions/ApiHttpExceptions';
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('../../firebaseKey.json');

initializeApp({
  credential: cert(serviceAccount)
});



@Injectable()
export class FirebaseService {
    private readonly db = getFirestore();

    async getAllUsers() {
        console.log("getting all users");
        const collectionRef = this.db.collection('users');
        const snapshot = await collectionRef.get();
        snapshot.forEach(doc => {
            const data = doc.data();
            console.log('Document ID:', doc.id, 'Data:', data);
        })
    }

    async createUser(userDetails) {
        const { email } = userDetails;
        console.log('checking if user exists');
        console.log(userDetails)
        const collectionRef = this.db.collection('users');
        const userRef = await collectionRef.where('email', '==', email).get();

        if (!userRef.empty) {
            console.log('Exista deja un user');
            throw new UserExistsException();
        }

        // console.log(userRef.docs[0].data());
        // return true;
    }
}
