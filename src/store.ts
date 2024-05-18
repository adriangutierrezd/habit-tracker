import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import habitReducer from './slices/habitsSlice'

export const store = configureStore({
  reducer: {
    userSession: userReducer,
    userHabits: habitReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch