import { Check, HeartPulse, Settings } from "lucide-react";
import { useEffect } from "react";
import { themeChange } from 'theme-change'
import HabbitModal from "./HabbitModal";

export default function HomePage() {

    useEffect(() => {
        themeChange(false)
    }, [])


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
                    <p className="flex-1">Habit Tracker</p>
                </div>
                <HabbitModal />
            </header>
            <main className="py-2 px-4">
                <div className="card w-full bg-base-100 shadow-xl">
                    <div className="card-body">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-accent">
                                    <HeartPulse className="h-4 w-4" />
                                </div>
                                <h2 className="card-title">Shoes!</h2>
                            </div>
                            <button className="btn btn-secondary">
                                <Check className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}