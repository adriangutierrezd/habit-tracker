import { Check, HeartPulse, Plus } from "lucide-react";
import { Habbit, HabbitRecord } from "../types";
import HabbitModal from "./HabbitModal";
import { storeLocalHabbitRecord, storeRemoteHabbitRecord, updateRemoteHabbitRecord } from "../services/habbitRecordService";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import moment from "moment";
import { Heatmap } from "./Heatmap";
import { getDataForHeatmap } from "../utils";


const isHabbitCompleted = (habbit: Habbit, date: string) => {
    if (!habbit.records) return false
    return habbit.records.find((record: HabbitRecord) => record.date === date)?.repetitions === habbit.maxRepetitions
}

interface Props {
    readonly habbits: Habbit[]
    readonly handleUpdateHabbit: (data: Habbit, id: string) => void;
}


interface HandleStoreRecordProps {
    habbitId: string;
    date: string;
    habbit: Habbit;
}


export default function HabbitList({ habbits, handleUpdateHabbit }: Props) {

    const { isLogged, token } = useSelector((state: RootState) => {
        return state.userSession
    });

    const handleStoreRecord = async ({ habbitId, date, habbit }: HandleStoreRecordProps) => {
        if (!isLogged) {
            const response = storeLocalHabbitRecord({ habbitId, date, token: undefined })
            const habit = response.data as Habbit
            handleUpdateHabbit(habit, habit.id)
        } else if (habbit.records && habbit.records.length > 0) {
            const findRecord = habbit.records.find((record: HabbitRecord) => record.date === date)
            if (findRecord?.id) {
                const response = await updateRemoteHabbitRecord({ habbitRecordId: findRecord.id, repetitions: findRecord.repetitions + 1, token: token ?? undefined })
                const habit = response.data as Habbit
                handleUpdateHabbit(habit, habit.id)
            } else {
                const response = await storeRemoteHabbitRecord({ habbitId, date, token: token ?? undefined })
                const habit = response.data as Habbit
                handleUpdateHabbit(habit, habit.id)
            }
        } else {
            const response = await storeRemoteHabbitRecord({ habbitId, date, token: token ?? undefined })
            const habit = response.data as Habbit
            handleUpdateHabbit(habit, habit.id)
        }
    }

    return (
        <>
            {habbits.map((habbit: Habbit) => {
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
                    <HabbitModal selectedHabbit={habbit} key={habbit.id} modalTrigger={trigger} modalId={`modal_${habbit.id}`} handleUpdateHabbit={handleUpdateHabbit} />
                )
            })}
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