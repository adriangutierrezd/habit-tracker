import { createSlice } from '@reduxjs/toolkit';
import { Habit } from '../types';

interface HabitsSlice {
    habits: Habit[]
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
        state.habits = state.habits.filter((habit: Habit) => habit.id !== payload)
        window.localStorage.setItem('userHabits', JSON.stringify(state))
    },
    updateHabit: (state, data) => {
        const { payload } = data
        const newHabits = state.habits
        const habitIndex = newHabits.findIndex((habit: Habit) => habit.id == payload.id)
        newHabits[habitIndex] = payload.habit
        state.habits = newHabits
        window.localStorage.setItem('userHabits', JSON.stringify(state))
    },
    destroyHabits: (state) => {
      state.habits = []
      window.localStorage.setItem('userHabits', JSON.stringify(state))
    }
  },
});


export const { addHabit, removeHabit, updateHabit, refreshHabits, destroyHabits } = habitSlice.actions;
export default habitSlice.reducer;