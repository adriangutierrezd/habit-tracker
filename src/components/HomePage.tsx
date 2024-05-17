import { CirclePlus, Info, Settings, X } from "lucide-react";
import { useEffect, useState } from "react";
import { themeChange } from 'theme-change'
import HabbitModal from "./HabbitModal";
import { getLocalHabbits, getRemoteHabbits } from "../services/habbitsService";
import { Habbit } from "../types";
import HabbitList from "./HabbitList";
import { Toaster } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import SignUpModal from "./SignUpModal";

export default function HomePage() {

    useEffect(() => {
        themeChange(false)
    }, [])

    const { isLogged, token } = useSelector((state: RootState) => {
        return state.userSession
    });
    const [habbits, setHabbits] = useState<Array<Habbit>>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [showAccountBanner, setShowAccountBanner] = useState<boolean>(false)

    const handleAddHabbit = (data: Habbit) => {
        setHabbits([...habbits, data])
    }

    const fetchHabbits = async () => {
        setIsLoading(true)
        if (!isLogged) {
            setHabbits(getLocalHabbits().data)
            setIsLoading(false)
        } else {
            try {
                const response = await getRemoteHabbits(token ?? '')
                setHabbits(response.data)
                setIsLoading(false)
            } catch (error) {
                // TODO
            }
        }
    }

    useEffect(() => {
        fetchHabbits()
        const hideBanner = window.localStorage.getItem('hide-account-banner')
        if (!hideBanner) {
            setShowAccountBanner(true)
        }
    }, [])

    const handleUpdateHabbit = (data: Habbit, id: string) => {
        const newHabbits = structuredClone(habbits)
        const habbitIndex = newHabbits.findIndex((habbit: Habbit) => habbit.id == id)
        newHabbits[habbitIndex] = data
        setHabbits(newHabbits)
    }

    const handleCloseAccountBanner = () => {
        window.localStorage.setItem('hide-account-banner', '1')
        setShowAccountBanner(false)
    }


    return (
        <>
            <header className="flex items-center justify-between py-2 px-4 my-6">
                <div className="flex flex-1 items-center justify-start space-x-3">
                    <div className="drawer w-auto z-20">
                        <input id="settings-drawer" type="checkbox" className="drawer-toggle" />
                        <div className="drawer-content">
                            <label htmlFor="settings-drawer" className="btn drawer-button">
                                <Settings className="h-4 w-4" />
                            </label>
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
                <HabbitModal selectedHabbit={undefined} handleUpdateHabbit={handleUpdateHabbit} />
            </header>
            <main className="py-2 px-4">
                {(!isLogged && showAccountBanner) && (
                    <div role="alert" className="alert mb-4">
                        <article>
                            <header className="font-semibold text-md flex justify-between items-center mb-3">
                                <div className="flex items-center">
                                    <Info className="h-5 w-5 mr-2 stroke-info" />
                                    No has iniciado sesión
                                </div>
                                <button onClick={handleCloseAccountBanner} className="btn btn-sm btn-ghost">
                                    <X className="h-4 w-4" />
                                </button>
                            </header>
                            <main>
                                <p>Si no tienes una cuenta tus datos se guardarán pero solo estarán disponibles en este dispositivo.</p>
                                <p>Al crear una cuenta <b>tus datos se traspasarán para que no los pierdas</b> y puedas acceder a ellos en cualquier momento.</p>
                                <div className="flex items-center justify-end space-x-4">
                                    <button className="btn btn-outline btn-primary">
                                        Iniciar sesión
                                    </button>
                                    <SignUpModal modalTrigger={
                                        <button className="btn btn-primary">
                                            Crear cuenta
                                        </button>
                                    } />

                                </div>
                            </main>
                        </article>
                    </div>
                )}

                {isLoading ? (
                    <div className="flex flex-col space-y-4">
                        <div className="skeleton w-full h-32"></div>
                        <div className="skeleton w-full h-32"></div>
                        <div className="skeleton w-full h-32"></div>
                    </div>
                ) : (
                    <>
                        {habbits.length > 0 ? (
                            <HabbitList handleUpdateHabbit={handleUpdateHabbit} habbits={habbits} />
                        ) : (
                            <div className="border border-dashed p-6 border-2 flex items-center justify-center flex-col space-y-4 rounded">
                                <h2 className="font-semibold text-md sm:text-xl">Aún no has añadido ningún hábito</h2>
                                <p>Guardaremos todos los hábitos que crees en esta plataforma junto con tu seguimento</p>
                                <HabbitModal modalId="firstHabbitModal" selectedHabbit={undefined} handleAddHabbit={handleAddHabbit} modalTrigger={
                                    <button className="btn btn-primary modal-trigger">
                                        <CirclePlus className="h-4 w-4 modal-trigger" />
                                        Añadir
                                    </button>
                                } />
                            </div>
                        )}
                    </>
                )}

                <Toaster richColors={true} className="z-100" />
            </main>
        </>
    )
}