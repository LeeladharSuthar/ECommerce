import { CartItemType, ShippingInfo, User } from "./types";

export interface UserReducerInitialState {
    user: User | null,
    loading: boolean,
}


export interface CartReducerInitialState{
    loading: boolean;
    cartItems: CartItemType[];
    subTotal: number;
    shippingCharges: number;
    tax: number;
    discount: number;
    total: number;
    shippingInfo: ShippingInfo;
}