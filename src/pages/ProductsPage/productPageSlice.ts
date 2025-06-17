import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { basketApi, productApi, userApi } from '../../api';
import { basketDto, JwtPayload } from '../../types/types';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { getBasket } from '../basket/basketSlice';

interface Product{
  id: number|null;
  productName: string|null;
  description: string|null;
  price: number|null;
  img:string|null;
  sellerName:string|null;
  category:string|null;
}
interface ProductState {
  productInfo:Product
  loading: boolean;
  error: string | null;
  isAddToBasket:boolean
}

const initialState: ProductState = {
  productInfo:{
    id: null,
    productName: null,
    description: null,
    price: null,
    img:null,
    sellerName:null,
    category:null, 
  },
    loading: false,
    error: null,
    isAddToBasket:false
};

export const getProductById = createAsyncThunk('product', async (id:number) => {
  try {
    const response = await productApi.getById(id);
    return response;
  } catch (error:any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message); 
    }
    throw new Error('Что-то пошло не так'); 
  }
});

export const addToBasket = createAsyncThunk('basket/addProduct', async (dto: basketDto, { dispatch }) => {
  try {
    const token = Cookies.get('userToken'); 
      if (!token) throw new Error('Пользователь не авторизован');

      const decoded = jwtDecode<JwtPayload>(token);
      const userId = decoded.id;

      const payload = { ...dto, userId };
      const response = await basketApi.add(payload);
      dispatch(getBasket())
    return response
  } catch (error:any) {

    if (error.response && error.response.data) {
      throw new Error(error.response.data.message); 
    }
    throw new Error('Что-то пошло не так'); 
  }
});

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        // logout(state) {
        //     state.token = null;
        //     Cookies.remove('authToken'); 
        // },
    },
    extraReducers: (builder) => {
        builder.addCase(getProductById.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getProductById.fulfilled, (state, action) => {
          state.loading = false;
          state.error = null;
          state.productInfo = action.payload
        })
        .addCase(getProductById.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message|| 'Что-то пошло не так';
        })
        .addCase(addToBasket.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(addToBasket.fulfilled, (state, action) => {
          state.loading = false;
          state.error = null;
          
          state.isAddToBasket = true
        })
        .addCase(addToBasket.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message|| 'Что-то пошло не так';
        })
    },
});

export const isAddToBasket = (state: ProductState) => state.isAddToBasket;
//export const { logout } = authSlice.actions;
export default productSlice.reducer;