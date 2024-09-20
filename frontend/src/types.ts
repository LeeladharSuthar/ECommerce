export type OrderItemType = {
    name: string;
    photo: string;
    price: number;
    quantity: number;
    _id: string;
}

export type OrderType = {
    name: string;
    address: string;
    city: string;
    country: string;
    state: string;
    pinCode: string;
    status: "Processing" | "Shipped" | "Delivered";
    subTotal: number;
    discount: number;
    shippingCharges: number;
    tax: number;
    total: number;
    orderedItems: OrderItemType[];
    _id: string;
}