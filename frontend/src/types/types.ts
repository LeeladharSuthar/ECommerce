export interface User {
    dob: string | null,
    email: string,
    gender: string | null,
    name: string,
    photo: string,
    role: string,
    _id: string
}

export interface Product {
    name: string;
    category: string;
    photo: string;
    _id?: string;
    stock: number;
    price: number;
}

export type ShippingInfo = {
    address: string;
    city: string;
    state: string;
    country: string;
    pinCode: string;
}

export type CartItemType = {
    productId: string;
    name: string;
    photo: string;
    quantity: number;
    price: number;
    stock: number;
}



export type NewOrderResponse = {
    orderItems: Omit<CartItemType, "stock">[],
    ShippingInfo: ShippingInfo,
    discount: number,
    shippingCharges: number,
    subTotal: number,
    tax: number,
    total: number,
    user: string
}