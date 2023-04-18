import {
    doc, getDoc, setDoc, getDocs, collection, addDoc, query, where,
    updateDoc, arrayUnion
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db, storage } from '../firebase/firebase';
import { FirestoreError } from 'firebase/firestore';
import { User } from '../redux/types/types';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { uploadBytes } from 'firebase/storage';


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
            if (user) {
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

export const checkUserInTeam = async (userId: string, serialKey: string) => {
    try {
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
    } catch (err) {
        throw err;
    }
}

//POLLS
export const createPoll = async (poll: any) => {
    try {
        const pollDoc = await addDoc(collection(db, 'polls'), poll);
        console.log('Poll created successfully');
        return pollDoc.id;
    } catch (err) {
        throw err;
    }
}

export const getPollsByTeamSerial = async (serial: string) => {
    try {
        const polls = [];
        const querySnapshot = await getDocs(collection(db, 'polls'));
        querySnapshot.forEach((doc) => {
            if (doc.data().teamSerial === serial) {
                polls.push(doc.data());
            }
        });
        return polls;
    } catch (err) {
        console.log(err);
        throw new Error ('An unexpected error occurred while getting polls');
    }
};

export const getPollsByUserId = async (userId: string) => {
    try {
        const polls = [];
        const querySnapshot = await getDocs(collection(db, 'polls'));
        querySnapshot.forEach((doc) => {
            const members = doc.data().members;
            const user = members.find(member => member.id === userId);
            if (user) {
                polls.push(doc.data());
            }
        });
        return polls;
    } catch (err) {
        console.log(err)
        throw new Error('An unexpected error occurred while getting polls');
    }
}

export const getPollById = async (pollId: string) => {
    try {
        const pollDoc = doc(db, 'polls', pollId);
        const pollDocSnap = await getDoc(pollDoc);
        if (pollDocSnap.exists()) {
            return pollDocSnap.data();
        }
        return null;
    } catch (err) {
        throw err;
    }
}

export const getPollsByTeamSerials = async (serials: string[]) => {
    try {
        const polls = [];
        const querySnapshot = await getDocs(collection(db, 'polls'));
        querySnapshot.forEach((doc) => {
            if (serials.includes(doc.data().teamSerial)) {
                polls.push(doc.data());
            }
        });
        return polls;
    } catch (err) {
        console.log(err);
        throw new Error ('An unexpected error occurred while getting polls');
    }
};


export const insertAnswer = async (pollId: string, userId: string, answer: string) => {
    const pollQuerySnapshot = await getDocs(
    query(collection(db, 'polls'), 
    where('id', '==', pollId)));
    if (pollQuerySnapshot.empty) {
      throw new Error('Poll does not exist');
    }
    const pollDocRef = doc(db, 'polls', pollQuerySnapshot.docs[0].id);
    try {
      await updateDoc(pollDocRef, {
        membersAnswered: arrayUnion({ answer, userId }),
      });
    } catch (err) {
      throw new Error('Error updating poll');
    }
  };

export const hasUserAnsweredPoll = async (pollId: string, userId: string) => {
    try {
        const pollQuerySnapshot = await getDocs(
            query(collection(db, 'polls'),
                where('id', '==', pollId)));
        if (pollQuerySnapshot.empty) {
            throw new Error('Poll does not exist');
        }
        const pollDocRef = doc(db, 'polls', pollQuerySnapshot.docs[0].id);
        const pollDocSnap = await getDoc(pollDocRef);
        if (pollDocSnap.exists()) {
            const membersAnswered = pollDocSnap.data().membersAnswered;
            const user = membersAnswered.find(member => member.userId === userId);
            if(user){
                return user.answer;
            }
            return false;
        }
        return null;
    } catch (err) {
        throw err;
    }
}

//IMAGE
export const uploadImageBlob = async (blob: Blob, id: string, type: string) => {
    const storageRef = ref(storage, `${type}/${id}`);
    const uploadTask = uploadBytesResumable(storageRef, blob);
    uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
            case 'paused':
                console.log('Upload is paused');
                break;
            case 'running':
                console.log('Upload is running');
                break;
        }
    }
        , (error) => {
            throw error;
        }
        , () => {
            console.log('Image uploaded successfully');
        }
    );
  }

export const getImage = async (id: string, type: string) => {
    try{
        const storageRef = ref(storage, `${type}/${id}`);
        const url = await getDownloadURL(storageRef);
        return url ? url : null;
    }catch(err){
        console.log('Image not found');
    }
}
