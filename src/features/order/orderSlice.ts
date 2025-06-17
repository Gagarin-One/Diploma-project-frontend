// store/order/orderSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { orderApi } from '../../api';
import { fetchFarmerOrders } from '../../pages/farmer/farmerSlise';

type OrderState = {
  loading: boolean;
  error: string | null;
  userOrders: any[]; 
  farmerOrders: any[];
};

const initialState: OrderState = {
  loading: false,
  error: null,
  userOrders: [], 
  farmerOrders: []
};

export const createOrdersFromBasket = createAsyncThunk(
  'order/createOrdersFromBasket',
  async (
    { address, delivery_date }: { address: string; delivery_date: string },
    { rejectWithValue }
  ) => {
    try {
      const token = Cookies.get('userToken');
      if (!token) throw new Error('Пользователь не авторизован');

      const decoded = jwtDecode<{ id: number }>(token);
      const userId = decoded.id;

      const response = await orderApi.create({ userId, address, delivery_date });
      return response.orders;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Ошибка при оформлении заказа');
    }
  }
);

export const changeOrderStatus = createAsyncThunk(
  'order/changeOrderStatus',
  async ({ orderId, status }: { orderId: number; status: string }, { dispatch, rejectWithValue }) => {
    try {
      await orderApi.changeStatus(orderId, status);
      dispatch(fetchFarmerOrders()); 
      dispatch(fetchUserOrders())
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка при обновлении статуса');
    }
  }
);
export const fetchUserOrders = createAsyncThunk(
  'userOrders/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('userToken');
      if (!token) throw new Error('Пользователь не авторизован');
      const decoded = jwtDecode<{ id: number }>(token);
      const response = await orderApi.getUserOrders(decoded.id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Ошибка при получении заказов');
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
        state.farmerOrders = action.payload;
      })
      .addCase(createOrdersFromBasket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(changeOrderStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default orderSlice.reducer;
