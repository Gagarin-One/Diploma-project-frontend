import type { Action, ThunkAction } from '@reduxjs/toolkit';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import counterSlice from '../features/counter/counterSlice';
import userSlice from '../pages/home/homeSlice';
import authSlice from '../features/authForm/authSlice';
import productSlice from '../pages/ProductsPage/productPageSlice';
import basketSlice from '../pages/basket/basketSlice';
import farmerSlise from '../pages/farmer/farmerSlise';
import farmerProductsSlice from '../pages/farmer/farmerProducts/farmerProductsSlice';
import orderSlice from '../features/order/orderSlice';

const rootReducers = combineReducers({
  counterSlice,
  userSlice,
  authSlice,
  productSlice,
  basketSlice,
  farmerSlise,
  farmerProductsSlice,
  orderSlice
});

export const store = configureStore({
  reducer: rootReducers,
});

// Infer the type of `store`
export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore['dispatch'];
// Define a reusable type describing thunk functions
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
