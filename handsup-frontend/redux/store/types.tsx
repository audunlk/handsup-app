export type User = {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };


  export type RootState = {
    user: User | null;
    isLoading: boolean;
    token: string;
    error: string;
    // Add other slices of state here as needed
  };