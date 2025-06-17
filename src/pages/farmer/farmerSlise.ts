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
  editStatus: string; 
  notifications: Array<string>,
}

const initialState: FarmerOrdersState = {
  orders: [],
  loading: false,
  status: 'idle',
  error: null,
  editStatus: '',
  notifications: [],
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
export const updateProduct = createAsyncThunk(
  'farmer/updateProduct',
  async (
    { id, formData }: { id: number; formData: FormData },
  ) => {
    const response = await farmerApi.updateProduct(id, formData);
    return response;
  },
);

export const fetchFarmerNotifications = createAsyncThunk(
  'farmer/fetchFarmerNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('farmerToken');
      if (!token) {
        return rejectWithValue('Вы не авторизованы');
      }

      const decoded = jwtDecode<{ id: number }>(token);
      const farmerId = decoded.id;

      const response = await farmerApi.getNotifications(farmerId);
      return response;
    } catch (error:any) {
      return rejectWithValue(error.response?.data?.message ||
        'Не удалось взять уведомления');
    }
  }
);
export const clearFarmerNotifications = createAsyncThunk<void, number>(
  'farmer/clearNotifications',
  async (farmerId, { rejectWithValue }) => {
    try {
      await farmerApi.clearNotifications(farmerId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Не удалось очистить уведомления');
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
    resetEditStatus(state) {
      state.editStatus = '';
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
      })
      .addCase(updateProduct.pending, (state) => {
        state.editStatus = 'loading';
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.editStatus = 'succeeded';

      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.editStatus = 'failed';
        state.error = action.error.message ?? 'Не удалось изменить';
      })
      .addCase(fetchFarmerNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFarmerNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchFarmerNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(clearFarmerNotifications.fulfilled, (state) => {
        state.notifications = []; // очищаем уведомления в состоянии
      })
      .addCase(clearFarmerNotifications.rejected, (state, action) => {
        state.error = action.payload as string;
      });
      
      ;
  },
});
export const { resetStatus, resetEditStatus } = farmerOrdersSlice.actions;
export default farmerOrdersSlice.reducer;