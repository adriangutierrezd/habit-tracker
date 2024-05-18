export interface UserData {
    id: number;
    name: string;
    email: string;
}

export type HabitFrequencies = 'DAY' | 'WEEK' | 'MONTH' | 'FORTNIGHT';

export interface UserSession {
    token: string | null;
    user: UserData | null;
    isLogged: boolean
}

export interface BasicOption {
    label: string;
    value: string;
}

export interface HabitRecord {
    id: string;
    habitId: string;
    date: string;
    repetitions: number;
}

export interface Habit {
    id: string;
    name: string;
    description: string | null;
    color: string;
    frequency: HabitFrequencies;
    maxRepetitions: number;
    records?: HabitRecord[];
}

export type HeatmapData = { x: string; y: string; value: number }[];
