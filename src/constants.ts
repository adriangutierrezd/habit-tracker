import { BasicOption } from "./types";

export const HABIT_FREQUENCY: BasicOption[] = [
    { label: 'Día', value: 'DAY' },
    { label: 'Semana', value: 'WEEK' },
    { label: 'Mes', value: 'MONTH' },
    { label: 'Quincena', value: 'FORTNIGHT' },
]

export const AVAILABLE_COLORS: Array<string> = [
    '#a8e6cf',
    '#dcedc1',
    '#ffd3b6',
    '#ff8b94',
    '#bae1ff',
    '#ffffba',
    '#e0d6ff',
    '#5a5255',
    '#559e83',
    '#1b85b8'
]

export const HTTP_OK_CODE = 200
export const HTTP_CREATED_CODE = 201
export const HTTP_NOT_FOUND_CODE = 404
export const HTTP_FETCHED_MSG = 'Datos obtenidos con éxito'
export const HTTP_DELETED_MSG = 'Recurso eliminado con éxito'
export const HTTP_CREATED_MSG = 'Recurso creado con éxito'
export const HTTP_UPDATED_MSG = 'Recurso actualizado con éxito'
export const HTTP_NOT_FOUND_MSG = 'Recurso no encontrado'
export const HTTP_GENERAL_ERROR_MSG = 'Ha ocurrido un error inesperado'
export const HABIT_STORAGE_KEY = 'habits'
export const HABIT_RECORD_STORAGE_KEY = 'habit-records'

