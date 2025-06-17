import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
  userId: number;
  username: string;
  email: string;
  password: string;
}

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  products: Array<Product> | null;
  currentPage: number;
  totalProductsAmount: number;
  userName:string
}
export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  img_url: string;
  sellerName: string;
  sellerId: number;
  categoryId: number;
  measure:string
};

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  products: null,
  currentPage: 1,
  totalProductsAmount: 1,
  userName:'',
};

interface FetchAllProductsParams {
  page?: number;
  categoryId?: number;
  searchString?: string;
  priceSort?: 'asc' | 'desc';
}

export const fetchAllProducts = createAsyncThunk(
  'user/fetchAllProducts',
  async ({ page, categoryId, searchString, priceSort }: FetchAllProductsParams) => {
    const params: {
      limit?: number;
      page?: number;
      categoryId?: number;
      searchString?: string;
      priceSort?: string;
    } = {};

    params.limit = 16;
    if (page !== undefined) params.page = page;
    if (categoryId !== undefined) params.categoryId = categoryId;
    if (searchString !== undefined) params.searchString = searchString;
    if (priceSort) params.priceSort = priceSort;

    const response = await axios.get('http://localhost:5001/api/product', { params });
    return response.data;
  }
);


const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
      setUserName: (state, action: PayloadAction<string>) => {
        state.userName =  action.payload;
      },
    //   reset: (state) => {
    //     state.value = 0;
    // }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.rows;
        state.totalProductsAmount = action.payload.count;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Что-то пошло не так';
      });
  },
});
export const selectProducts = (state: UserState) => state.products;
export const { setCurrentPage, setUserName} = userSlice.actions;

export default userSlice.reducer;
