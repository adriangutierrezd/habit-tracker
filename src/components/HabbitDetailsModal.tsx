import React, { MouseEvent } from "react";
import { Habbit } from "../types";
import { Calendar, CirclePlus, Pencil, Trash } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { Heatmap } from "./Heatmap";
import { getDataForHeatmap, handleChangeModalStatus } from "../utils";
import { HTTP_GENERAL_ERROR_MSG } from "../constants";
import { toast } from 'sonner'
import { deleteRemoteHabit } from "../services/habbitsService";
import HabbitModal from "./HabbitModal";
import { removeHabit } from "../slices/habitsSlice";

const MODAL_ID = 'HabbitModal'

const defaultTrigger = <button className="btn modal-trigger" >
    <CirclePlus className="h-4 w-4 modal-trigger" />
</button>

interface Props {
    readonly modalTrigger?: JSX.Element;
    readonly modalId?: string;
    readonly selectedHabbit: Habbit;
}

export default function HabbitDetailsModal({ modalId = MODAL_ID, modalTrigger = defaultTrigger, selectedHabbit }: Props) {

    const dispatch = useDispatch()
    const { isLogged, token } = useSelector((state: RootState) => {
        return state.userSession
    });


    const handleOpenModal = (event: MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
        const target = event.target as HTMLElement;
        if (target.classList.contains('modal-trigger')) {
            handleChangeModalStatus(true, modalId);
        }
    }

    const deleteHabit = async () => {
        try {
            if (isLogged) {
                await deleteRemoteHabit({
                    token: token ?? '',
                    habitId: selectedHabbit.id
                })
            }

            dispatch(removeHabit(selectedHabbit.id))
            handleChangeModalStatus(false, `delete_${selectedHabbit.id}_habit_modal`)
            handleChangeModalStatus(false, modalId)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : HTTP_GENERAL_ERROR_MSG)
        }
    }

    return (
        <>
            {modalTrigger && React.cloneElement(modalTrigger, { onClick: handleOpenModal })}
            <dialog id={modalId} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">{selectedHabbit.name}</h3>
                    <div className="overflow-x-auto">
                        <Heatmap color={selectedHabbit.color} maxValue={selectedHabbit.maxRepetitions} data={getDataForHeatmap(selectedHabbit.records ?? [])} width={500} height={150} />
                    </div>
                    <button className="btn btn-secondary">Completar (TODO)</button>
                    <div className="flex items center justify-end space-x-4">
                        <button onClick={() => {
                            handleChangeModalStatus(true, `delete_${selectedHabbit.id}_habit_modal`)
                        }} className="btn btn-ghost">
                            <Trash className="h-4 w-4" />
                        </button>
                        <button className="btn btn-ghost">
                            <Calendar className="h-4 w-4" />
                        </button>
                        <HabbitModal selectedHabbit={selectedHabbit} modalTrigger={<button className="btn modal-trigger btn-ghost">
                            <Pencil className="h-4 w-4 modal-trigger" />
                        </button>} 
                        modalId={`modal_edit_${selectedHabbit.id}`} />
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            <dialog id={`delete_${selectedHabbit.id}_habit_modal`} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Cuidado</h3>
                    <p className="my-3">Si borras este hábito perderás todos sus registros, ¿quieres continuar?</p>
                    <div className="flex items-center justify-end space-x-4">
                        <button onClick={() => {
                            handleChangeModalStatus(false, `delete_${selectedHabbit.id}_habit_modal`)
                        }} className="btn">
                            Cerrar
                        </button>
                        <button className="btn btn-error" onClick={deleteHabit}>
                            Borrar
                        </button>
                    </div>
                </div>
            </dialog>
        </>
    )
}