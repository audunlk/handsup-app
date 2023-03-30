import { User } from "../store/types";

export const setUser  = (user: User) =>{
    return {
        type: 'SET_USER',
        payload: user
    }
}