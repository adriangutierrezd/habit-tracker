import { v4 as uuidv4 } from 'uuid';
import { HTTP_CREATED_CODE, HTTP_CREATED_MSG, HABBIT_RECORD_STORAGE_KEY, HABBIT_STORAGE_KEY, HTTP_NOT_FOUND_CODE, HTTP_NOT_FOUND_MSG, HTTP_GENERAL_ERROR_MSG} from "../constants"
import { Habbit, HabbitRecord } from "../types"
import { getHeaders } from '../utils';

interface StoringProps {
    habbitId: string,
    date: string,
    token: string | undefined
}

export const storeLocalHabbitRecord = ({habbitId, date}: StoringProps) => {
    const habbitRecordData = {
        id: uuidv4(),
        habbitId,
        date,
        repetitions: 1
    }
    const localHabbitRecords = window.localStorage.getItem(HABBIT_RECORD_STORAGE_KEY)
    if(!localHabbitRecords){
        window.localStorage.setItem(HABBIT_RECORD_STORAGE_KEY, JSON.stringify([habbitRecordData]))
    }else{
        const dataHabbits = JSON.parse(localHabbitRecords)
        const recordIndex = dataHabbits.findIndex((habbitRecord: HabbitRecord) => habbitRecord.habbitId == habbitId && habbitRecord.date == date)
        if(recordIndex === -1){
            window.localStorage.setItem(HABBIT_RECORD_STORAGE_KEY, JSON.stringify([...dataHabbits, habbitRecordData]))
        }else{
            dataHabbits[recordIndex] = {
                ...dataHabbits[recordIndex],
                repetitions: dataHabbits[recordIndex].repetitions + 1
            }
            window.localStorage.setItem(HABBIT_RECORD_STORAGE_KEY, JSON.stringify(dataHabbits))
        }
        
    }

    const localHabbits = window.localStorage.getItem(HABBIT_STORAGE_KEY)
    if(localHabbits){
        const localHabbitsData = JSON.parse(localHabbits)
        const habbitIndex = localHabbitsData.findIndex((habbit: Habbit) => habbit.id == habbitId)
        if(habbitIndex === -1){
            return {
                status: HTTP_NOT_FOUND_CODE,
                data: [],
                message: HTTP_NOT_FOUND_MSG
            }
        }

        const newRecords = window.localStorage.getItem(HABBIT_RECORD_STORAGE_KEY)
        if(newRecords){
            const recordsData = JSON.parse(newRecords)
            localHabbitsData[habbitIndex].records = recordsData.filter((record: HabbitRecord) => record.habbitId === habbitId)
            window.localStorage.setItem(HABBIT_STORAGE_KEY, JSON.stringify(localHabbitsData))
        }

    }   

    return {
        status: HTTP_CREATED_CODE,
        data: habbitRecordData,
        message: HTTP_CREATED_MSG
    }

}

export const storeRemoteHabbitRecord = async ({habbitId, date, token}: StoringProps) => {
    try{

        const myHeaders = getHeaders(token ?? null)

        const raw = JSON.stringify({ habitId: habbitId, date, repetitions: 1 });
    
        const requestOptions: RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
    
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/habit-records`, requestOptions)
        const data = await response.json()
        if(data.status !== HTTP_CREATED_CODE) throw new Error(data.message)
        return data

    }catch(error){
        throw new Error(error instanceof Error ? error.message : HTTP_GENERAL_ERROR_MSG)
    }
}