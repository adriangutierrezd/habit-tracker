import { Check, CirclePlus, HeartPulse, Plus } from "lucide-react";
import { getDataForHeatmap } from "../utils";
import { getLocalHabits, getRemoteHabits } from "../services/habitsService";
import { Habit, HabitRecord } from "../types";
import { Heatmap } from "./Heatmap";
import { HTTP_GENERAL_ERROR_MSG } from "../constants";
import { refreshHabits, updateHabit } from "../slices/habitsSlice";
import { RootState } from "../store";
import { storeLocalHabitRecord, storeRemoteHabitRecord, updateRemoteHabitRecord } from "../services/habitRecordService";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import HabitDetailsModal from "./HabitDetailsModal";
import HabitModal from "./HabitModal";
import moment from "moment";


const isHabitCompleted = (habit: Habit, date: string) => {
    if (!habit.records) return false
    return habit.records.find((record: HabitRecord) => record.date === date)?.repetitions === habit.maxRepetitions
}

interface HandleStoreRecordProps {
    habitId: string;
    date: string;
    habit: Habit;
}


export default function HabitList() {

    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const { habits: initialHabits } = useSelector((state: RootState) => {
        return state.userHabits
    })
    const { isLogged, token } = useSelector((state: RootState) => {
        return state.userSession
    });
    const [habits, setHabits] = useState<Array<Habit>>(initialHabits)


    const handleStoreRecord = async ({ habitId, date, habit }: HandleStoreRecordProps) => {
        if (!isLogged) {
            const response = storeLocalHabitRecord({ habitId, date, token: undefined })
            const habit = response.data as Habit
            dispatch(updateHabit({ habit, id: habit.id }))
        } else if (habit.records && habit.records.length > 0) {
            const findRecord = habit.records.find((record: HabitRecord) => record.date === date)
            if (findRecord?.id) {
                const response = await updateRemoteHabitRecord({ habitRecordId: findRecord.id, repetitions: findRecord.repetitions + 1, token: token ?? undefined })
                const habit = response.data as Habit
                dispatch(updateHabit({ habit, id: habit.id }))
            } else {
                const response = await storeRemoteHabitRecord({ habitId, date, token: token ?? undefined })
                const habit = response.data as Habit
                dispatch(updateHabit({ habit, id: habit.id }))
            }
        } else {
            const response = await storeRemoteHabitRecord({ habitId, date, token: token ?? undefined })
            const habit = response.data as Habit
            dispatch(updateHabit({ habit, id: habit.id }))
        }
    }

    const fetchHabits = async () => {
        setIsLoading(true)
        if (!isLogged) {
            const response = getLocalHabits()
            dispatch(refreshHabits(response.data))
            setIsLoading(false)
        } else {
            try {
                const response = await getRemoteHabits(token ?? '')
                dispatch(refreshHabits(response.data))
                setIsLoading(false)
            } catch (error) {
                toast.error(error instanceof Error ? error.message : HTTP_GENERAL_ERROR_MSG)
            }
        }
    }

    useEffect(() => {
        fetchHabits()
    }, [])

    useEffect(() => {
        setHabits(initialHabits)
    }, [initialHabits])

    return (
        <>
            {isLoading ? (
                <HabitListSkeleton />
            ) : (
                <>
                    {habits.length > 0 ? (
                        <>
                            {habits.map((habit: Habit) => {
                                const trigger = <div
                                    key={habit.id}
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
                            })}
                        </>
                    ) : (
                        <HabitListPlaceholder />
                    )}
                </>
            )}
        </>
    )
}

interface ButtonProps {
    readonly habit: Habit;
    readonly handleStoreRecord: ({ habitId, date, habit }: HandleStoreRecordProps) => void;
}

const HabitButton = ({ habit, handleStoreRecord }: ButtonProps) => {

    const todayDate = moment().format('YYYY-MM-DD')
    const completed = isHabitCompleted(habit, todayDate)

    return (
        <button onClick={() => {
            if (!completed) handleStoreRecord({ habitId: habit.id, date: todayDate, habit })
        }} className={`btn btn-sm sm:btn-md btn-secondary ${completed ? '' : 'btn-outline'}`}>
            {habit.maxRepetitions > 1 ? (<Plus className="w-4 h-4" />) : (<Check className="w-4 h-4" />)}
        </button>
    )
}

const HabitListSkeleton = () => {
    return (
        <div className="flex flex-col space-y-4">
            <div className="skeleton w-full h-32"></div>
            <div className="skeleton w-full h-32"></div>
            <div className="skeleton w-full h-32"></div>
        </div>
    )
}

const HabitListPlaceholder = () => {
    return (
        <div className="border border-dashed p-6 border-2 flex items-center justify-center flex-col space-y-4 rounded">
            <h2 className="font-semibold text-md sm:text-xl">Aún no has añadido ningún hábito</h2>
            <p>Guardaremos todos los hábitos que crees en esta plataforma junto con tu seguimento</p>
            <HabitModal modalId="firstHabitModal" selectedHabit={undefined} modalTrigger={
                <button className="btn btn-primary modal-trigger">
                    <CirclePlus className="h-4 w-4 modal-trigger" />
                    Añadir
                </button>
            } />
        </div>
    )
}