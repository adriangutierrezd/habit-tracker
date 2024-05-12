import React, { MouseEvent, useState } from "react";
import { AVAILABLE_COLORS, HABIT_FREQUENCY, HTTP_CREATED_CODE, HTTP_OK_CODE } from "../constants";
import { BasicOption, Habbit, HabbitFrequencies } from "../types";
import { CirclePlus, Minus, Plus } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { storeLocalHabbit, updateLocalHabbit } from "../services/habbitsService";
import { toast } from 'sonner'

const MODAL_ID = 'HabbitModal'

const defaultTrigger = <button className="btn modal-trigger" >
    <CirclePlus className="h-4 w-4 modal-trigger" />
</button>

interface Props {
    readonly handleAddHabbit?: (data: Habbit) => void;
    readonly handleUpdateHabbit?: (data: Habbit, id: string) => void;
    readonly modalTrigger?: JSX.Element;
    readonly modalId?: string;
    readonly selectedHabbit: Habbit | undefined;
}

export default function HabbitModal({ handleAddHabbit, modalId = MODAL_ID, modalTrigger = defaultTrigger, selectedHabbit = undefined, handleUpdateHabbit }: Props) {

    const [habbitName, setHabbitName] = useState<string>('')
    const [habbitDescription, setHabbitDescription] = useState<string>('')
    const [habbitFrequency, setHabbitFrequency] = useState<HabbitFrequencies>('DAY')
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

        const modalElement = document.getElementById(modalId) as HTMLDialogElement | null;
        if (modalElement) {
            if (status) {
                modalElement.showModal()
            } else {
                modalElement.close()
            }
        }
    }

    const isMinusBtnDisabled = () => {
        return habbitMaxReps <= 1
    }

    const handleMaxRepsChange = (action: "PLUS" | "MINUS") => {
        if (action === 'PLUS') {
            setHabbitMaxReps(habbitMaxReps + 1)
        } else {
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
        if (selectedHabbit) {
            setHabbitName(selectedHabbit.name)
            setHabbitDescription(selectedHabbit.description ?? '')
            setHabbitFrequency(selectedHabbit.frequency)
            setHabbitColor(selectedHabbit.color)
            setHabbitMaxReps(selectedHabbit.maxRepetitions)
        } else {
            setHabbitName('')
            setHabbitDescription('')
            setHabbitFrequency('DAY')
            setHabbitColor('')
            setHabbitMaxReps(1)
        }
    }

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        try {

            event.preventDefault()
            let hasErrors = false
            clearErrors()

            if (!habbitName || habbitName.trim().length < 3) {
                hasErrors = true
                setHabbitNameError('El nombre debe tener al menos 3 caracteres')
            } else if (habbitName.length > 50) {
                hasErrors = true
                setHabbitNameError('El nombre no puede superar los 50 caracteres')
            }

            if (habbitDescription && habbitDescription.length > 255) {
                hasErrors = true
                setHabbitDescriptionError('La descripción no puede superar los 255 caracteres')
            }

            if (!habbitColor) {
                hasErrors = true
                setHabbitColorError('El color es obligatorio')
            }

            if (!habbitFrequency) {
                hasErrors = true
                setHabbitFrequencyError('Debes seleccionar una periodicidad')
            }

            if (!habbitMaxReps || habbitMaxReps < 1 || habbitMaxReps > 65535) {
                hasErrors = true
                setHabbitMaxRepsError('El número de repeticiones debe ser superior a 1')
            }

            if (hasErrors) {
                return
            }

            if (isLogged) {
                // TODO
            } else {
                if (selectedHabbit) {
                    const response = updateLocalHabbit({
                        id: selectedHabbit.id,
                        name: habbitName,
                        description: habbitDescription,
                        color: habbitColor,
                        maxRepetitions: habbitMaxReps,
                        frequency: habbitFrequency ?? 'DAY'
                    })

                    if (response.status === HTTP_OK_CODE && handleUpdateHabbit) {
                        const habbit = response.data as Habbit
                        handleUpdateHabbit(habbit, selectedHabbit.id)
                        handleChangeModalStatus(false)
                        toast(response.message)
                        return
                    }
                } else {
                    const response = storeLocalHabbit({
                        name: habbitName,
                        description: habbitDescription,
                        color: habbitColor,
                        maxRepetitions: habbitMaxReps,
                        frequency: habbitFrequency ?? 'DAY'
                    })
                    if (response.status === HTTP_CREATED_CODE && handleAddHabbit) {
                        handleAddHabbit(response.data)
                        handleChangeModalStatus(false)
                        toast(response.message)
                        return
                    }
                }

            }

        } catch (error) {
            // TODO
        }
    }

    const handleOpenModal = (event: MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
        const target = event.target as HTMLElement;
        if (target.classList.contains('modal-trigger')) {
            handleChangeModalStatus(true);
        }
    }

    return (
        <>
            {modalTrigger && React.cloneElement(modalTrigger, { onClick: handleOpenModal })}
            <dialog id={modalId} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">{selectedHabbit ? `Editar hábito ${selectedHabbit.name}` : 'Nuevo hábito'}</h3>
                    <form onSubmit={onSubmit} className="my-3 space-y-3">
                        <input type="text" value={habbitName} onChange={(event) => {
                            setHabbitName(event.target.value)
                        }} placeholder="Nombre del hábito" className="input input-bordered w-full" />
                        <span className="text-sm text-red-500">{habbitNameError}</span>
                        <textarea value={habbitDescription} onChange={(event) => {
                            setHabbitDescription(event.target.value)
                        }} className="textarea textarea-bordered w-full" placeholder="Descripción"></textarea>
                        <span className="text-sm text-red-500">{habbitDescriptionError}</span>

                        <select className="select select-bordered w-full" onChange={(event) => {
                            setHabbitFrequency(event.target.value as HabbitFrequencies)
                        }}>
                            {HABIT_FREQUENCY.map((habbitFrequency: BasicOption) => {
                                return <option key={habbitFrequency.value} value={habbitFrequency.value}>
                                    {habbitFrequency.label}
                                </option>
                            })}
                        </select>
                        <span className="text-sm text-red-500">{habbitFrequencyError}</span>

                        <label htmlFor="color" className="block">Selecciona un color:</label>
                        <div className="flex items-center justify-start space-x-2 space-y-2 flex-wrap">
                            {AVAILABLE_COLORS.map((color) => {
                                return <input key={color} onChange={(event) => {
                                    setHabbitColor(event.target.dataset.color ?? '')
                                }} type="radio" checked={habbitColor === color} data-color={color} name="color" className="radio self-end" style={{ backgroundColor: color }} />
                            })}
                        </div>
                        <span className="text-sm text-red-500">{habbitColorError}</span>


                        <label htmlFor="maxReps" className="block">Máximas veces completado {habbitFrequency && <span className="lowercase">por {HABIT_FREQUENCY.find((habbit) => habbit.value === habbitFrequency)?.label}</span>}</label>
                        <div className="flex flex-col sm:flex-row items-center space-x-2 space-y-2">
                            <input disabled={true} type="number" step="1" min="1" value={habbitMaxReps} name="maxReps" className="input input-bordered w-full sm:flex-1" />
                            <div className="flex items-center justify-end space-x-2 w-full mt-0 sm:w-auto">
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