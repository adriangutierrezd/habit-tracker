import { v4 as uuidv4 } from 'uuid';
import { Habbit, HabbitFrequencies } from '../types';
import { HTTP_CREATED_CODE, HTTP_CREATED_MSG, HTTP_DELETED_MSG, HTTP_FETCHED_MSG, HTTP_NOT_FOUND_CODE, HTTP_NOT_FOUND_MSG, HTTP_OK_CODE, HTTP_UPDATED_MSG } from '../constants';

export const storeLocalHabbit = ({name, description, color, maxRepetitions, frequency}: {name: string, description: string | null, color: string, maxRepetitions: number, frequency: HabbitFrequencies}) => {
    const habbitData = {
        id: uuidv4(),
        name,
        description,
        color,
        maxRepetitions,
        frequency
    }

    const localHabbits = window.localStorage.getItem('habbits')
    if(!localHabbits){
        window.localStorage.setItem('habbits', JSON.stringify([habbitData]))
    }else{
        const dataHabbits = JSON.parse(localHabbits)
        window.localStorage.setItem('habbits', JSON.stringify([...dataHabbits, habbitData]))
    }

    return {
        status: HTTP_CREATED_CODE,
        data: habbitData,
        message: HTTP_CREATED_MSG
    }

}

export const deleteLocalHabbit = ({habbitId}: {habbitId: string}) => {
    const localHabbits = window.localStorage.getItem('habbits')
    if(!localHabbits){
        return {
            status: HTTP_NOT_FOUND_CODE,
            data: [],
            message: HTTP_NOT_FOUND_MSG
        }
    }else{
        const dataHabbits = JSON.parse(localHabbits)
        window.localStorage.setItem('habbits', JSON.stringify(dataHabbits.filter((dHabbit: any) => dHabbit.id !== habbitId )))
        return {
            status: HTTP_OK_CODE,
            data: [],
            message: HTTP_DELETED_MSG
        }
    }
}

export const getLocalHabbits = () => {
    const localHabbits = window.localStorage.getItem('habbits')
    return {
        status: HTTP_OK_CODE,
        data: localHabbits ? JSON.parse(localHabbits) : [],
        message: HTTP_FETCHED_MSG
    }
}

export const updateLocalHabbit = ({name, description, color, maxRepetitions, frequency, id}: {id: string, name: string, description: string | null, color: string, maxRepetitions: number, frequency: HabbitFrequencies}) => {
    
    const habbitData = {
        id,
        name,
        description,
        color,
        maxRepetitions,
        frequency
    }

    const localHabbits = window.localStorage.getItem('habbits')
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
    window.localStorage.setItem('habbits', JSON.stringify(dataHabbits))

    return {
        status: HTTP_OK_CODE,
        data: habbitData,
        message: HTTP_UPDATED_MSG
    }

    
}