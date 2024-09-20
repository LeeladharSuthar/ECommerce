import { NextFunction, Request, Response } from "express";

export interface newUserRequestBody {
    name: string;
    email: string;
    photo: string;
    gender: string;
    role: string;
    dob: Date;
    _id: string;
}

export type Controller = (
    req: Request<any>,
    res: Response,
    next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>

export interface searchRequestBody {
    search?: string;
    sort?: string;
    price?: string;
    category?: string;
    page?: string;
}

export interface Query {
    name?: {
        $regex: string;
        $options: string;
    };
    price?: {
        $lte: number;
    };
    category?: string;
}


export interface NewProductReqBody {
    name: string;
    category: string;
    stock: number;
    price: number;
}
import { Document } from 'mongoose';

export interface ProductDocument extends Document {
    name: string;
    category: string;
    price: number;
    photo: string;
    stock: number;
}


export type OrderItemType = {
    name: string,
    photo: string,
    price: number,
    quantity: number,
    productId: string
}

type ShippingInfoType = {
    address: string,
    city: string,
    state: string,
    country: string,
    pinCode: number
}

export interface NewOrderRequestBody {
    ShippingInfo: ShippingInfoType;
    user: string;
    tax: number;
    discount: number;
    total: number;
    shippingCharges: number;
    subTotal: number;
    orderItems: OrderItemType[]
}