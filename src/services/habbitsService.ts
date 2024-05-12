import { v4 as uuidv4 } from 'uuid';
import { Habbit, HabbitFrequencies } from '../types';
import { HABBIT_STORAGE_KEY, HTTP_CREATED_CODE, HTTP_CREATED_MSG, HTTP_DELETED_MSG, HTTP_FETCHED_MSG, HTTP_GENERAL_ERROR_MSG, HTTP_NOT_FOUND_CODE, HTTP_NOT_FOUND_MSG, HTTP_OK_CODE, HTTP_UPDATED_MSG } from '../constants';
import { getHeaders } from '../utils';

interface StoringProps {
    name: string,
    description: string | null,
    color: string,
    maxRepetitions: number,
    frequency: HabbitFrequencies,
    token: string | undefined
}

interface UpdatingProps {
    id: string,
    name: string,
    description: string | null,
    color: string,
    maxRepetitions: number,
    frequency: HabbitFrequencies,
    token: string | undefined
}

export const storeLocalHabbit = ({name, description, color, maxRepetitions, frequency}: StoringProps) => {
    const habbitData = {
        id: uuidv4(),
        name,
        description,
        color,
        maxRepetitions,
        frequency,
        records: []
    }

    const localHabbits = window.localStorage.getItem(HABBIT_STORAGE_KEY)
    if(!localHabbits){
        window.localStorage.setItem(HABBIT_STORAGE_KEY, JSON.stringify([habbitData]))
    }else{
        const dataHabbits = JSON.parse(localHabbits)
        window.localStorage.setItem(HABBIT_STORAGE_KEY, JSON.stringify([...dataHabbits, habbitData]))
    }

    return {
        status: HTTP_CREATED_CODE,
        data: habbitData,
        message: HTTP_CREATED_MSG
    }

}

export const deleteLocalHabbit = ({habbitId}: {habbitId: string}) => {
    const localHabbits = window.localStorage.getItem(HABBIT_STORAGE_KEY)
    if(!localHabbits){
        return {
            status: HTTP_NOT_FOUND_CODE,
            data: [],
            message: HTTP_NOT_FOUND_MSG
        }
    }else{
        const dataHabbits = JSON.parse(localHabbits)
        window.localStorage.setItem(HABBIT_STORAGE_KEY, JSON.stringify(dataHabbits.filter((dHabbit: any) => dHabbit.id !== habbitId )))
        return {
            status: HTTP_OK_CODE,
            data: [],
            message: HTTP_DELETED_MSG
        }
    }
}

export const getLocalHabbits = () => {
    const localHabbits = window.localStorage.getItem(HABBIT_STORAGE_KEY)
    return {
        status: HTTP_OK_CODE,
        data: localHabbits ? JSON.parse(localHabbits) : [],
        message: HTTP_FETCHED_MSG
    }
}

export const updateLocalHabbit = ({name, description, color, maxRepetitions, frequency, id}: UpdatingProps) => {
    
    const habbitData = {
        id,
        name,
        description,
        color,
        maxRepetitions,
        frequency
    }

    const localHabbits = window.localStorage.getItem(HABBIT_STORAGE_KEY)
    if(!localHabbits){
        return {
            status: HTTP_NOT_FOUND_CODE,
            data: [],
            message: HTTP_NOT_FOUND_MSG
        }
    }

    const dataHabbits = JSON.parse(localHabbits)
    const habbitIndex = dataHabbits.findIndex((habbit: Habbit) => habbit.id == id)
    if(habbitIndex === -1){
        return {
            status: HTTP_NOT_FOUND_CODE,
            data: [],
            message: HTTP_NOT_FOUND_MSG
        }
    }

    dataHabbits[habbitIndex] = habbitData
    window.localStorage.setItem(HABBIT_STORAGE_KEY, JSON.stringify(dataHabbits))

    return {
        status: HTTP_OK_CODE,
        data: habbitData,
        message: HTTP_UPDATED_MSG
    }

}

export const storeRemoteHabbit = async({name, description, color, maxRepetitions, frequency, token}: StoringProps) => {
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

export const updateRemoteHabbit = async({name, description, color, maxRepetitions, frequency, token, id}: UpdatingProps) => {
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

export const getRemoteHabbits = async (token: string) => {
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