import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '../index'
import { IRiver, RiverModel } from 'interfaces'
import { getRiver } from 'controllers'

interface RiverState {
  data: IRiver
  loading: boolean
  error: boolean
}

const initialState: RiverState = {
  data: { ...RiverModel },
  loading: false,
  error: false,
}

export const fetchRiver = createAsyncThunk(
  'river/fetchRiver',
  async (reachId: number, thunkAPI) => {
    return await getRiver(reachId)
  }
)

export const riverSlice = createSlice({
  name: 'river',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setData: (state, action) => {
      state.data = { ...action.payload }
    },
    resetData: (state) => {
      state.data = { ...RiverModel }
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
  extraReducers: {
    // @ts-ignore
    [fetchRiver.fulfilled]: (state, action) => {
      state.data = { ...action.payload }
    },
  },
})

export const { setLoading, setData, resetData, setError } = riverSlice.actions

export const selectRiverData = (state: RootState) => state.river.data
export const selectRiverLoading = (state: RootState) => state.river.loading
export const selectRiverError = (state: RootState) => state.river.error

export default riverSlice.reducer
