import React, { MouseEvent, useEffect, useRef } from "react";
import { Calendar, CirclePlus, Pencil, Trash } from "lucide-react";
import { deleteRemoteHabit } from "../services/habitsService";
import { getDataForHeatmap, handleChangeModalStatus } from "../utils";
import { Habit } from "../types";
import { Heatmap } from "./Heatmap";
import { HTTP_GENERAL_ERROR_MSG } from "../constants";
import { removeHabit } from "../slices/habitsSlice";
import { RootState } from "../store";
import { toast } from 'sonner'
import { useSelector, useDispatch } from "react-redux";
import HabitModal from "./HabitModal";
import CalendarModal from "./CalendarModal";

const MODAL_ID = 'HabitModal'

const defaultTrigger = <button className="btn modal-trigger" >
    <CirclePlus className="h-4 w-4 modal-trigger" />
</button>

interface Props {
    readonly modalTrigger?: JSX.Element;
    readonly modalId?: string;
    readonly selectedHabit: Habit;
}

export default function HabitDetailsModal({ modalId = MODAL_ID, modalTrigger = defaultTrigger, selectedHabit }: Props) {

    const dispatch = useDispatch()
    const scrollRef = useRef<HTMLDivElement>(null);
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
                    habitId: selectedHabit.id
                })
            }

            dispatch(removeHabit(selectedHabit.id))
            handleChangeModalStatus(false, `delete_${selectedHabit.id}_habit_modal`)
            handleChangeModalStatus(false, modalId)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : HTTP_GENERAL_ERROR_MSG)
        }
    }

    useEffect(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
      }
    }, []);
  

    return (
        <>
            {modalTrigger && React.cloneElement(modalTrigger, { onClick: handleOpenModal })}
            <dialog id={modalId} className="modal">
                <div className="modal-box overflow-x-hidden">
                    <h3 className="font-bold text-lg">{selectedHabit.name}</h3>
                    <div className="overflow-x-auto" ref={scrollRef}>
                        <Heatmap color={selectedHabit.color} maxValue={selectedHabit.maxRepetitions} data={getDataForHeatmap(selectedHabit.records ?? [])} width={750} height={130}  />
                    </div>
                    <div className="flex items center justify-end space-x-4 mt-3">
                        <button type="button" onClick={() => {
                            handleChangeModalStatus(true, `delete_${selectedHabit.id}_habit_modal`)
                        }} className="btn btn-ghost" autoFocus={false}>
                            <Trash className="h-4 w-4" />
                        </button>
                        <CalendarModal habit={selectedHabit} modalId={`calendar_modal_${selectedHabit.id}`} modalTrigger={
                            <button type="button" className="modal-trigger btn btn-ghost">
                                <Calendar className="modal-trigger h-4 w-4" />
                            </button>
                        } />
                        <HabitModal selectedHabit={selectedHabit} modalTrigger={<button type="button" className="btn modal-trigger btn-ghost">
                            <Pencil className="h-4 w-4 modal-trigger" />
                        </button>}
                            modalId={`modal_edit_${selectedHabit.id}`} />
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            <dialog id={`delete_${selectedHabit.id}_habit_modal`} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Cuidado</h3>
                    <p className="my-3">Si borras este hábito perderás todos sus registros, ¿quieres continuar?</p>
                    <div className="flex items-center justify-end space-x-4">
                        <button onClick={() => {
                            handleChangeModalStatus(false, `delete_${selectedHabit.id}_habit_modal`)
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