import { HTTP_CREATED_CODE, HTTP_GENERAL_ERROR_MSG, HTTP_OK_CODE } from "../constants";
import { getHeaders } from "../utils";


export const signUp = async({ email, password }: { email: string, password: string }) => {
    try{

        const myHeaders = getHeaders(null)

        const raw = JSON.stringify({ email, password });
    
        const requestOptions: RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
    
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sign-up`, requestOptions)
        const data = await response.json()
        if(data.status !== HTTP_CREATED_CODE) throw new Error(data.message)
        return data

    }catch(error){
        throw new Error(error instanceof Error ? error.message : HTTP_GENERAL_ERROR_MSG)
    }
}

export const signIn = async({ email, password }: { email: string, password: string }) => {
    try{

        const myHeaders = getHeaders(null)

        const raw = JSON.stringify({ email, password });
    
        const requestOptions: RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
    
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth`, requestOptions)
        const data = await response.json()
        if(data.status !== HTTP_OK_CODE) throw new Error(data.message)
        return data

    }catch(error){
        throw new Error(error instanceof Error ? error.message : HTTP_GENERAL_ERROR_MSG)
    }
}