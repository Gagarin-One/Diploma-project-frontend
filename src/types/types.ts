export type loginDto = {
  email: string;
  password: string;
};

export type CreateUserDto = {
  username: string;
} & loginDto;

export type ResponceUser ={
  token:string
}
export type ResponceProduct ={
  id: number|null;
  productName: string|null;
  description: string|null;
  price: number|null;
  img:string|null;
  sellerName:string|null;
  category:string|null
}

export type basketDto = { 
  productId:number, 
  quantity :number,
}
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  img_url: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  sellerId: number;
  categoryId: number;
}
export type BasketResponce = {
  id: number,
    quantity: number,
    createdAt: string,
    updatedAt: string,
    basketId: number,
    productId: number
}
export type BasketItem = {
  product: Product;
}& BasketResponce;

export interface JwtPayload {
  id: number; // userId
  username: string;
  email: string;
  iat: number;
  exp: number;
}