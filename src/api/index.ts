import axios, { AxiosResponse } from 'axios';
import { CreateUserDto, loginDto, ResponceUser, ResponceProduct, basketDto, BasketResponce, BasketItem } from '../types/types';
import { Order } from '../pages/farmer/farmerSlise';
import { Product } from '../pages/home/homeSlice';


const instance = axios.create({
  baseURL: 'http://localhost:5001/api/',
});

export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  sellerId?: number; // sellerId не обновляем, но он может быть в ответе
  img_url: string;
  createdAt?: string;
  updatedAt?: string;
}
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

export const farmerApi = {
  async register(dto: CreateUserDto): Promise<ResponceUser> {
    const { data } = await instance.post<CreateUserDto, { data: ResponceUser }>(
      'seller/registration',
      dto,
    );
    return data;
  },
  createProduct: async (formData: FormData) => {
    const { data } = await instance.post<FormData, { data: Product }>(
      'product/create',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return data;
  },
  async login(dto: loginDto): Promise<ResponceUser> {
    const { data } = await instance.post<loginDto, { data: ResponceUser }>('seller/login', dto);
    return data;
  },
  async getMe(token:string) {
    const {data} = await instance.get<ResponceUser>('seller/auth', {
      headers: { 'Authorization': 'Bearer ' + token}
    })
    return data;
  },
  async getOrders(userId: number): Promise<{ orders: Order[] }> {
    const { data } = await instance.get<{ orders: Order[] }>(`order/seller/findAll/${userId}`);
    return data;
  },
  async getProductsByFarmer({
    page = 1,
    limit = 9,
    sellerId,
    categoryId,
    searchString,
  }: {
    page?: number;
    limit?: number;
    sellerId?: number;  
    categoryId?: number;
    searchString?: string;
  }) {
    const params: {
      page: number;
      limit: number;
      sellerId?: number;
      categoryId?: number;
      searchString?: string;
    } = { page, limit, sellerId };

    if (categoryId) params.categoryId = categoryId;
    if (searchString) params.searchString = searchString;

    const { data } = await instance.get<{ count: number; rows: Product[] }>('product', {
      params,
    });

    return data;
  },
  updateProduct: async (
    id: number,
    formData: FormData
  ): Promise<ProductResponse> => {

    const response: AxiosResponse<ProductResponse> = await instance.put(
      `/product/${id}`,
      formData
    );

    return response.data;
  },
  async getNotifications(farmerId:number) {
    const { data } = await instance.get(`order/notifications/${farmerId}`);
    return data;
  },
  async clearNotifications(farmerId:number) {
    await instance.delete(`order/notifications/${farmerId}`);
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
  async create({
    userId,
    address,
    delivery_date,
  }: {
    userId: number;
    address: string;
    delivery_date: string;
  }): Promise<{ orders: any[] }> {
    const { data } = await instance.post<{ orders: any[] }>('order/create', {
      userId,
      address,
      delivery_date,
    });
    return data;
  },
  
  async changeStatus(orderId: number, status: string) {
    const { data } = await instance.put('/order/changeStatus', {
      orderId,
      status,
    });
    return data;
  },
  async getUserOrders(userId: number) {
    const { data } = await instance.get(`/order/user/findAll/${userId}`);
    return data;
  },


}

export const reviewApi = {
  async create(payload:any) {
    // payload = {userId, sellerId, review, rating}
    const { data } = await instance.post('/review/create', payload);
    return data;
  },
  
  async getAll(sellerId:number) {
    const { data } = await instance.get('/review/' + sellerId);
    return data;
  },
}