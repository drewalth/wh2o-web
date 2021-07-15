import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../index'
import { User } from '../../interfaces'
import { getUser } from 'controllers'

interface UserState {
  data: User
  loading: boolean
  error: boolean
}

const initialState: UserState = {
  data: {} as User,
  loading: false,
  error: false,
}

export const fetchUser = createAsyncThunk(
  'user/fetchUserStatus',
  async (userId: string | number, thunkAPI) => {
    return await getUser(userId)
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserLoading: (state, action) => {
      state.loading = action.payload
    },
    setUser: (state, action) => {
      state.data = { ...action.payload }
    },
    resetUser: (state, action) => {
      state.data = { ...action.payload }
    },
    setUserError: (state, action) => {
      state.error = action.payload
    },
  },
  extraReducers: {
    // @ts-ignore
    [fetchUser.fulfilled]: (state, action) => {
      state.data = { ...action.payload }
    },
  },
})

export const { setUser, resetUser, setUserLoading, setUserError } =
  userSlice.actions

export const selectUserData = (state: RootState) => state.user.data
export const selectUserIsPublisher = (state: RootState) =>
  state.user.data.verified &&
  (state.user.data.role === 'ADMIN' ||
    state.user.data.role === 'SUPERADMIN' ||
    state.user.data.role === 'EDITOR')
export const selectUserLoading = (state: RootState) => state.user.loading
export const selectUserError = (state: RootState) => state.user.error

export default userSlice.reducer
