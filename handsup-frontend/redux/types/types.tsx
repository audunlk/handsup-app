import { StorageReference } from "firebase/storage";

export type User = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
  };

  export type Poll = {
    question: string;
    teamId: string;
    created_at: string;
    respond_by: string;
    multiple_choice: boolean;
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
