export interface UserData {
    id: number;
    name: string;
    email: string;
}

export interface UserSession {
    token: string | null;
    user: UserData | null;
}