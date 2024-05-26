import { HTTP_CREATED_CODE, HTTP_GENERAL_ERROR_MSG, HTTP_OK_CODE } from '../constants';
import { getHeaders } from '../utils';

interface StoringProps {
    name: string,
    description: string | null,
    color: string,
    maxRepetitions: number,
    token: string | undefined
}

interface UpdatingProps {
    id: string,
    name: string,
    description: string | null,
    color: string,
    maxRepetitions: number,
    token: string | undefined
}

export const storeRemoteHabit = async({name, description, color, maxRepetitions, token}: StoringProps) => {
    try{

        const myHeaders = getHeaders(token ?? null)

        const raw = JSON.stringify({ name, description, color, maxRepetitions });
    
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

export const updateRemoteHabit = async({name, description, color, maxRepetitions, token, id}: UpdatingProps) => {
    try{

        const myHeaders = getHeaders(token ?? null)

        const raw = JSON.stringify({ name, description, color, maxRepetitions });
    
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