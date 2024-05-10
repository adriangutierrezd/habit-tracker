export interface UserData {
    id: number;
    name: string;
    email: string;
}

export type HabbitFrequencies = 'DAY' | 'WEEK' | 'MONTH' | 'FORTNIGHT';

export interface UserSession {
    token: string | null;
    user: UserData | null;
    isLogged: boolean
}

export interface BasicOption {
    label: string;
    value: string;
}

export interface Habbit {
    id: string;
    name: string;
    description: string | null;
    color: string;
    frequency: HabbitFrequencies;
    maxRepetitions: number;
}
