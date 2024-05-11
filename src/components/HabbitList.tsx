import { Check, HeartPulse } from "lucide-react";
import { Habbit } from "../types";
import HabbitModal from "./HabbitModal";


interface Props {
    readonly habbits: Habbit[]
}
export default function HabbitList({ habbits }: Props) {



    const handleAddHabbit = (data: Habbit) => {

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
                                <h2 className="card-title">{habbit.name}</h2>
                            </div>
                            <button className="btn btn-secondary">
                                <Check className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                return (
                    <HabbitModal key={habbit.id} modalTrigger={trigger} modalId={`modal_${habbit.id}`} handleAddHabbit={handleAddHabbit} />
                )
            })}
        </>

    )
}