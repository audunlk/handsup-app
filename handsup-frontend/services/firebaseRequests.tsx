import {
    doc, getDoc, setDoc, getDocs, collection, addDoc, query, where, deleteDoc,
    updateDoc, arrayUnion
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db, storage } from '../firebase/firebase';
import { FirestoreError } from 'firebase/firestore';
import { User } from '../redux/types/types';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { Message } from '../redux/types/types';

// import { GoogleSignin } from '@react-native-google-signin/google-signin';

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

export const checkUserAdmin = async (userId: string, teamSerial: string) => {
    const teamDoc = doc(db, 'teams', teamSerial);
    const teamDocSnap = await getDoc(teamDoc);
    if (teamDocSnap.exists()) {
        const teamData = teamDocSnap.data();
        const members = teamData.members;
        const user = members.find(member => member.id === userId);
        if (user) {
            return user.admin;
        }
        return false;
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

export const getMembersById = async (members: Array<{id: string, admin: boolean}>) => {
    try {
      const memberIds = members.map(member => member.id);
      const querySnapshot = await getDocs(query(collection(db, 'users'), where('id', 'in', memberIds)));
      const membersData = querySnapshot.docs.map((doc) => {
        const member = members.find(member => member.id === doc.data().id);
        return {
          ...doc.data(),
          admin: member.admin
        };
      });
      return membersData;
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
        const pollDoc = await setDoc(doc(db, 'polls', poll.id), poll);
        await setDoc(doc(db, 'answers', poll.id), {
            pollId: poll.id,
            answers: []
        }
        );
        console.log('Poll created successfully');
        return poll.id;
    } catch (err) {
        throw err;
    }
}

export const deletePoll = async (pollId: string) => {
    try {
        await deleteDoc(doc(db, 'polls', pollId));
        await deleteDoc(doc(db, 'answers', pollId));
        console.log('Poll deleted successfully');
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


//ANSWERS
//send index of answer to locate in array
export const addAnswer = async (pollId: string, answerIndex: number, userId: string) => {
    try {
        console.log(pollId, answerIndex, userId)
        const answerDoc = doc(db, 'answers', pollId);
        const answerDocSnap = await getDoc(answerDoc);
        if (answerDocSnap.exists()) {
            const answerData = answerDocSnap.data();
            const answers = answerData.answers;
            const newAnswers = [...answers, { userId: userId, answerIndex: answerIndex }];
            await setDoc(answerDoc, { answers: newAnswers }, { merge: true });
            console.log('Vote added successfully')
        } else {
            throw new Error('This poll does not exist');
        }
    } catch (err) {
        throw err;
    }
}

export const checkUserAnswer = async (pollId: string, userId: string) => {
    try {
        const answerDoc = doc(db, 'answers', pollId);
        const answerDocSnap = await getDoc(answerDoc);
        if (answerDocSnap.exists()) {
            const answerData = answerDocSnap.data();
            const answers = answerData.answers;
            const userAnswer = answers.find(answer => answer.userId === userId);
            return userAnswer
        } else {
            throw new Error('This poll does not exist');
        }
    } catch (err) {
        throw err;
    }
}

export const getUserPollStatus = async (pollId: string, userId: string, teamSerial: string) => {
    //check if admin
    try{
        const isAdmin = await checkUserAdmin(userId, teamSerial);
        console.log(isAdmin)
        console.log("is admin getUserPollStatus")
        //check if user has voted
        const userAnswer = await checkUserAnswer(pollId, userId);
        if(userAnswer){
            //check the answer from polls with index
            const pollDoc = doc(db, 'polls', pollId);
            const pollDocSnap = await getDoc(pollDoc);
            if (pollDocSnap.exists()) {
                const pollData = pollDocSnap.data();
                const pollAnswers = pollData.answers;
                const pollAnswer = pollAnswers[userAnswer.answerIndex];
                if(pollAnswer){
                    return { isAdmin: isAdmin, answer: pollAnswer };
                }
                
            } else {
                throw new Error('This poll does not exist');
            }
        }
        return { isAdmin: isAdmin, answer: null };
    }catch(err){
        throw err;
    }
}

export const getAnswersByPollId = async (pollId: string) => {
    try {
        const answerDoc = doc(db, 'answers', pollId);
        const answerDocSnap = await getDoc(answerDoc);
        if (answerDocSnap.exists()) {
            const answerData = answerDocSnap.data();
            return answerData.answers;
        }
        return [];
    } catch (err) {
        throw err;
    }
}

//IMAGE
export const uploadImageBlob = async (blob: Blob, id: string, type: string, onProgress: (progress: number) => void) => {
    return new Promise<void>(async (resolve, reject)  => {
      const storageRef = ref(storage, `/${type}/${id}`);
  
      const existingImageRef = ref(storage, `/${type}/${id}`);
      const existingImageSnapshot = await getDownloadURL(existingImageRef).catch(() => null);
  
      if (existingImageSnapshot) {
        await deleteObject(existingImageRef);
        console.log('Old image deleted')
      }
  
      const uploadTask = uploadBytesResumable(storageRef, blob);
      uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      }, (error) => {
        reject(error);
      }, () => {
        console.log('Image uploaded successfully');
        resolve();
      });
    });
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


//Chat
export const createGroupChat = async (teamSerial: string, userId: string) => {
    try {
        const newChat = await addDoc(collection(db, 'chat'), {
            id: teamSerial,
            members: [userId],
            messages: [],
        });
        return newChat.id;
    } catch (err) {
        console.log(err);
        throw new Error ('An unexpected error occurred while creating chat');
    }
}

export const createPollChat = async (pollId: string, userId: string) => {
    try {
        const newChat = await addDoc(collection(db, 'chat'), {
            id: pollId,
            members: [userId],
            messages: [],
        });
        return newChat.id;
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

