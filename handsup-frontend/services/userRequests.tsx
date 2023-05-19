
import { setDoc, doc, collection, getDocs, getDoc, deleteDoc, query, where } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../firebase/firebase';
import { FirestoreError } from 'firebase/firestore';
import { User } from '../redux/types/types';
import { getDatabase, ref, set, get } from "firebase/database";




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
            console.log({ pushTokens })
            return pushTokens;
        } else {
            throw new Error('Error getting push tokens');
        }
    } catch (err) {
        throw err;
    }
}

export const deleteUser = async (userId: string) => {
    try {
        const userDocRef = doc(db, 'users', userId);
        await deleteDoc(userDocRef);
    } catch (error: unknown) {
        if (error instanceof FirestoreError) {
            console.error('Firestore Error:', error.code, error.message);
            throw error;
        }
        console.error('Unexpected error:', error);
        throw new Error('An unexpected error occurred while deleting user data.');
    }
};



// export const createUser = async (email: string, password: string) => {
//     const db = getDatabase();
//     try {
//       await createUserWithEmailAndPassword(auth, email, password);
//       console.log('User registered successfully');
//       console.log(auth.currentUser)
//       const { uid } = auth.currentUser;
//       const userRef = ref(db, 'users/' + uid);
//       await set(userRef, {
//           id: uid,
//           email: email,
//           firstName: null,
//           lastName: null,
//           username: null,
//           expoPushToken: null,
//       });
//       console.log('User doc created successfully');
//       const accessToken = await auth.currentUser.getIdToken();
//       await AsyncStorage.setItem('handsup-token', accessToken);
//     } catch (error) {
//       throw error;
//     }
//   };


//   export const loginUser = async (email: string, password) => {
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       const accessToken = await auth.currentUser.getIdToken();
//       await AsyncStorage.setItem('handsup-token', accessToken);
//     } catch (err) {
//       throw err;
//     }
//   };


//   export const getUserObject = async (uid: string) => {
//     const db = getDatabase();
//     try {
//       const userRef = ref(db, 'users/' + uid);
//       const userSnapshot = await get(userRef);
//       if (userSnapshot.exists()) {
//         return userSnapshot.val();
//       }
//       return null
//     } catch (err) {
//       throw err;
//     }
//   };


//   export const updateUser = async (userId: string, user: User): Promise<User> => {
//     const db = getDatabase();
//     try {
//       const userRef = ref(db, 'users/' + userId);
//       await set(userRef, user);
//       const updatedUser = { ...user, id: userId };
//       console.log({ updatedUser })
//       return updatedUser;
//     } catch (error) {
//       console.error('Unexpected error:', error);
//       throw new Error('An unexpected error occurred while updating user data.');
//     }
//   };

//   export const getAllPushTokens = async (teamId: string) => {
//     const db = getDatabase();
//     try {
//       const teamRef = ref(db, 'teams/' + teamId);
//       const teamSnapshot = await get(teamRef);
//       if (teamSnapshot.exists()) {
//         //get all user IDs from members in team
//         const teamData = teamSnapshot.val();
//         const members = teamData.members;
//         //get all users by members ID array
//         const usersRef = ref(db, 'users/');
//         const usersSnapshot = await get(usersRef);
//         const users = Object.values(usersSnapshot.val()) as User[];
//         //get all push tokens
//         const pushTokens = users.map(user => user.expoPushToken);
//         return pushTokens;
//         } else {
//             throw new Error('Error getting push tokens');
//             }
//         } catch (err) {
//             throw err;
//         }
//     }