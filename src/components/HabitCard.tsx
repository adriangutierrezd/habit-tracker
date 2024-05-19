import { addLocaleRepetitionToHabit, addRemoteRepetitionToHabit, resetLocalHabitRepetitions, resetRemoteRepetitionToHabit } from "../services/habitRecordService";
import { Check, HeartPulse, Plus } from "lucide-react"
import { getDataForHeatmap } from "../utils";
import { Habit, HabitRecord } from "../types";
import { Heatmap } from "./Heatmap";
import { RootState } from "../store";
import { updateHabit } from "../slices/habitsSlice";
import { useSelector, useDispatch } from "react-redux";
import HabitDetailsModal from "./HabitDetailsModal";
import moment from "moment";

const isHabitCompleted = (habit: Habit, date: string) => {
    if (!habit.records) return false
    return habit.records.find((record: HabitRecord) => record.date === date)?.repetitions === habit.maxRepetitions
}


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
    const { isLogged, token } = useSelector((state: RootState) => {
        return state.userSession
    });


    const handleStoreRecord = async ({ date, habit, action = 'ADD' }: HandleStoreRecordProps) => {

        if(!isLogged && action === 'ADD'){
            const response = addLocaleRepetitionToHabit({habit, date})
            dispatch(updateHabit({ habit: response, id: response.id }))
        }else if(!isLogged && action === 'RESET'){
            const response = resetLocalHabitRepetitions({habit, date})
            dispatch(updateHabit({ habit: response, id: response.id }))
        } else if(isLogged && action === 'ADD'){
            const response = await addRemoteRepetitionToHabit({ token, habit, date })
            dispatch(updateHabit({ habit: response.data, id: response.data.id }))
        }else if(isLogged && action === 'RESET'){
            const response = await resetRemoteRepetitionToHabit({ token, habit, date })
            dispatch(updateHabit({ habit: response.data, id: response.data.id }))
        }
    }

    const trigger = <div
        className="card w-full bg-base-100 shadow-xl my-3 cursor-pointer">
        <div className="card-body modal-trigger">
            <div className="flex items-center justify-between modal-trigger">
                <div className="flex items-center space-x-3">
                    <div className="p-2" style={{ backgroundColor: habit.color }}>
                        <HeartPulse className="h-4 w-4 text-white" />
                    </div>
                    <h2 className="card-title text-base sm:text-lg">{habit.name}</h2>
                </div>
                <HabitButton habit={habit} handleStoreRecord={handleStoreRecord} />
            </div>
            <div className="overflow-x-auto">
                <Heatmap color={habit.color} maxValue={habit.maxRepetitions} data={getDataForHeatmap(habit.records ?? [])} width={500} height={150} />
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