import { Info, X } from "lucide-react";
import SignInModal from "./SignInModal";
import SignUpModal from "./SignUpModal";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";


export default function AccountBanner() {

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

    const handleCloseAccountBanner = () => {
        window.localStorage.setItem('hide-account-banner', '1')
        setShowAccountBanner(false)
    }


    return (
        <>
            {(!isLogged && showAccountBanner) && (
                <div role="alert" className="alert block mb-4">
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
                            <div className="flex items-center justify-end space-x-4 mt-4">
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
                        </main>
                    </article>
                </div>
            )}
        </>
    )
}