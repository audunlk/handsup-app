import { doc, getDoc, setDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setIsLoggedIn } from '../redux/slices/loggedInSlice';
import { auth, db } from '../firebase/firebase';
import { FirestoreError } from 'firebase/firestore';
import { User } from '../redux/types/types';

//USER 
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


export const updateUser = async (userId: string, user: User): Promise<User> => {
    const userDocRef = doc(db, 'users', userId);
    try {
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


//TEAMS
export const createTeam = async (teamName: string, serialKey: string) => {
    try {
        const teamDoc = doc(db, 'teams', serialKey);
        const teamDocSnap = await getDoc(teamDoc);
        console.log(teamDocSnap)
        if (teamDocSnap.exists()) {
            throw new Error('This serial key already exists');
        } else {
            await setDoc(teamDoc, {
                name: teamName,
                serialKey: serialKey,
                members: []
            })
            console.log('Team created successfully')
            return serialKey
        }
    } catch (err) {
        throw err;
    }
}

export const insertUserIntoTeam = async (userId: string, teamSerial: string, admin: boolean) => {
    const teamDoc = doc(db, 'teams', teamSerial);
    const teamDocSnap = await getDoc(teamDoc);
    if (teamDocSnap.exists()) {
        const teamData = teamDocSnap.data();
        const members = teamData.members;
        const newMembers = [...members, { id: userId, admin: admin }];
        await setDoc(teamDoc, { members: newMembers }, { merge: true });
    } else {
        throw new Error('This team does not exist');
    }
}

export const getTeamsByUserId = async (userId: string) => {
    try {
        const teams = [];
        const querySnapshot = await getDocs(collection(db, 'teams'));
        querySnapshot.forEach((doc) => {
            const members = doc.data().members;
            const user = members.find(member => member.id === userId);
            if (user){
                teams.push(doc.data());
            }
        });
        return teams;
    } catch (err) {
        throw err;
    }
}

export const getTeamBySerialKey = async (serialKey: string) => {
    try {
        const teamDoc = doc(db, 'teams', serialKey);
        const teamDocSnap = await getDoc(teamDoc);
        if (teamDocSnap.exists()) {
            return teamDocSnap.data();
        }
        return null;
    } catch (err) {
        throw err;
    }
}

export const checkUserInGroup = async (userId: string, serialKey: string) => {
    try{
        const teamDoc = doc(db, 'teams', serialKey);
    const teamDocSnap = await getDoc(teamDoc);
    if (teamDocSnap.exists()) {
        const teamData = teamDocSnap.data();
        const members = teamData.members;
        const user = members.find(member => member.id === userId);
        return user ? true : false;
    } else {
        throw new Error('This team does not exist');
    }
    }catch(err){
        throw err;
    }
}
