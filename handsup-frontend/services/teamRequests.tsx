import {
    doc, getDoc, setDoc, getDocs, collection, query, where, deleteDoc
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { deleteImage } from './imageRequests';


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
            if (Array.isArray(members)) {
                const user = members.find(member => member.id === userId);
                if (user) {
                  teams.push(doc.data());
                }
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

export const leaveGroup = async (userId: string, serialKey: string) => {
    try {
        const teamDoc = doc(db, 'teams', serialKey);
        const teamDocSnap = await getDoc(teamDoc);
        if (teamDocSnap.exists()) {
            const teamData = teamDocSnap.data();
            const members = teamData.members;
            const newMembers = members.filter(member => member.id !== userId);
            await setDoc(teamDoc, { members: newMembers }, { merge: true });
        } else {
            throw new Error('This team does not exist');
        }
    } catch (err) {
        throw err;
    }
}

export const deleteTeam = async (serialKey: string) => {
    console.log(serialKey)
    try {
        await deleteDoc(doc(db, 'chat', serialKey))
        await deleteImage(serialKey, 'teams')
        const pollRef = collection(db, 'polls');
        const pollQuery = query(pollRef, where('teamSerial', '==', serialKey));
        const pollQuerySnapshot = await getDocs(pollQuery);
        pollQuerySnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
            await deleteImage(doc.id, 'polls')
        });
        await deleteDoc(doc(db, 'teams', serialKey));
    } catch (err) {
        throw err;
    }
}

export const makeAdmin = async (userId: string, serialKey: string) => {
    try {
        const teamDoc = doc(db, 'teams', serialKey);
        const teamDocSnap = await getDoc(teamDoc);
        if (teamDocSnap.exists()) {
            const teamData = teamDocSnap.data();
            const members = teamData.members;
            const newMembers = members.map(member => {
                if (member.id === userId) {
                    return { ...member, admin: true };
                }
                return member;
            });
            await setDoc(teamDoc, { members: newMembers }, { merge: true });
        } else {
            throw new Error('This team does not exist');
        }
    } catch (err) {
        throw err;
    }
}