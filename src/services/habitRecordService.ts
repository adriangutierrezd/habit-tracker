import { getHeaders } from '../utils';
import { Habit, HabitRecord } from "../types"
import { HTTP_GENERAL_ERROR_MSG, HTTP_OK_CODE } from "../constants"
import { v4 as uuidv4 } from 'uuid';

export const addLocaleRepetitionToHabit = ({ habit, date }: { habit: Habit, date: string }) => {

    const records = structuredClone(habit.records ?? [])
    const findRecordIndex = records.findIndex((record: HabitRecord) => record.date === date)
    if(findRecordIndex === -1){
        const newHabit = {
            ...habit,
            records: [
                ...records,
                {
                    id: uuidv4(),
                    date,
                    repetitions: 1
                }
            ]
        }

        return newHabit
    }

    const updatedRecord = {
        ...records[findRecordIndex],
        repetitions: records[findRecordIndex].repetitions + 1
    }

    records[findRecordIndex] = updatedRecord
    return {
        ...habit, 
        records
    }

}

export const resetLocalHabitRepetitions =  ({ habit, date }: { habit: Habit, date: string }) => {
    const records = structuredClone(habit.records ?? [])
    const findRecordIndex = records.findIndex((record: HabitRecord) => record.date === date)
    if(findRecordIndex === -1){
        const newHabit = {
            ...habit,
            records: [
                ...records,
                {
                    id: uuidv4(),
                    date,
                    repetitions: 0
                }
            ]
        }

        return newHabit
    }

    const updatedRecord = {
        ...records[findRecordIndex],
        repetitions: 0
    }

    records[findRecordIndex] = updatedRecord
    return {
        ...habit, 
        records
    }

}

export const addRemoteRepetitionToHabit = async ({ token, habit, date }: { token: string | null, habit: Habit, date: string }) => {
    try{

        const myHeaders = getHeaders(token)

        const raw = JSON.stringify({ date });
    
        const requestOptions: RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
    
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/add-habit-record-repetition/${habit.id}`, requestOptions)
        const data = await response.json()
        if(data.status !== HTTP_OK_CODE) throw new Error(data.message)
        return data

    }catch(error){
        throw new Error(error instanceof Error ? error.message : HTTP_GENERAL_ERROR_MSG)
    }
}

export const resetRemoteRepetitionToHabit = async ({ token, habit, date }: { token: string | null, habit: Habit, date: string }) => {
    try{

        const myHeaders = getHeaders(token)

        const raw = JSON.stringify({ date });
    
        const requestOptions: RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
    
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reset-habit-record-repetition/${habit.id}`, requestOptions)
        const data = await response.json()
        if(data.status !== HTTP_OK_CODE) throw new Error(data.message)
        return data

    }catch(error){
        throw new Error(error instanceof Error ? error.message : HTTP_GENERAL_ERROR_MSG)
    }
}

export const setLocaleHabitRepetitions = ({ habit, date, repetitions }: { habit: Habit, date: string, repetitions: number }) => {
    const records = structuredClone(habit.records ?? [])
    const findRecordIndex = records.findIndex((record: HabitRecord) => record.date === date)
    if(findRecordIndex === -1){
        return
    }

    const updatedRecord = {
        ...records[findRecordIndex],
        repetitions
    }

    records[findRecordIndex] = updatedRecord
    return {
        ...habit, 
        records
    }

}