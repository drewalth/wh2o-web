import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '../index'
import { Gage } from 'interfaces'
import { getGages } from 'controllers'

interface GageState {
  data: Gage[]
  loading: boolean
  error: boolean
}

const initialState: GageState = {
  data: [],
  loading: false,
  error: false,
}

export const fetchGages = createAsyncThunk(
  'gages/fetchGagesStatus',
  async (val, thunkAPI) => {
    return await getGages()
  }
)

export const gagesSlice = createSlice({
  name: 'gages',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setData: (state, action) => {
      state.data = { ...action.payload }
    },
    resetData: (state) => {
      state.data = []
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
  extraReducers: {
    // @ts-ignore
    [fetchGages.fulfilled]: (state, action) => {
      state.data = [...action.payload]
    },
  },
})

export const { setLoading, setData, resetData, setError } = gagesSlice.actions

export const selectGagesData = (state: RootState) => state.gages.data
export const selectGagesLoading = (state: RootState) => state.gages.loading
export const selectGagesError = (state: RootState) => state.gages.error

export default gagesSlice.reducer
