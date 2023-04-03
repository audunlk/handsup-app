export type User = {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    username: string;
    password: string;
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