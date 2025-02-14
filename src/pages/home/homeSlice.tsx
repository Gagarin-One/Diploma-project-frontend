import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
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
  products: Array<Product> | null
}
type Product = {
id: number,
name: string,
description: string,
price: number,
img_url: string
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  products:null
};


export const fetchUserProfile = createAsyncThunk('user/fetchUserProfile', async () => {
  const response = await axios.get('http://localhost:5001/api/user/auth/'); 
  return response.data;
});

export const fetchAllProducts = createAsyncThunk('user/fetchAllProducts', async () => {
  const response = await axios.get('http://localhost:5001/api/product'); 
  return response.data;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
//     increment: (state) => {
//     state.value += 1;
//   },
//   decrement: (state) => {
//     state.value -= 1;
//   },
//   reset: (state) => {
//     state.value = 0;
// }
},
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
      })
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.rows;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Что-то пошло не так';
      })

  },
});
export const selectProducts = (state:UserState) => state.products;

export default userSlice.reducer;