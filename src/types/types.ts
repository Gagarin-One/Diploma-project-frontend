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