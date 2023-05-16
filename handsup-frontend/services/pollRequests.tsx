import {
    doc, getDoc, setDoc, getDocs, collection, deleteDoc
} from 'firebase/firestore';
import {  db } from '../firebase/firebase';
import { Member, Poll } from '../redux/types/types';



//POLLS
export const createPoll = async (poll: Poll) => {
    try {
        await setDoc(doc(db, 'polls', poll.id), poll);
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
        await deleteDoc(doc(db, 'chat', pollId))
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
        const polls: Poll[] = [];
        const querySnapshot = await getDocs(collection(db, 'polls'));
        querySnapshot.forEach((doc) => {
            const members = doc.data().members as Member[];
            const user = members.find(member => member.id === userId);
            if (user) {
                polls.push(doc.data() as Poll);
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
        const polls: Poll[] = [];
        const querySnapshot = await getDocs(collection(db, 'polls'));
        querySnapshot.forEach((doc) => {
            if (serials.includes(doc.data().teamSerial)) {
                polls.push(doc.data() as Poll);
            }
        });
        return polls;
    } catch (err) {
        console.log(err);
        throw new Error ('An unexpected error occurred while getting polls');
    }
};
