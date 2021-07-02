import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../index'

interface AppState {
  windowWidth: number
}

const initialState: AppState = {
  windowWidth: 0,
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setWidth: (state, action) => {
      state.windowWidth = action.payload
    },
  },
})

export const { setWidth } = appSlice.actions

export const selectAppWindowWidth = (state: RootState) => state.app.windowWidth

export default appSlice.reducer
