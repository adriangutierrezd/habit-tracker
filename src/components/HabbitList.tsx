import { Check, CirclePlus, HeartPulse, Plus } from "lucide-react";
import { getDataForHeatmap } from "../utils";
import { getLocalHabbits, getRemoteHabbits } from "../services/habbitsService";
import { Habbit, HabbitRecord } from "../types";
import { Heatmap } from "./Heatmap";
import { HTTP_GENERAL_ERROR_MSG } from "../constants";
import { refreshHabits, updateHabit } from "../slices/habitsSlice";
import { RootState } from "../store";
import { storeLocalHabbitRecord, storeRemoteHabbitRecord, updateRemoteHabbitRecord } from "../services/habbitRecordService";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import HabbitDetailsModal from "./HabbitDetailsModal";
import HabbitModal from "./HabbitModal";
import moment from "moment";


const isHabbitCompleted = (habbit: Habbit, date: string) => {
    if (!habbit.records) return false
    return habbit.records.find((record: HabbitRecord) => record.date === date)?.repetitions === habbit.maxRepetitions
}

interface HandleStoreRecordProps {
    habbitId: string;
    date: string;
    habbit: Habbit;
}


export default function HabbitList() {

    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const { habits: initialHabits } = useSelector((state: RootState) => {
        return state.userHabits
    })
    const { isLogged, token } = useSelector((state: RootState) => {
        return state.userSession
    });
    const [habits, setHabits] = useState<Array<Habbit>>(initialHabits)


    const handleStoreRecord = async ({ habbitId, date, habbit }: HandleStoreRecordProps) => {
        if (!isLogged) {
            const response = storeLocalHabbitRecord({ habbitId, date, token: undefined })
            const habit = response.data as Habbit
            dispatch(updateHabit({ habit, id: habit.id }))
        } else if (habbit.records && habbit.records.length > 0) {
            const findRecord = habbit.records.find((record: HabbitRecord) => record.date === date)
            if (findRecord?.id) {
                const response = await updateRemoteHabbitRecord({ habbitRecordId: findRecord.id, repetitions: findRecord.repetitions + 1, token: token ?? undefined })
                const habit = response.data as Habbit
                dispatch(updateHabit({ habit, id: habit.id }))
            } else {
                const response = await storeRemoteHabbitRecord({ habbitId, date, token: token ?? undefined })
                const habit = response.data as Habbit
                dispatch(updateHabit({ habit, id: habit.id }))
            }
        } else {
            const response = await storeRemoteHabbitRecord({ habbitId, date, token: token ?? undefined })
            const habit = response.data as Habbit
            dispatch(updateHabit({ habit, id: habit.id }))
        }
    }

    const fetchHabits = async () => {
        setIsLoading(true)
        if (!isLogged) {
            const response = getLocalHabbits()
            dispatch(refreshHabits(response.data))
            setIsLoading(false)
        } else {
            try {
                const response = await getRemoteHabbits(token ?? '')
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
                            {habits.map((habbit: Habbit) => {
                                const trigger = <div
                                    key={habbit.id}
                                    className="card w-full bg-base-100 shadow-xl my-3 cursor-pointer">
                                    <div className="card-body modal-trigger">
                                        <div className="flex items-center justify-between modal-trigger">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2" style={{ backgroundColor: habbit.color }}>
                                                    <HeartPulse className="h-4 w-4 text-white" />
                                                </div>
                                                <h2 className="card-title text-base sm:text-lg">{habbit.name}</h2>
                                            </div>
                                            <HabbitButton habbit={habbit} handleStoreRecord={handleStoreRecord} />
                                        </div>
                                        <div className="overflow-x-auto">
                                            <Heatmap color={habbit.color} maxValue={habbit.maxRepetitions} data={getDataForHeatmap(habbit.records ?? [])} width={500} height={150} />
                                        </div>
                                    </div>
                                </div>

                                return (
                                    <HabbitDetailsModal
                                        key={habbit.id}
                                        selectedHabbit={habbit}
                                        modalTrigger={trigger}
                                        modalId={`modal_${habbit.id}`}
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
    readonly habbit: Habbit;
    readonly handleStoreRecord: ({ habbitId, date, habbit }: HandleStoreRecordProps) => void;
}

const HabbitButton = ({ habbit, handleStoreRecord }: ButtonProps) => {

    const todayDate = moment().format('YYYY-MM-DD')
    const completed = isHabbitCompleted(habbit, todayDate)

    return (
        <button onClick={() => {
            if (!completed) handleStoreRecord({ habbitId: habbit.id, date: todayDate, habbit })
        }} className={`btn btn-sm sm:btn-md btn-secondary ${completed ? '' : 'btn-outline'}`}>
            {habbit.maxRepetitions > 1 ? (<Plus className="w-4 h-4" />) : (<Check className="w-4 h-4" />)}
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
            <HabbitModal modalId="firstHabbitModal" selectedHabbit={undefined} modalTrigger={
                <button className="btn btn-primary modal-trigger">
                    <CirclePlus className="h-4 w-4 modal-trigger" />
                    Añadir
                </button>
            } />
        </div>
    )
}