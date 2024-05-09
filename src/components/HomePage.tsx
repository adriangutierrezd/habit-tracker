import { Check, CirclePlus, HeartPulse, Settings } from "lucide-react";
import { useEffect } from "react";
import { themeChange } from 'theme-change'
import { AVAILABLE_COLORS, HABIT_FREQUENCY } from "../constants";
import { BasicOption } from "../types";

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
                                        <select data-choose-theme className="select select-ghost w-full max-w-xs">
                                            <option disabled selected>Tema de la app</option>
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
                <button className="btn" onClick={() => document.getElementById('my_modal_2').showModal()}>
                    <CirclePlus className="h-4 w-4" />
                </button>
                <dialog id="my_modal_2" className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Nuevo hábito</h3>
                        <form className="my-3 space-y-3">
                            <input type="text" placeholder="Nombre del hábito" className="input input-bordered w-full" />
                            <textarea className="textarea textarea-bordered w-full" placeholder="Descripción"></textarea>
                            <select className="select select-bordered w-full">
                                <option disabled selected>Periodicidad</option>
                                {HABIT_FREQUENCY.map((habitFrequency: BasicOption) => {
                                    return <option key={habitFrequency.value} value={habitFrequency.value}>
                                        {habitFrequency.label}
                                    </option>
                                })}
                            </select>

                            <div className="flex items-center spacex-2">
                                {AVAILABLE_COLORS.map((color) => {
                                    return <input key={color} type="radio" name="color" className="radio mr-2" checked style={{ backgroundColor: color }} />
                                })}
                            </div>

                        </form>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>
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