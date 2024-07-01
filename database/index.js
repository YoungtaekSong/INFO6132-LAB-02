import {
    addDoc,
    collection,
    getDocs
} from 'firebase/firestore';
import { firebaseDB } from './config';

export async function readAll() {
    console.log('Loading...');
    const data = [];
    const querySnapshot = await getDocs(collection(firebaseDB, "Todo"));

    querySnapshot.forEach((doc) => {
        console.log(doc.id, doc.data());
        data.push({
            ...doc.data(),
            id: doc.id,
        })
    })

    console.log(data);

    return data;
}

export async function insert(data) {
    console.log('Saving...');
    if (data != undefined) {
        try {
            const dbCollection = collection(firebaseDB, "Todo");
            await addDoc(dbCollection, data);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }
}