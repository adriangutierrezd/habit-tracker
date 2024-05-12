import { CirclePlus, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { themeChange } from 'theme-change'
import HabbitModal from "./HabbitModal";
import { getLocalHabbits } from "../services/habbitsService";
import { Habbit } from "../types";
import HabbitList from "./HabbitList";
import { Toaster } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function HomePage() {

    useEffect(() => {
        themeChange(false)
    }, [])

    const { isLogged } = useSelector((state: RootState) => {
        return state.userSession
    });
    const [habbits, setHabbits] = useState<Array<Habbit>>([])

    const handleAddHabbit = (data: Habbit) => {
        setHabbits([...habbits, data])
    }

    const fetchHabbits = () => {
        if (!isLogged) {
            setHabbits(getLocalHabbits().data)
        }
    }

    useEffect(() => {
        fetchHabbits()
    }, [])

    const handleUpdateHabbit = (data: Habbit, id: string) => {
        const newHabbits = structuredClone(habbits)
        const habbitIndex = newHabbits.findIndex((habbit: Habbit) => habbit.id == id)
        newHabbits[habbitIndex] = data
        setHabbits(newHabbits)
    }

    return (
        <>
            <header className="flex items-center justify-between py-2 px-4 my-6">
                <div className="flex flex-1 items-center justify-start space-x-3">
                    <div className="drawer w-auto z-20">
                        <input id="settings-drawer" type="checkbox" className="drawer-toggle" />
                        <div className="drawer-content">
                            <label htmlFor="settings-drawer" className="btn drawer-button"><Settings className="h-4 w-4" /></label>
                        </div>
                        <div className="drawer-side">
                            <label htmlFor="settings-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                            <main className="p-4 w-80 min-h-full bg-base-200 text-base-content">
                                <header className="font-semibold text-lg mb-3">Ajustes</header>
                                <ul>
                                    <li>
                                        <select defaultValue="0" data-choose-theme className="select select-ghost w-full max-w-xs">
                                            <option disabled value="0">Tema de la app</option>
                                            <option value="light">Claro</option>
                                            <option value="dark">Oscuro</option>
                                            <option value="forest">Bosque</option>
                                            <option value="cyberpunk">Cyberpunk</option>
                                            <option value="emerald">Esmeralda</option>
                                        </select>
                                    </li>
                                </ul>
                            </main>
                        </div>
                    </div>
                    <h1 className="flex-1 font-semibold text-lg sm:text-2xl">Habit Tracker</h1>
                </div>
                <HabbitModal selectedHabbit={undefined} handleAddHabbit={handleAddHabbit} />
            </header>
            <main className="py-2 px-4">
                {habbits.length > 0 ? (
                    <HabbitList refreshHabbits={fetchHabbits} handleUpdateHabbit={handleUpdateHabbit} habbits={habbits} />
                ) : (
                    <div className="border border-dashed p-6 border-2 flex items-center justify-center flex-col space-y-4 rounded">
                        <h2 className="font-semibold text-md sm:text-xl">Aún no has añadido ningún hábito</h2>
                        <p>Guardaremos todos los hábitos que crees en esta plataforma junto con tu seguimento</p>
                        <HabbitModal modalId="firstHabbitModal" selectedHabbit={undefined} handleAddHabbit={handleAddHabbit} modalTrigger={
                            <button>
                                <button className="btn btn-primary">
                                    <CirclePlus className="h-4 w-4" />
                                    Añadir
                                </button>
                            </button>
                        } />
                    </div>
                )}

                <Toaster richColors={true} />
            </main>
        </>
    )
}