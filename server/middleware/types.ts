import {Request, Response,} from 'express';

export interface IRegisterFields {
  group_id: string;
  first_name: string;
  last_name: string;
  age: number;
  email: string;
  password: string;
  repeat_password: string;
  date_joined: string;
}


export interface ILoginFields {
    email: string,
    password: string
}

export interface IGetUserAuthInfoRequest extends Request {
    user: string
}
