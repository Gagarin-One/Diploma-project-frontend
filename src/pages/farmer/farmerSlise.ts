import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { farmerApi } from '../../api'; // предполагается, что farmerApi.getOrders() есть
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  img_url: string;
  sellerId: number;
  categoryId: number;
}

export interface OrderDetail {
  id: number;
  quantity: number;
  product: Product;
}

export interface Order {
  id: number;
  total_price: number;
  status: string;
  createdAt: string;
  order_details: OrderDetail[];
}

interface FarmerOrdersState {
  orders: Order[];
  loading: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: FarmerOrdersState = {
  orders: [],
  loading: false,
  status: 'idle',
  error: null,
};

export const addProduct = createAsyncThunk(
  'farmer/addProduct',
  async (formData: FormData, thunkAPI) => {
    try {
      const response = await farmerApi.createProduct(formData);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Ошибка при добавлении товара');
    }
  }
);

export const fetchFarmerOrders = createAsyncThunk<Order[], void, { rejectValue: string }>(
  'farmerOrders/fetchFarmerOrders',
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('farmerToken');
      if (!token) {
        return rejectWithValue('Вы не авторизованы');
      }

      const decoded = jwtDecode<{ id: number }>(token);
      const userId = decoded.id;

      const response = await farmerApi.getOrders(userId);
      return response; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка при загрузке заказов');
    }
  }
);


const farmerOrdersSlice = createSlice({
  name: 'farmerOrders',
  initialState,
  reducers: {
    resetStatus(state) {
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFarmerOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFarmerOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchFarmerOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addProduct.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});
export const { resetStatus } = farmerOrdersSlice.actions;
export default farmerOrdersSlice.reducer;