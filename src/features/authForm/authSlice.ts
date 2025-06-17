import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { farmerApi, userApi } from '../../api';
import { CreateUserDto, loginDto } from '../../types/types';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  token: string | null;
  error: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  isFarmer: boolean;
  userName: string;
}

const initialState: AuthState = {
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  isFarmer: false,
  userName: '',
};

const getApi = (isFarmer?: boolean) => (isFarmer ? farmerApi : userApi);

// ========== THUNKS ==========

export const login = createAsyncThunk(
  'auth/login',
  async (dto: loginDto) => {
    const api = getApi(dto.isFarmer);
    const response = await api.login(dto);
    return { token: response.token, isFarmer: dto.isFarmer };
  }
);

export const register = createAsyncThunk(
  'auth/Register',
  async (dto: CreateUserDto) => {
    const api = getApi(dto.isFarmer);
    const response = await api.register(dto);
    return { token: response.token, isFarmer: dto.isFarmer };
  }
);

export const checkUser = createAsyncThunk(
  'auth/checkUser',
  async () => {
    const token = Cookies.get('userToken');
    if (!token) throw new Error('Вы не зашли как пользователь');
    const response = await userApi.getMe(token);
    return { token: response.token, isFarmer: false };
  }
);

export const checkFarmer = createAsyncThunk(
  'auth/checkFarmer',
  async () => {
    const token = Cookies.get('farmerToken');
    if (!token) throw new Error('Вы не зашли как фермер');
    const response = await farmerApi.getMe(token);
    return { token: response.token, isFarmer: true };
  }
);

// ========== SLICE ==========

const authSlice = createSlice({  
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.isAuthenticated = false;
      state.isFarmer = false;
      state.userName = '';
      Cookies.remove('userToken');
      Cookies.remove('farmerToken');
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(login.fulfilled, (state, action) => {
        const { token, isFarmer } = action.payload;
        state.token = token;
        state.isAuthenticated = true;
        state.isFarmer = isFarmer;

        // Вытаскиваем имя из токена
        const parsed = jwtDecode<any>(token);
        state.userName = parsed.username;

        Cookies.set(isFarmer ? 'farmerToken' : 'userToken', token, { expires: 7 });
      })
      // REGISTER
      .addCase(register.fulfilled, (state, action) => {
        const { token, isFarmer } = action.payload;
        state.token = token;
        state.isAuthenticated = true;
        state.isFarmer = isFarmer;

        // Вытаскиваем имя из токена
        const parsed = jwtDecode<any>(token);
        state.userName = parsed.username;

        Cookies.set(isFarmer ? 'farmerToken' : 'userToken', token, { expires: 7 });
      })
      // CHECK USER
      .addCase(checkUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.isFarmer = false;

        // Вытаскиваем имя из токена
        const parsed = jwtDecode<any>(action.payload.token);
        state.userName = parsed.username;

        state.token = action.payload.token;
      })
      .addCase(checkUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка проверки пользователя';
      })
      // CHECK FARMER
      .addCase(checkFarmer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkFarmer.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.isFarmer = true;

        // Вытаскиваем имя из токена
        const parsed = jwtDecode<any>(action.payload.token);
        state.userName = parsed.username;

        state.token = action.payload.token;
      })
      .addCase(checkFarmer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка проверки фермера';
      });
  },
});

// Action creators
export const { logout, setUserName } = authSlice.actions;

// Reducer
export default authSlice.reducer;
