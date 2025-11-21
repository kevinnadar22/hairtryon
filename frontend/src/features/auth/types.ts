interface User {
    name: string;
    profilePictureUrl?: string | null;
    email: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;

    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

export type { User };