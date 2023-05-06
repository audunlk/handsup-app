import {
    doc, getDoc, setDoc
} from 'firebase/firestore';
import { db} from '../firebase/firebase';

import { checkUserAdmin } from './teamRequests';

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