import React, { MouseEvent, useState } from "react";
import { addHabit, updateHabit } from "../slices/habitsSlice";
import { AVAILABLE_COLORS, HTTP_GENERAL_ERROR_MSG } from "../constants";
import { Habit } from "../types";
import { CirclePlus, Minus, Plus } from "lucide-react";
import { generatePastRecords } from "../utils";
import { RootState } from "../store";
import { storeRemoteHabit, updateRemoteHabit } from "../services/habitsService";
import { toast } from 'sonner'
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';
import moment from "moment";

const MODAL_ID = 'HabitModal'

const defaultTrigger = <button className="btn modal-trigger" >
    <CirclePlus className="h-4 w-4 modal-trigger" />
</button>

interface Props {
    readonly modalTrigger?: JSX.Element;
    readonly modalId?: string;
    readonly selectedHabit: Habit | undefined;
}

export default function HabitModal({ modalId = MODAL_ID, modalTrigger = defaultTrigger, selectedHabit = undefined }: Props) {

    const dispatch = useDispatch()
    const [habitName, setHabitName] = useState<string>('')
    const [habitDescription, setHabitDescription] = useState<string>('')
    const [habitColor, setHabitColor] = useState<string>('')
    const [habitMaxReps, setHabitMaxReps] = useState<number>(1)
    const [habitNameError, setHabitNameError] = useState<string>()
    const [habitDescriptionError, setHabitDescriptionError] = useState<string>()
    const [habitColorError, setHabitColorError] = useState<string>()
    const [habitMaxRepsError, setHabitMaxRepsError] = useState<string>()
    const { isLogged, token } = useSelector((state: RootState) => {
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
        return habitMaxReps <= 1
    }

    const handleMaxRepsChange = (action: "PLUS" | "MINUS") => {
        if (action === 'PLUS') {
            setHabitMaxReps(habitMaxReps + 1)
        } else {
            setHabitMaxReps(habitMaxReps - 1)
        }
    }

    const clearErrors = () => {
        setHabitNameError('')
        setHabitDescriptionError('')
        setHabitColorError('')
        setHabitMaxRepsError('')
    }

    const resetFields = () => {
        if (selectedHabit) {
            setHabitName(selectedHabit.name)
            setHabitDescription(selectedHabit.description ?? '')
            setHabitColor(selectedHabit.color)
            setHabitMaxReps(selectedHabit.maxRepetitions)
        } else {
            setHabitName('')
            setHabitDescription('')
            setHabitColor('')
            setHabitMaxReps(1)
        }
    }

    const checkFormHasErrors = () => {
        let hasErrors = false
        clearErrors()

        if (!habitName || habitName.trim().length < 3) {
            hasErrors = true
            setHabitNameError('El nombre debe tener al menos 3 caracteres')
        } else if (habitName.length > 50) {
            hasErrors = true
            setHabitNameError('El nombre no puede superar los 50 caracteres')
        }

        if (habitDescription && habitDescription.length > 255) {
            hasErrors = true
            setHabitDescriptionError('La descripción no puede superar los 255 caracteres')
        }

        if (!habitColor) {
            hasErrors = true
            setHabitColorError('El color es obligatorio')
        }

        if (!habitMaxReps || habitMaxReps < 1 || habitMaxReps > 65535) {
            hasErrors = true
            setHabitMaxRepsError('El número de repeticiones debe ser superior a 1')
        }

        return hasErrors
    }

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        try {

            event.preventDefault()
            if (checkFormHasErrors()) {
                return
            }

            if (isLogged && selectedHabit) {
                const response = await updateRemoteHabit({
                    name: habitName,
                    description: habitDescription,
                    color: habitColor,
                    maxRepetitions: habitMaxReps,
                    token: token ?? undefined,
                    id: selectedHabit.id
                })


                const habit = response.data as Habit
                dispatch(updateHabit({ habit, id: habit.id }))
                handleChangeModalStatus(false)
                toast(response.message)
                return
            } else if (isLogged && !selectedHabit) {
                const response = await storeRemoteHabit({
                    name: habitName,
                    description: habitDescription,
                    color: habitColor,
                    maxRepetitions: habitMaxReps,
                    token: token ?? undefined
                })

                const habit = response.data as Habit
                dispatch(addHabit(habit))
                handleChangeModalStatus(false)
                toast(response.message)
                return
            } else if (!isLogged && selectedHabit) {

                const newHabit: Habit = {
                    ...selectedHabit,
                    name: habitName,
                    description: habitDescription,
                    color: habitColor,
                    maxRepetitions: habitMaxReps,
                }


                dispatch(updateHabit({ habit: newHabit, id: newHabit.id }))
                handleChangeModalStatus(false)
                toast('Recurso actualizado con éxito')
                return
            } else if (!isLogged && !selectedHabit) {
                const newHabitId = uuidv4()
                const newHabit: Habit = {
                    id: newHabitId,
                    name: habitName,
                    description: habitDescription,
                    color: habitColor,
                    maxRepetitions: habitMaxReps,
                    records: generatePastRecords(moment().format('YYYY-MM-DD'), newHabitId)
                }
                dispatch(addHabit(newHabit))
                handleChangeModalStatus(false)
                toast('Recurso añadido con éxito')
                return
            }
        } catch (error) {
            handleChangeModalStatus(false)
            toast.error(error instanceof Error ? error.message : HTTP_GENERAL_ERROR_MSG)
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
                    <h3 className="font-bold text-lg">{selectedHabit ? `Editar hábito ${selectedHabit.name}` : 'Nuevo hábito'}</h3>
                    <form onSubmit={onSubmit} className="my-3 space-y-3">
                        <input type="text" value={habitName} onChange={(event) => {
                            setHabitName(event.target.value)
                        }} placeholder="Nombre del hábito" className="input input-bordered w-full" />
                        <span className="text-sm text-red-500">{habitNameError}</span>
                        <textarea value={habitDescription} onChange={(event) => {
                            setHabitDescription(event.target.value)
                        }} className="textarea textarea-bordered w-full" placeholder="Descripción"></textarea>
                        <span className="text-sm text-red-500">{habitDescriptionError}</span>

                        <label htmlFor="color" className="block">Selecciona un color:</label>
                        <div className="flex items-center justify-start space-x-2 space-y-2 flex-wrap">
                            {AVAILABLE_COLORS.map((color) => {
                                return <input key={color} onChange={(event) => {
                                    setHabitColor(event.target.dataset.color ?? '')
                                }} type="radio" checked={habitColor === color} data-color={color} name="color" className="radio self-end" style={{ backgroundColor: color }} />
                            })}
                        </div>
                        <span className="text-sm text-red-500">{habitColorError}</span>


                        <label htmlFor="maxReps" className="block">Máximas veces completado</label>
                        <div className="flex flex-col sm:flex-row items-center space-x-2 space-y-2">
                            <input disabled={true} type="number" step="1" min="1" value={habitMaxReps} name="maxReps" className="input input-bordered w-full sm:flex-1" />
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
                        <span className="text-sm text-red-500">{habitMaxRepsError}</span>

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