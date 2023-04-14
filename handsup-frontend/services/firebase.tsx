import { doc, getDoc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setIsLoggedIn } from '../redux/slices/loggedInSlice';

export const createUser = async (auth, db, email: string, password: string) => {
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

// export const loginUser = async (email: string, password, navigation) => {
//     try {
//         await signInWithEmailAndPassword(auth, email, password);
//         const accessToken = await auth.currentUser.getIdToken();
//         await AsyncStorage.setItem('handsup-token', accessToken);
//         dispatch(setIsLoggedIn(true));
//         navigation.navigate('Home');
//     } catch (err) {
//         console.log(err);
//     }
//     }

//     export const getUserObject = async (uid: string) => {
//     const userDoc = doc(db, 'users', uid);
//     const userDocSnap = await getDoc(userDoc);
//     if (userDocSnap.exists()) {
//         return userDocSnap.data();
//     }
//     return null
//     }



