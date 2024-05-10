import { useState } from "react";
import { AVAILABLE_COLORS, HABIT_FREQUENCY } from "../constants";
import { BasicOption, Habbit, HabbitFrequencies } from "../types";
import { CirclePlus, Minus, Plus } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { storeLocalHabbit } from "../services/habbitsService";

const MODAL_ID = 'HabbitModal'


interface Props {
    readonly handleAddHabbit: (data: Habbit) => void
}

export default function HabbitModal({handleAddHabbit}: Props) {

    const [habbitName, setHabbitName] = useState<string>('')
    const [habbitDescription, setHabbitDescription] = useState<string>('')
    const [habbitFrequency, setHabbitFrequency] = useState<HabbitFrequencies>()
    const [habbitColor, setHabbitColor] = useState<string>('')
    const [habbitMaxReps, setHabbitMaxReps] = useState<number>(1)
    const [habbitNameError, setHabbitNameError] = useState<string>()
    const [habbitDescriptionError, setHabbitDescriptionError] = useState<string>()
    const [habbitColorError, setHabbitColorError] = useState<string>()
    const [habbitMaxRepsError, setHabbitMaxRepsError] = useState<string>()
    const [habbitFrequencyError, setHabbitFrequencyError] = useState<string>('')
    const { isLogged } = useSelector((state: RootState) => {
        return state.userSession
    });


    const handleChangeModalStatus = (status: boolean) => {
        resetFields()
        clearErrors()

        if(status){
            document.getElementById(MODAL_ID)?.showModal()
        }else{
            document.getElementById(MODAL_ID)?.close()
        }

    }

    const isMinusBtnDisabled = () => {
        return habbitMaxReps <= 1
    }

    const handleMaxRepsChange = (action: "PLUS" | "MINUS") => {
        if(action === 'PLUS'){
            setHabbitMaxReps(habbitMaxReps + 1)
        }else{
            setHabbitMaxReps(habbitMaxReps - 1)
        }
    }

    const clearErrors = () => {
        setHabbitNameError('')
        setHabbitDescriptionError('')
        setHabbitColorError('')
        setHabbitMaxRepsError('')
        setHabbitFrequencyError('')
    }

    const resetFields = () => {
        setHabbitName('')
        setHabbitDescription('')
        setHabbitFrequency('')
        setHabbitColor('')
        setHabbitMaxReps(1)
    }

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        try{

            event.preventDefault()
            let hasErrors = false
            clearErrors()

            if(!habbitName || habbitName.trim().length < 3){
                hasErrors = true
                setHabbitNameError('El nombre debe tener al menos 3 caracteres')
            }else if(habbitName.length > 50){
                hasErrors = true
                setHabbitNameError('El nombre no puede superar los 50 caracteres')
            }

            if(habbitDescription && habbitDescription.length > 255){
                hasErrors = true
                setHabbitDescriptionError('La descripción no puede superar los 255 caracteres')
            }

            if(!habbitColor){
                hasErrors = true
                setHabbitColorError('El color es obligatorio')
            }

            if(!habbitFrequency){
                hasErrors = true
                setHabbitFrequencyError('Debes seleccionar una periodicidad')
            }

            if(!habbitMaxReps || habbitMaxReps < 1 || habbitMaxReps > 65535){
                hasErrors = true
                setHabbitMaxRepsError('El número de repeticiones debe ser superior a 1')
            }

            if(hasErrors){
                return
            }

            if(isLogged){
                // TODO
            }else{
                const response = storeLocalHabbit({
                    name: habbitName,
                    description: habbitDescription,
                    color: habbitColor,
                    maxRepetitions: habbitMaxReps,
                    frequency: habbitFrequency ?? 'DAY'
                })
                if(response.status === 201){
                    handleAddHabbit(response.data)
                }
            }

            handleChangeModalStatus(false)
        }catch(error){
            // TODO
        }
    }   

    return (
        <>
            <button className="btn" onClick={() => { handleChangeModalStatus(true) }}>
                <CirclePlus className="h-4 w-4" />
            </button>
            <dialog id={MODAL_ID} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Nuevo hábito</h3>
                    <form onSubmit={onSubmit} className="my-3 space-y-3">
                        <input type="text" value={habbitName} onChange={(event) => {
                            setHabbitName(event.target.value)
                        }} placeholder="Nombre del hábito" className="input input-bordered w-full" />
                        <span className="text-sm text-red-500">{habbitNameError}</span>
                        <textarea value={habbitDescription} onChange={(event) => {
                            setHabbitDescription(event.target.value)
                        }} className="textarea textarea-bordered w-full" placeholder="Descripción"></textarea>
                        <span className="text-sm text-red-500">{habbitDescriptionError}</span>

                        <select defaultValue="0" className="select select-bordered w-full" onChange={(event) => {
                            setHabbitFrequency(event.target.value)
                        }}>
                            <option disabled value="0">Periodicidad</option>
                            {HABIT_FREQUENCY.map((habbitFrequency: BasicOption) => {
                                return <option key={habbitFrequency.value} value={habbitFrequency.value}>
                                    {habbitFrequency.label}
                                </option>
                            })}
                        </select>
                        <span className="text-sm text-red-500">{habbitFrequencyError}</span>

                        <label htmlFor="color" className="block">Selecciona un color:</label>
                        <div className="flex items-center spacex-2">
                            {AVAILABLE_COLORS.map((color) => {
                                return <input key={color} onChange={(event) => {
                                    setHabbitColor(event.target.dataset.color ?? '')
                                }} type="radio" checked={habbitColor === color} data-color={color} name="color" className="radio mr-2" style={{ backgroundColor: color }} />
                            })}
                        </div>
                        <span className="text-sm text-red-500">{habbitColorError}</span>


                        <label htmlFor="maxReps" className="block">Máximas veces completado {habbitFrequency && <span className="lowercase">por {HABIT_FREQUENCY.find((habbit) => habbit.value === habbitFrequency)?.label}</span>}</label>
                        <div className="flex items-center space-x-2">
                            <input disabled={true} type="number" step="1" min="1" value={habbitMaxReps} name="maxReps" className="input input-bordered flex-1" />
                            <button onClick={() => {
                                handleMaxRepsChange('MINUS')
                            }} type="button" disabled={isMinusBtnDisabled()} className="btn">
                                <Minus className="w-4 h-4" />
                            </button>
                            <button type="button" onClick={() => {
                                handleMaxRepsChange('PLUS')
                            }} className="btn">
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                        <span className="text-sm text-red-500">{habbitMaxRepsError}</span>

                        <div className="flex items-center justify-end space-x-2">
                            <button onClick={() => { handleChangeModalStatus(false) }} type="button" className="btn btn-active btn-ghost">Cancelar</button>
                            <button type="submit" className="btn btn-neutral btn-active">Guardar</button>
                        </div>

                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    )
}