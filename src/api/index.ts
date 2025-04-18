import axios from 'axios';
import { CreateUserDto, loginDto, ResponceUser, ResponceProduct, basketDto, BasketResponce, BasketItem } from '../types/types';


const instance = axios.create({
  baseURL: 'http://localhost:5001/api/',
});

export const userApi = {
  async register(dto: CreateUserDto): Promise<ResponceUser> {
    const { data } = await instance.post<CreateUserDto, { data: ResponceUser }>(
      'user/registration',
      dto,
    );
    return data;
  },

  async login(dto: loginDto): Promise<ResponceUser> {
    const { data } = await instance.post<loginDto, { data: ResponceUser }>('user/login', dto);
    return data;
  },
  async getMe(token:string) {
    const {data} = await instance.get<ResponceUser>('user/auth', {
      headers: { 'Authorization': 'Bearer ' + token}
    })
    return data;
  }
};
export const productApi = {
  async getById(id:number): Promise<ResponceProduct> {
    const { data } = await instance.get<ResponceProduct>(`product/${id}`);
    return data;
  },
  

};

export const basketApi = {
  async add(dto:basketDto): Promise<BasketResponce> {
    const { data } = await instance.post<basketDto, { data: BasketResponce }>('basket/addProduct', dto);
    return data;
  },
  async getOne(userId:number): Promise<Array<BasketItem>> {
    const { data } = await instance.get<Array<BasketItem>>(`basket/${userId}`);
    return data;
  },
  async updateQuantity(payload: { userId: number; productId: number; quantity: number }): Promise<BasketItem> {
    const { data } = await instance.put<typeof payload, { data: BasketItem }>('basket/quantity', payload);
    return data;
  },
};

export const orderApi = {
  async create(userId: number): Promise<{ orders: any[] }> {
    const { data } = await instance.post<{ userId: number }, { data: { orders: any[] } }>(
      'order/create',
      { userId }
    );
    return data;
  },

  // async findForUser(userId: number): Promise<any[]> {
  //   const { data } = await instance.get<any[]>(`order/user/${userId}`);
  //   return data;
  // },

  // async findForSeller(sellerId: number): Promise<any[]> {
  //   const { data } = await instance.get<any[]>(`order/seller/${sellerId}`);
  //   return data;
  // },

  // async changeStatus(payload: { status: 'pending' | 'ready_for_pickup'; orderId: number }): Promise<string> {
  //   const { data } = await instance.put<typeof payload, { data: string }>('order/status', payload);
  //   return data;
  // },
}