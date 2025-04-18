import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { basketApi} from '../../api';
import { BasketItem, JwtPayload } from '../../types/types';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';


type basketState = {
  basketInfo : Array<BasketItem>;
  loading: boolean;
  error: null | string;
}

type UpdatePayload = {
  productId: number;
  quantity: number;
};

const initialState: basketState = {
  basketInfo:[],
    loading: false,
    error: null
};

export const getBasket = createAsyncThunk('basket', async () => {
  try {
    const token = Cookies.get('authToken'); 
      if (!token) throw new Error('Пользователь не авторизован');

      const decoded = jwtDecode<JwtPayload>(token);
      const userId = decoded.id;
      const response = await basketApi.getOne(userId);
    return response;
  } catch (error:any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message); 
    }
    throw new Error('Что-то пошло не так'); 
  }
});


export const updateBasketQuantity = createAsyncThunk(
  'basket/updateQuantity',
  async ({ productId, quantity }: UpdatePayload, { rejectWithValue }) => {
    try {
      const token = Cookies.get('authToken');
      if (!token) throw new Error('Пользователь не авторизован');

      const decoded = jwtDecode<{ id: number }>(token);
      const userId = decoded.id;

      const updatedItem = await basketApi.updateQuantity({
        userId,
        productId,
        quantity,
      });

      return updatedItem;

    } catch (error: any) {
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message || 'Что-то пошло не так');
    }
  }
);
// export const addToBasket = createAsyncThunk('basket/addProduct', async (dto: basketDto) => {
//   try {
//     const token = Cookies.get('authToken'); 
//       if (!token) throw new Error('Пользователь не авторизован');

//       const decoded = jwtDecode<JwtPayload>(token);
//       const userId = decoded.id;

//       const payload = { ...dto, userId };
//       const response = await basketApi.add(payload);
//     return response
//   } catch (error:any) {

//     if (error.response && error.response.data) {
//       throw new Error(error.response.data.message); 
//     }
//     throw new Error('Что-то пошло не так'); 
//   }
// });

const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {
        // logout(state) {
        //     state.token = null;
        //     Cookies.remove('authToken'); 
        // },
    },
    extraReducers: (builder) => {
        builder.addCase(getBasket.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getBasket.fulfilled, (state, action) => {
          state.loading = false;
          state.error = null;
          state.basketInfo = action.payload
        })
        .addCase(getBasket.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message|| 'Что-то пошло не так';
        })
        .addCase(updateBasketQuantity.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(updateBasketQuantity.fulfilled, (state, action) => {
  state.loading = false;
  state.error = null;

  const { productId, quantity } = action.payload;

  const itemIndex = state.basketInfo.findIndex(
    (item) => item.productId === productId
  );

  if (itemIndex !== -1) {
    state.basketInfo[itemIndex].quantity = quantity;
  }
})
        .addCase(updateBasketQuantity.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message|| 'Что-то пошло не так';
        })
    },
});


//export const { logout } = authSlice.actions;
export default basketSlice.reducer;