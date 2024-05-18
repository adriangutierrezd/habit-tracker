import { v4 as uuidv4 } from 'uuid';
import { HTTP_CREATED_CODE, HTTP_CREATED_MSG, HABIT_RECORD_STORAGE_KEY, HABIT_STORAGE_KEY, HTTP_NOT_FOUND_CODE, HTTP_NOT_FOUND_MSG, HTTP_GENERAL_ERROR_MSG, HTTP_OK_CODE} from "../constants"
import { Habit, HabitRecord } from "../types"
import { getHeaders } from '../utils';

interface StoringProps {
    habitId: string,
    date: string,
    token: string | undefined
}

interface UpdatingProps {
    habitRecordId: string,
    repetitions: number,
    token: string | undefined
}

export const storeLocalHabitRecord = ({habitId, date}: StoringProps) => {
    const habitRecordData = {
        id: uuidv4(),
        habitId,
        date,
        repetitions: 1
    }
    const localHabitRecords = window.localStorage.getItem(HABIT_RECORD_STORAGE_KEY)
    if(!localHabitRecords){
        window.localStorage.setItem(HABIT_RECORD_STORAGE_KEY, JSON.stringify([habitRecordData]))
    }else{
        const dataHabits = JSON.parse(localHabitRecords)
        const recordIndex = dataHabits.findIndex((habitRecord: HabitRecord) => habitRecord.habitId == habitId && habitRecord.date == date)
        if(recordIndex === -1){
            window.localStorage.setItem(HABIT_RECORD_STORAGE_KEY, JSON.stringify([...dataHabits, habitRecordData]))
        }else{
            dataHabits[recordIndex] = {
                ...dataHabits[recordIndex],
                repetitions: dataHabits[recordIndex].repetitions + 1
            }
            window.localStorage.setItem(HABIT_RECORD_STORAGE_KEY, JSON.stringify(dataHabits))
        }
        
    }

    const localHabits = window.localStorage.getItem(HABIT_STORAGE_KEY)
    if(localHabits){
        const localHabitsData = JSON.parse(localHabits)
        const habitIndex = localHabitsData.findIndex((habit: Habit) => habit.id == habitId)
        if(habitIndex === -1){
            return {
                status: HTTP_NOT_FOUND_CODE,
                data: [],
                message: HTTP_NOT_FOUND_MSG
            }
        }

        const newRecords = window.localStorage.getItem(HABIT_RECORD_STORAGE_KEY)
        if(newRecords){
            const recordsData = JSON.parse(newRecords)
            localHabitsData[habitIndex].records = recordsData.filter((record: HabitRecord) => record.habitId === habitId)
            window.localStorage.setItem(HABIT_STORAGE_KEY, JSON.stringify(localHabitsData))
        }

    }   

    return {
        status: HTTP_CREATED_CODE,
        data: habitRecordData,
        message: HTTP_CREATED_MSG
    }

}

export const storeRemoteHabitRecord = async ({habitId, date, token}: StoringProps) => {
    try{

        const myHeaders = getHeaders(token ?? null)

        const raw = JSON.stringify({ habitId: habitId, date, repetitions: 1 });
    
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

export const updateRemoteHabitRecord = async ({habitRecordId, repetitions, token}: UpdatingProps) => {
    try{

        const myHeaders = getHeaders(token ?? null)

        const raw = JSON.stringify({ repetitions });
    
        const requestOptions: RequestInit = {
            method: 'PATCH',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
    
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/habit-records/${habitRecordId}`, requestOptions)
        const data = await response.json()
        if(data.status !== HTTP_OK_CODE) throw new Error(data.message)
        return data

    }catch(error){
        throw new Error(error instanceof Error ? error.message : HTTP_GENERAL_ERROR_MSG)
    }
}