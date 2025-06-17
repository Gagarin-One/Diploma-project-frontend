// farmerProductsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { farmerApi } from '../../../api';
import { RootState } from '../../../redux/store';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';



interface FarmerProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  img_url: string;
  sellerName: string;
  sellerId: number;
  categoryId: number;
}

interface FarmerProductsState {
  products: FarmerProduct[];
  totalProducts: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
  searchString:string;
}

const initialState: FarmerProductsState = {
  products: [],
  totalProducts: 0,
  currentPage: 1,
  loading: false,
  error: null,
  searchString:''
};

// Параметры для запроса
interface FetchFarmerProductsParams {
  page?: number;
  categoryId?: number;
  searchString?: string;
}

export const fetchFarmerProducts = createAsyncThunk(
  'farmer/fetchFarmerProducts',
  async ({ page, categoryId, searchString }: FetchFarmerProductsParams) => {

    const token = Cookies.get('farmerToken');
    if (!token) throw new Error('Пользователь не авторизован');
      const decoded = jwtDecode<{ id: number }>(token);
      const sellerId = decoded.id;
    
    const params: { limit?: number; page?: number; sellerId?: number; categoryId?: number; searchString?: string } = {};

    params.sellerId = sellerId
    params.limit = 16;

    if (page !== undefined) {
      params.page = page;
    }

    if (categoryId !== undefined) {
      params.categoryId = categoryId;
    }

    if (searchString !== undefined) {
      params.searchString = searchString;
    }

    // Отправка запроса к API
    const response = await farmerApi.getProductsByFarmer(params);

    return response; 
  }
);


const farmerProductsSlice = createSlice({
  name: 'farmerProducts',
  initialState,
  reducers: {
    setFarmerPage(state, action) {
      state.currentPage = action.payload;
    },
    setSearchQuery(state, action) {
      state.searchString = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFarmerProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFarmerProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.rows;
        state.totalProducts = action.payload.count;
      })
      .addCase(fetchFarmerProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Ошибка при загрузке товаров фермера';
      });
  },
});

export const { setFarmerPage, setSearchQuery } = farmerProductsSlice.actions;
export default farmerProductsSlice.reducer;
