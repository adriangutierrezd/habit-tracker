import { destroyHabits } from "../slices/habitsSlice";
import { logout } from "../slices/userSlice";
import { LogOut, Settings } from "lucide-react";
import { RootState } from "../store";
import { themeChange } from 'theme-change'
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import HabitModal from "./HabitModal";
import SignInModal from "./SignInModal";
import SignUpModal from "./SignUpModal";

export default function Header() {

    const dispatch = useDispatch()
    const { isLogged } = useSelector((state: RootState) => {
        return state.userSession
    });
    const handleLogout = () => {
        dispatch(logout())
        dispatch(destroyHabits())
    }

    useEffect(() => {
        themeChange(false)
    }, [])

    return (
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
                        <main className="p-4 w-80 min-h-full flex flex-col bg-base-200 text-base-content">
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
                            {isLogged ? (
                                <button onClick={handleLogout} className="btn btn-active w-full mt-auto">
                                    Cerrar sesión
                                    <LogOut className="h-4 w-4" />
                                </button>
                            ) : (
                                <div className="flex flex-col w-full space-y-4 mt-auto">
                                <SignInModal modalTrigger={
                                    <button className="btn btn-outline btn-primary">
                                        Iniciar sesión
                                    </button>
                                } />
                                <SignUpModal modalTrigger={
                                    <button className="btn btn-primary">
                                        Crear cuenta
                                    </button>
                                } />

                            </div>
                        )}
                        </main>
                    </div>
                </div>
                <h1 className="flex-1 font-semibold text-lg sm:text-2xl">Habit Tracker</h1>
            </div>
            <HabitModal selectedHabit={undefined} />
        </header>
    )
}