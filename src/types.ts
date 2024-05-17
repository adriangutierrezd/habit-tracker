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

export interface HabbitRecord {
    id: string;
    habbitId: string;
    date: string;
    repetitions: number;
}

export interface Habbit {
    id: string;
    name: string;
    description: string | null;
    color: string;
    frequency: HabbitFrequencies;
    maxRepetitions: number;
    records?: HabbitRecord[];
}

export type HeatmapData = { x: string; y: string; value: number }[];
