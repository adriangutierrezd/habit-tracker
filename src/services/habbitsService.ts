import { v4 as uuidv4 } from 'uuid';
import { HabbitFrequencies } from '../types';

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
        status: 201,
        data: habbitData,
        message: 'Recurso creado con éxito'
    }

}

export const deleteLocalHabbit = ({habbitId}: {habbitId: string}) => {
    const localHabbits = window.localStorage.getItem('habbits')
    if(!localHabbits){
        return {
            status: 200,
            data: [],
            message: 'Recurso eliminado con éxito'
        }
    }else{
        const dataHabbits = JSON.parse(localHabbits)
        window.localStorage.setItem('habbits', JSON.stringify(dataHabbits.filter((dHabbit: any) => dHabbit.id !== habbitId )))
        return {
            status: 200,
            data: [],
            message: 'Recurso eliminado con éxito'
        }
    }
}

export const getLocalHabbits = () => {
    const localHabbits = window.localStorage.getItem('habbits')
    return {
        status: 200,
        data: localHabbits ? JSON.parse(localHabbits) : [],
        message: 'Datos obtenidos con éxito'
    }
}