import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { reviewApi } from '../../../api';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

// Тип Review с информацией из сервера
export interface User {
  id: number;
  username: string;
}

export interface Review {
  id: number;
  review_text: string;
  rating: number;
  sellerId: number;
  user: User;
}

export interface ReviewState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
}
const initialState: ReviewState = {
  reviews: [],
  loading: false,
  error: null,
};

export const createReview = createAsyncThunk<Review, { sellerId: number; review: string; rating: number,orderId:number }, { rejectValue: string }>(
  'review/create',
  async (payload, { rejectWithValue }) => {
    try {
      // В payload должны быть: sellerId, text, rating
      const token = Cookies.get('userToken'); 
      if (!token) throw new Error('Не авторизован');

      const decoded = jwtDecode<{ id: number }>(token);
      const userId = decoded.id;

      // вызываем API с информацией о пользователе
      const newReview = await reviewApi.create({ 
        userId, 
        ...payload 
      });

      return newReview;

    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchReviews = createAsyncThunk<Review[], number, { rejectValue: string }>(
  'review/fetchReviews',
  async (sellerId, { rejectWithValue }) => {
    try {
      // Получаем все отзывы для продавца
      return await reviewApi.getAll(sellerId);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const reviewSlice = createSlice({ 
  name:'review',
  initialState,
  reducers:{},
  extraReducers:(builder)=>{
    builder
      .addCase(createReview.pending, (state)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action: PayloadAction<Review>)=>{
        state.loading = false;
        state.reviews.push(action.payload);
      })
      .addCase(createReview.rejected, (state, action: PayloadAction<string | undefined>)=>{
        state.loading = false;
        state.error = action.payload ?? 'Неизвестная ошибка';
      })
      .addCase(fetchReviews.pending, (state)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action: PayloadAction<Review[]>)=>{
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action: PayloadAction<string | undefined>)=>{
        state.loading = false;
        state.error = action.payload ?? 'Неизвестная ошибка';
      })
  }
});

// Редюсер готов к импорту
export default reviewSlice.reducer;


