import React, { MouseEvent } from "react";
import { Calendar } from "lucide-react";
import { handleChangeModalStatus, isHabitCompleted } from "../utils";
import { DateCalendar, PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { Badge } from "@mui/material";
import { Habit, HabitRecord } from "../types";
import { addLocaleRepetitionToHabit, addRemoteRepetitionToHabit, resetLocalHabitRepetitions, resetRemoteRepetitionToHabit, setLocaleHabitRepetitions } from "../services/habitRecordService";
import { RootState } from "../store";
import { updateHabit } from "../slices/habitsSlice";
import { useSelector, useDispatch } from "react-redux";
import { HTTP_GENERAL_ERROR_MSG } from "../constants";
import { toast } from "sonner";

const MODAL_ID = 'HabitModal'

const defaultTrigger = <button className="btn btn-ghost modal-trigger">
    <Calendar className="h-4 w-4 modal-trigger" />
</button>

interface Props {
    readonly modalTrigger?: JSX.Element;
    readonly modalId?: string;
    readonly habit: Habit;
}

export default function CalendarModal({ modalId = MODAL_ID, modalTrigger = defaultTrigger, habit }: Props) {

    const [value, setValue] = React.useState<Dayjs | null>(dayjs());

    const handleOpenModal = (event: MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
        const target = event.target as HTMLElement;
        if (target.classList.contains('modal-trigger')) {
            handleChangeModalStatus(true, modalId);
        }
    }

    return (
        <>
            {modalTrigger && React.cloneElement(modalTrigger, { onClick: handleOpenModal })}
            <dialog id={modalId} className="modal">
                <div className="modal-box">
                    <DateCalendar
                        value={value}
                        onChange={(newValue) => setValue(newValue)} 
                        slots={{
                            day: ServerDay,
                          }}
                          slotProps={{
                            day: {
                                habit
                            } as never,
                          }}
                    />
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    )
}


interface HandleStoreRecordProps {
    date: string;
    habit: Habit;
    action: 'ADD' | 'RESET'
}

const ServerDay = (props: PickersDayProps<Dayjs> & { habit?: Habit }) => {
    const { habit, day, outsideCurrentMonth, ...other } = props;

    const dispatch = useDispatch()
    const { isLogged, token } = useSelector((state: RootState) => {
        return state.userSession
    });


    const records = habit?.records ?? []
    const record = records.find((record: HabitRecord) => record.date === day.format('YYYY-MM-DD'))
    const repetitions = record && record.repetitions > 0 ? record.repetitions : null


    const isSelected = !props.outsideCurrentMonth && repetitions
    const completed = habit ? isHabitCompleted(habit, day.format('YYYY-MM-DD')) : false
    const action = completed ? 'RESET' : 'ADD'
  

    const handleStoreRecord = ({ date, habit, action = 'ADD' }: HandleStoreRecordProps) => {
        let previousReps: number = 0
        try{
            const records = structuredClone(habit.records ?? [])
            const findRecordIndex = records.findIndex((record: HabitRecord) => record.date === date)
            previousReps = findRecordIndex === -1 ? 0 : records[findRecordIndex].repetitions
            if(action === 'ADD'){
                const response = addLocaleRepetitionToHabit({habit, date})
                dispatch(updateHabit({ habit: response, id: response.id }))
                if(isLogged){
                    addRemoteRepetitionToHabit({ token, habit, date })
                }
            }else if(action === 'RESET'){
                const response = resetLocalHabitRepetitions({habit, date})
                dispatch(updateHabit({ habit: response, id: response.id }))
                if(isLogged){
                    resetRemoteRepetitionToHabit({ token, habit, date })
                }
            }
        }catch(error){
            const response = setLocaleHabitRepetitions({habit, date, repetitions: previousReps})
            dispatch(updateHabit({ habit: response, id: response?.id }))
            toast.error(error instanceof Error ? error.message : HTTP_GENERAL_ERROR_MSG)
        }
    }

    return (
      <Badge
        key={props.day.toString()}
        overlap="circular"
        badgeContent={isSelected ? <span className="badge badge-neutral">{repetitions}</span> : undefined}
      >
        <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} onClick={() => {
            if(habit) handleStoreRecord({ date: day.format('YYYY-MM-DD'), habit, action })
        }} />
      </Badge>
    );
  }
  