import {
    doc, getDoc, getDocs, collection, addDoc, query, setDoc, where, deleteDoc,
    updateDoc, arrayUnion
} from 'firebase/firestore';
import { db } from '../firebase/firebase';

import { Message } from '../redux/types/types';

//Chat
export const createGroupChat = async (teamSerial: string, userId: string) => {
    try {
        const newChat = await setDoc(doc(db, 'chat', teamSerial), {
            id: teamSerial,
            members: [userId],
            messages: [],
        });
        return teamSerial;
    } catch (err) {
        console.log(err);
        throw new Error ('An unexpected error occurred while creating chat');
    }
}

export const createPollChat = async (pollId: string, userId: string) => {
    try {
        const newChat = await setDoc(doc(db, 'chat', pollId), {
            id: pollId,
            members: [userId],
            messages: [],
        });
        return pollId;
    } catch (err) {
        console.log(err);
        throw new Error ('An unexpected error occurred while creating chat');
    }
}   

//render chat with either teamSerial or pollId
export const getChatById = async (id: string) => {
    try {
        const chatQuerySnapshot = await getDocs(
            query(collection(db, 'chat'),
                where('id', '==', id)));
        if (chatQuerySnapshot.empty) {
            throw new Error('Chat does not exist');
        }
        const chatDocRef = doc(db, 'chat', chatQuerySnapshot.docs[0].id);
        const chatDocSnap = await getDoc(chatDocRef);
        if (chatDocSnap.exists()) {
            console.log(chatDocSnap.data());
            console.log(chatDocSnap.data().messages[0].message);
            return chatDocSnap.data()
            
        }
        return null;
    } catch (err) {
        throw err;
    }
}

export const insertChat = async (id: string,  message: Message) => {
    try{
        const chatQuerySnapshot = await getDocs(
            query(collection(db, 'chat'),
                where('id', '==', id)));
        if (chatQuerySnapshot.empty) {
            throw new Error('Chat does not exist');
        }
        const chatDocRef = doc(db, 'chat', chatQuerySnapshot.docs[0].id);
        await updateDoc(chatDocRef, {
            messages: arrayUnion(message),
        });
    }
    catch(err){
        throw err;
    }
}

export const deleteChatDoc = async (id: string) => {
    try {
        const chatQuerySnapshot = await getDocs(
            query(collection(db, 'chat'),
                where('id', '==', id)));
        if (chatQuerySnapshot.empty) {
            throw new Error('Chat does not exist');
        }
        const chatDocRef = doc(db, 'chat', chatQuerySnapshot.docs[0].id);
        await deleteDoc(chatDocRef);

    } catch (err) {
        throw err;
    }
}
    
