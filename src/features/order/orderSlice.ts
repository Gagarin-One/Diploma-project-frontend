// store/order/orderSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { orderApi } from '../../api';

type OrderState = {
  loading: boolean;
  error: string | null;
  orders: any[]; // можешь уточнить тип
};

const initialState: OrderState = {
  loading: false,
  error: null,
  orders: [],
};

export const createOrdersFromBasket = createAsyncThunk(
  'order/createOrdersFromBasket',
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('authToken');
      if (!token) throw new Error('Пользователь не авторизован');

      const decoded = jwtDecode<{ id: number }>(token);
      const userId = decoded.id;

      const response = await orderApi.create(userId);
      return response.orders;
    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message || 'Что-то пошло не так');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrdersFromBasket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrdersFromBasket.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(createOrdersFromBasket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default orderSlice.reducer;
