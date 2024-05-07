import { createSlice } from '@reduxjs/toolkit';
import { UserSession } from '../types';

const defaultInitialState : UserSession = {
  token: null,
  user: null,
};

const getInitialState = (): UserSession => {
  const auxInitialSession: string|null = window.localStorage.getItem('userSession')
  if(!auxInitialSession){
    return defaultInitialState
  }

  const auxInitialStateData = JSON.parse(auxInitialSession)
  const { token, user: userData} = auxInitialStateData

  return {
    token: token,
    user: {
        id: userData.id,
        name: userData.name,
        email: userData.email
    },
  }

}

export const userSlice = createSlice({
  name: 'userSession',
  initialState: getInitialState(),
  reducers: {
    logout: (state) => {
        window.localStorage.removeItem('userSession')
        const { user, token } = defaultInitialState
        state.user = user
        state.token = token
    },
    login: (state, data) => {
        const { payload } = data
        window.localStorage.setItem('userSession', JSON.stringify(payload))
        state.user = payload.user
        state.token = payload.token
    },
  },
});


export const { login, logout } = userSlice.actions;
export default userSlice.reducer;