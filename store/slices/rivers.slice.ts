import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '../index'
import { River, ReachSearchParams } from '../../interfaces'
import { getRivers } from '../../controllers'

interface RiverState {
  data: River[]
  loading: boolean
  error: boolean
}

const initialState: RiverState = {
  data: [],
  loading: false,
  error: false,
}

export const fetchRivers = createAsyncThunk(
  'rivers/fetchRiversStatus',
  async (val: ReachSearchParams, thunkAPI) => {
    return await getRivers(val)
  }
)

export const riversSlice = createSlice({
  name: 'rivers',
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
    [fetchRivers.pending]: (state, action) => {
      state.loading = true
    },
    // @ts-ignore
    [fetchRivers.fulfilled]: (state, action) => {
      state.data = [...action.payload]
      state.loading = false
    },
    // @ts-ignore
    [fetchRivers.rejected]: (state, action) => {
      state.loading = false
    },
  },
})

export const { setLoading, setData, resetData, setError } = riversSlice.actions

export const selectRiversData = (state: RootState) => state.rivers.data
export const selectRiversLoading = (state: RootState) => state.rivers.loading
export const selectRiversError = (state: RootState) => state.rivers.error

export default riversSlice.reducer
