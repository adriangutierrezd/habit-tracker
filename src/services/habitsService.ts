import { v4 as uuidv4 } from 'uuid';
import { Habit, HabitFrequencies } from '../types';
import { HABIT_STORAGE_KEY, HTTP_CREATED_CODE, HTTP_CREATED_MSG, HTTP_DELETED_MSG, HTTP_FETCHED_MSG, HTTP_GENERAL_ERROR_MSG, HTTP_NOT_FOUND_CODE, HTTP_NOT_FOUND_MSG, HTTP_OK_CODE, HTTP_UPDATED_MSG } from '../constants';
import { getHeaders } from '../utils';

interface StoringProps {
    name: string,
    description: string | null,
    color: string,
    maxRepetitions: number,
    frequency: HabitFrequencies,
    token: string | undefined
}

interface UpdatingProps {
    id: string,
    name: string,
    description: string | null,
    color: string,
    maxRepetitions: number,
    frequency: HabitFrequencies,
    token: string | undefined
}

export const storeLocalHabit = ({name, description, color, maxRepetitions, frequency}: StoringProps) => {
    const habitData = {
        id: uuidv4(),
        name,
        description,
        color,
        maxRepetitions,
        frequency,
        records: []
    }

    const localHabits = window.localStorage.getItem(HABIT_STORAGE_KEY)
    if(!localHabits){
        window.localStorage.setItem(HABIT_STORAGE_KEY, JSON.stringify([habitData]))
    }else{
        const dataHabits = JSON.parse(localHabits)
        window.localStorage.setItem(HABIT_STORAGE_KEY, JSON.stringify([...dataHabits, habitData]))
    }

    return {
        status: HTTP_CREATED_CODE,
        data: habitData,
        message: HTTP_CREATED_MSG
    }

}

export const deleteLocalHabit = ({habitId}: {habitId: string}) => {
    const localHabits = window.localStorage.getItem(HABIT_STORAGE_KEY)
    if(!localHabits){
        return {
            status: HTTP_NOT_FOUND_CODE,
            data: [],
            message: HTTP_NOT_FOUND_MSG
        }
    }else{
        const dataHabits = JSON.parse(localHabits)
        window.localStorage.setItem(HABIT_STORAGE_KEY, JSON.stringify(dataHabits.filter((dHabit: any) => dHabit.id !== habitId )))
        return {
            status: HTTP_OK_CODE,
            data: [],
            message: HTTP_DELETED_MSG
        }
    }
}

export const getLocalHabits = () => {
    const localHabits = window.localStorage.getItem(HABIT_STORAGE_KEY)
    return {
        status: HTTP_OK_CODE,
        data: localHabits ? JSON.parse(localHabits) : [],
        message: HTTP_FETCHED_MSG
    }
}

export const updateLocalHabit = ({name, description, color, maxRepetitions, frequency, id}: UpdatingProps) => {
    
    const habitData = {
        id,
        name,
        description,
        color,
        maxRepetitions,
        frequency
    }

    const localHabits = window.localStorage.getItem(HABIT_STORAGE_KEY)
    if(!localHabits){
        return {
            status: HTTP_NOT_FOUND_CODE,
            data: [],
            message: HTTP_NOT_FOUND_MSG
        }
    }

    const dataHabits = JSON.parse(localHabits)
    const habitIndex = dataHabits.findIndex((habit: Habit) => habit.id == id)
    if(habitIndex === -1){
        return {
            status: HTTP_NOT_FOUND_CODE,
            data: [],
            message: HTTP_NOT_FOUND_MSG
        }
    }

    dataHabits[habitIndex] = habitData
    window.localStorage.setItem(HABIT_STORAGE_KEY, JSON.stringify(dataHabits))

    return {
        status: HTTP_OK_CODE,
        data: habitData,
        message: HTTP_UPDATED_MSG
    }

}

export const storeRemoteHabit = async({name, description, color, maxRepetitions, frequency, token}: StoringProps) => {
    try{

        const myHeaders = getHeaders(token ?? null)

        const raw = JSON.stringify({ name, description, color, maxRepetitions, frequency });
    
        const requestOptions: RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
    
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/habits`, requestOptions)
        const data = await response.json()
        if(data.status !== HTTP_CREATED_CODE) throw new Error(data.message)
        return data

    }catch(error){
        throw new Error(error instanceof Error ? error.message : HTTP_GENERAL_ERROR_MSG)
    }
}

export const updateRemoteHabit = async({name, description, color, maxRepetitions, frequency, token, id}: UpdatingProps) => {
    try{

        const myHeaders = getHeaders(token ?? null)

        const raw = JSON.stringify({ name, description, color, maxRepetitions, frequency });
    
        const requestOptions: RequestInit = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
    
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/habits/${id}`, requestOptions)
        const data = await response.json()
        if(data.status !== HTTP_OK_CODE) throw new Error(data.message)
        return data

    }catch(error){
        throw new Error(error instanceof Error ? error.message : HTTP_GENERAL_ERROR_MSG)
    }
}

export const getRemoteHabits = async (token: string) => {
    try{

        const myHeaders = getHeaders(token ?? null)

        const requestOptions: RequestInit = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
    
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/habits`, requestOptions)
        const data = await response.json()
        if(data.status !== HTTP_OK_CODE) throw new Error(data.message)
        return data

    }catch(error){
        throw new Error(error instanceof Error ? error.message : HTTP_GENERAL_ERROR_MSG)
    }
}

export const deleteRemoteHabit = async ({token, habitId}: { token: string, habitId: string }) => {
    try{

        const myHeaders = getHeaders(token ?? null)

        const requestOptions: RequestInit = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
        };
    
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/habits/${habitId}`, requestOptions)
        const data = await response.json()
        if(data.status !== HTTP_OK_CODE) throw new Error(data.message)
        return data

    }catch(error){
        throw new Error(error instanceof Error ? error.message : HTTP_GENERAL_ERROR_MSG)
    }
}