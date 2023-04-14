export type User = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
  };

  export type Poll = {
    id: number;
    question: string;
    group_id: number;
    created_at: string;
    name: string;
    respond_by: string;
    multiple_choice: boolean;
  };

  export type RootState = {
    user: User | null;
    isLoading: boolean;
    token: string | null;
    polls: Poll[];
    isLoggedIn: boolean;
  };