import {
    doc, getDoc, setDoc, getDocs, collection, query, where
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../firebase/firebase';
import { FirestoreError } from 'firebase/firestore';
import { User } from '../redux/types/types';



export const createUser = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password,)
        .then(async () => {
            console.log('User registered successfully');
            console.log(auth.currentUser)
            const { uid } = auth.currentUser;
            const userDoc = doc(db, 'users', uid);
            await setDoc(userDoc, {
                id: uid,
                email: email,
                firstName: null,
                lastName: null,
                username: null,
                expoPushToken: null,
            })
            console.log('User doc created successfully');
            const accessToken = await auth.currentUser.getIdToken()
            await AsyncStorage.setItem('handsup-token', accessToken)
        })
        .catch(error => {
            throw error;
        });
}

export const loginUser = async (email: string, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password)
        const accessToken = await auth.currentUser.getIdToken();
        await AsyncStorage.setItem('handsup-token', accessToken);
    } catch (err) {
        throw err;
    }
}

// export const googleSignInUser = async () => {
//     try {
//         const { idToken } = await GoogleSignin.signIn();
//         const googleCredential = GoogleAuthProvider.credential(idToken);
//         await signInWithCredential(auth, googleCredential);
//         const accessToken = await auth.currentUser.getIdToken();
//         await AsyncStorage.setItem('handsup-token', accessToken);
//     }
//     catch (err) {
//         throw err;
//     }
// }


export const getUserObject = async (uid: string) => {
    try{
        const userDoc = doc(db, 'users', uid);
        const userDocSnap = await getDoc(userDoc);
        if (userDocSnap.exists()) {
            return userDocSnap.data();
        }
        return null
    } catch (err) {
        throw err;
    }
}


export const updateUser = async (userId: string, user: User): Promise<User> => {
    try {
        const userDocRef = doc(db, 'users', userId);
        await setDoc(userDocRef, user, { merge: true });
        const updatedUser = { ...user, id: userId };
        console.log({ updatedUser })
        return updatedUser;
    } catch (error: unknown) {
        if (error instanceof FirestoreError) {
            console.error('Firestore Error:', error.code, error.message);
            throw error;
        }
        console.error('Unexpected error:', error);
        throw new Error('An unexpected error occurred while updating user data.');
    }
};

export const getAllPushTokens = async (teamId: string) => {
    try {
        const teamDoc = doc(db, 'teams', teamId);
        const teamDocSnap = await getDoc(teamDoc);
        if (teamDocSnap.exists()) {
            //get all user IDs from members in team
            const teamData = teamDocSnap.data();
            const members = teamData.members;
            //get all users by members ID array
            const usersCollection = collection(db, 'users');
            const q = query(usersCollection, where('id', 'in', members.map(member => member.id)));
            const querySnapshot = await getDocs(q);
            const users = querySnapshot.docs.map(doc => doc.data());
            //get all push tokens
            const pushTokens = users.map(user => user.expoPushToken);
            return pushTokens;
        } else {
            throw new Error('Error getting push tokens');
        }
    } catch (err) {


        throw err;
    }
}
