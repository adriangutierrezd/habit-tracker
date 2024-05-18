import { Info, Settings, X } from "lucide-react";
import { useEffect, useState } from "react";
import { themeChange } from 'theme-change'
import HabitModal from "./HabitModal";
import HabitList from "./HabitList";
import { Toaster } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import SignUpModal from "./SignUpModal";

export default function HomePage() {

    const [showAccountBanner, setShowAccountBanner] = useState<boolean>(false)
    const { isLogged } = useSelector((state: RootState) => {
        return state.userSession
    });


    useEffect(() => {
        const hideBanner = window.localStorage.getItem('hide-account-banner')
        if (!hideBanner) {
            setShowAccountBanner(true)
        }
    }, [])

    useEffect(() => {
        themeChange(false)
    }, [])


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
                <HabitModal selectedHabit={undefined} />
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

                <HabitList />

                <Toaster richColors={true} className="z-100" />
            </main>
        </>
    )
}