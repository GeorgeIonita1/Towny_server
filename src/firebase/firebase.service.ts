import { Injectable } from '@nestjs/common';
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
}
