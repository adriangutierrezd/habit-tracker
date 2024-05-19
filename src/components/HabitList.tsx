import { useEffect, useState } from "react";
import { CirclePlus } from "lucide-react";
import { getRemoteHabits } from "../services/habitsService";
import { Habit } from "../types";
import { HTTP_GENERAL_ERROR_MSG } from "../constants";
import { refreshHabits } from "../slices/habitsSlice";
import { RootState } from "../store";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import HabitCard from "./HabitCard";
import HabitModal from "./HabitModal";


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


    const fetchHabits = async () => {
        try{
            setIsLoading(true)
            if(isLogged){
                const response = await getRemoteHabits(token ?? '')
                dispatch(refreshHabits(response.data))
            }
        }catch(error){
            toast.error(error instanceof Error ? error.message : HTTP_GENERAL_ERROR_MSG)
        }finally{
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchHabits()
    }, [isLogged, token])

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
                                return <HabitCard key={habit.id} habit={habit} />
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