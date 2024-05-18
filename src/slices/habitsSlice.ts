import { createSlice } from '@reduxjs/toolkit';
import { Habbit } from '../types';

interface HabitsSlice {
    habits: Habbit[]
}

const defaultInitialState: HabitsSlice = {
    habits: []
}

const getInitialState = (): HabitsSlice => {
  const auxInitialHabits: string|null = window.localStorage.getItem('userHabits')
  if(!auxInitialHabits){
    return defaultInitialState 
  }

  return JSON.parse(auxInitialHabits)
}

export const habitSlice = createSlice({
  name: 'userHabits',
  initialState: getInitialState(),
  reducers: {
    refreshHabits: (state, data) => {
        const { payload } = data
        state.habits = payload
        window.localStorage.setItem('userHabits', JSON.stringify(state))
    },
    addHabit: (state, data) => {
        const { payload } = data
        const actualHabits = state.habits
        state.habits = [...actualHabits, payload]
        window.localStorage.setItem('userHabits', JSON.stringify(state))
    },
    removeHabit: (state, data) => {
        const { payload } = data
        state.habits = state.habits.filter((habit: Habbit) => habit.id !== payload)
        window.localStorage.setItem('userHabits', JSON.stringify(state))
    },
    updateHabit: (state, data) => {
        const { payload } = data
        const newHabbits = state.habits
        const habbitIndex = newHabbits.findIndex((habbit: Habbit) => habbit.id == payload.id)
        newHabbits[habbitIndex] = payload.habit
        state.habits = newHabbits
        window.localStorage.setItem('userHabits', JSON.stringify(state))
    }
  },
});


export const { addHabit, removeHabit, updateHabit, refreshHabits } = habitSlice.actions;
export default habitSlice.reducer;