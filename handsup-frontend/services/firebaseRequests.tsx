import { doc, getDoc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setIsLoggedIn } from '../redux/slices/loggedInSlice';
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
                username: null
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

export const getUserObject = async (uid: string) => {
    const userDoc = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDoc);
    if (userDocSnap.exists()) {
        return userDocSnap.data();
    }
    return null
}

export const updateUser = async (userId: string, user: User): Promise<void> => {
    const userDocRef = doc(db, 'users', userId);
  
    try {
      await setDoc(userDocRef, user, { merge: true });
    } catch (error: unknown) {
      if (error instanceof FirestoreError) {
        console.error('Firestore Error:', error.code, error.message);
        throw error;
      }
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred while updating user data.');
    }
  };




