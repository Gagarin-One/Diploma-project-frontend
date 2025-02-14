import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


interface User {
  name: string;
  email: string;
  age: number;
}

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

// Асинхронное действие для получения данных профиля пользователя
export const fetchUserProfile = createAsyncThunk('user/fetchUserProfile', async () => {
  const response = await axios.get('/api/user/profile'); 
  return response.data;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {increment: (state) => {
    state.value += 1;
  },
  decrement: (state) => {
    state.value -= 1;
  },
  reset: (state) => {
    state.value = 0;
}},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Что-то пошло не так';
      });
  },
});

export default userSlice.reducer;