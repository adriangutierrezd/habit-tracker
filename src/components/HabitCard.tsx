import { addLocaleRepetitionToHabit, addRemoteRepetitionToHabit, resetLocalHabitRepetitions, resetRemoteRepetitionToHabit, setLocaleHabitRepetitions } from "../services/habitRecordService";
import { Check, Plus } from "lucide-react"
import { getDataForHeatmap, isHabitCompleted } from "../utils";
import { Habit, HabitRecord } from "../types";
import { Heatmap } from "./Heatmap";
import { RootState } from "../store";
import { updateHabit } from "../slices/habitsSlice";
import { useSelector, useDispatch } from "react-redux";
import HabitDetailsModal from "./HabitDetailsModal";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { HTTP_GENERAL_ERROR_MSG } from "../constants";
import { toast } from "sonner";

interface Props {
    readonly habit: Habit;
}

interface HandleStoreRecordProps {
    date: string;
    habit: Habit;
    action: 'ADD' | 'RESET'
}
export default function HabitCard({habit}: Props) {

    const dispatch = useDispatch()
    const scrollRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState<number>(0)
    const { isLogged, token } = useSelector((state: RootState) => {
        return state.userSession
    });

    useEffect(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
          const root = document.querySelector('#root')
          if(root){
            setContainerWidth(root.clientWidth - 100)
          }else{
            setContainerWidth(0)
          }
        }
      }, []);
    
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

    const trigger = <div
        className="card max-w-full bg-base-100 shadow-xl my-3 cursor-pointer">
        <div className="card-body modal-trigger">
            <div className="flex items-center justify-between modal-trigger">
                <div className="flex items-center space-x-3">
                    <h2 className="card-title text-base sm:text-lg">{habit.name}</h2>
                </div>
                <HabitButton habit={habit} handleStoreRecord={handleStoreRecord} />
            </div>
            <div className="overflow-x-auto" style={{maxWidth: containerWidth}} ref={scrollRef}>
                <Heatmap color={habit.color} maxValue={habit.maxRepetitions} data={getDataForHeatmap(habit.records ?? [])} width={900} height={155} /> 
            </div>
        </div>
    </div>

    return (
        <HabitDetailsModal
            key={habit.id}
            selectedHabit={habit}
            modalTrigger={trigger}
            modalId={`modal_${habit.id}`}
        />
    )
}

interface ButtonProps {
    readonly habit: Habit;
    readonly handleStoreRecord: ({ date, habit, action }: HandleStoreRecordProps) => void;
}

const HabitButton = ({ habit, handleStoreRecord }: ButtonProps) => {

    const todayDate = moment().format('YYYY-MM-DD')
    const completed = isHabitCompleted(habit, todayDate)
    const action = completed ? 'RESET' : 'ADD'

    return (
        <button onClick={() => {
            handleStoreRecord({ date: todayDate, habit, action })
        }} className={`btn btn-sm sm:btn-md btn-secondary ${completed ? '' : 'btn-outline'}`}>
            {habit.maxRepetitions > 1 ? (<Plus className="w-4 h-4" />) : (<Check className="w-4 h-4" />)}
        </button>
    )
}