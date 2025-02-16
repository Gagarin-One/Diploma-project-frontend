import type { Action, ThunkAction } from '@reduxjs/toolkit'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import counterSlice from '../features/counter/counterSlice'
import userSlice from '../pages/home/homeSlice';
import authSlice from '../features/authForm/authSlice';

const rootReducers = combineReducers({
  counterSlice,
  userSlice,
  authSlice
})


export const store = configureStore({
  reducer: rootReducers
})

// Infer the type of `store`
export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore['dispatch']
// Define a reusable type describing thunk functions
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>