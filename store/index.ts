import { configureStore } from '@reduxjs/toolkit'
// ...
import userReducer from './slices/user.slice'
import gagesReducer from './slices/gages.slice'
import riversReducer from './slices/rivers.slice'
import riverReducer from './slices/river.slice'

export * from './hooks'

export const store = configureStore({
  reducer: {
    rivers: riversReducer,
    gages: gagesReducer,
    user: userReducer,
    river: riverReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
