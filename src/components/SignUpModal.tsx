import React, { useState } from "react";
import { login } from "../slices/userSlice";
import { RootState } from "../store";
import { signUp } from "../services/usersService";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { HTTP_GENERAL_ERROR_MSG } from "../constants";

const MODAL_ID = 'signUpModal'

interface Props {
    readonly modalTrigger: JSX.Element;
}

export default function SignUpModal({ modalTrigger }: Props) {

    const dispatch = useDispatch()
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [passwordRepeat, setPasswordRepeat] = useState<string>('')
    const [emailError, setEmailError] = useState<string>('')
    const [passwordError, setPasswordError] = useState<string>('')
    const [passwordRepeatError, setPasswordRepeatError] = useState<string>('')
    const { isLogged } = useSelector((state: RootState) => {
        return state.userSession
    });

    const handleChangeModalStatus = (status: boolean) => {
        resetFields()
        clearErrors()

        const modalElement = document.getElementById(MODAL_ID) as HTMLDialogElement | null;
        if (modalElement) {
            if (status) {
                modalElement.showModal()
            } else {
                modalElement.close()
            }
        }
    }

    const clearErrors = () => {
        setEmailError('')
        setPasswordError('')
        setPasswordRepeatError('')
    }

    const resetFields = () => {
        setEmail('')
        setPassword('')
        setPasswordRepeat('')
    }

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        try {

            event.preventDefault()
            let hasErrors = false
            clearErrors()

            if (password !== passwordRepeat) {
                hasErrors = true
                setPasswordRepeatError('Las contraseñas no coinciden')
            }
            
            if (hasErrors) {
                return
            }

            const response = await signUp({email, password})
            const {data} = response

            const userData = {
                token: data.token,
                user: data.user
              }
         
              dispatch(login(userData))
              handleChangeModalStatus(false)
            

        } catch (error) {
            toast.error(error instanceof Error ? error.message : HTTP_GENERAL_ERROR_MSG)
        }
    }

    const handleOpenModal = () => {
        handleChangeModalStatus(true);
    }

    return (
        <>
            {modalTrigger && React.cloneElement(modalTrigger, { onClick: handleOpenModal })}
            <dialog id={MODAL_ID} className="modal">
                <div className="modal-box">
                    {isLogged ? (<p>Ya has iniciado sesión</p>) : (
                        <>
                            <h3 className="font-bold text-center text-lg">Crea una cuenta</h3>
                            <form onSubmit={onSubmit} className="my-3 space-y-3">

                                <label htmlFor="email" className="block">Email:</label>
                                <input type="email" value={email} onChange={(event) => {
                                    setEmail(event.target.value)
                                }} placeholder="ejemplo@gmail.com" className="input input-bordered w-full"
                                    required minLength={3} maxLength={255} />
                                <span className="text-sm text-red-500">{emailError}</span>

                                <label htmlFor="password" className="block">Contraseña:</label>
                                <input type="password" value={password} onChange={(event) => {
                                    setPassword(event.target.value)
                                }} className="input input-bordered w-full"
                                    required minLength={5} maxLength={255} />
                                <span className="text-sm text-red-500">{passwordError}</span>

                                <label htmlFor="passwordRepeat" className="block">Repetir contraseña:</label>
                                <input type="password" value={passwordRepeat} onChange={(event) => {
                                    setPasswordRepeat(event.target.value)
                                }} className="input input-bordered w-full"
                                    required minLength={5} maxLength={255} />
                                <span className="text-sm text-red-500">{passwordRepeatError}</span>

                                <div className="flex items-center justify-end space-x-2">
                                    <button onClick={() => { handleChangeModalStatus(false) }} type="button" className="btn btn-active btn-ghost">Cancelar</button>
                                    <button type="submit" className="btn btn-neutral btn-active">Crear cuenta</button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    )
}