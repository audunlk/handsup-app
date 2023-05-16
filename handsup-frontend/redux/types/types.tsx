import { StorageReference } from "firebase/storage";

export type User = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    expoPushToken: string;
  };

  export type Member = {
    id: string;
    admin: boolean;
  }

  export type Team = {
    name: string;
    members: Member[];
    serialKey: string;    
  }

  export type Poll = {
    question: string;
    teamSerial: string;
    created_at: string;
    respond_by: string;
    teamName: string;
    id: string;
    answers: string[];
    anonymous: boolean;
  };

  export interface Message {
    _id: string;
    text: string;
    createdAt: string;
    user: {
      _id: string;
      name: string;
    };
  }

  export type RootState = {
    user: User | null;
    isLoading: boolean;
    token: string | null;
    polls: Poll[];
    isLoggedIn: boolean;
    reRender: boolean;
  };

export type ReRenderState = boolean;
