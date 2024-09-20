import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { CartReducerInitialState } from "../../types/reducer-types"
import { CartItemType, ShippingInfo } from "../../types/types"

const initialState: CartReducerInitialState = {
    loading: false,
    cartItems: [],
    subTotal: 0,
    tax: 0,
    total: 0,
    discount: 0,
    shippingCharges: 0,
    shippingInfo: {
        address: "",
        city: "",
        country: "",
        pinCode: "",
        state: ""
    }
}

export const cartReducer = createSlice({
    name: "cartReducer",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItemType>) => {
            state.loading = true
            let idx = state.cartItems.findIndex(i => i.productId === action.payload.productId)
            if (idx !== -1) {
                state.cartItems[idx] = action.payload
            } else {
                state.cartItems.push(action.payload)
            }
            state.loading = false
        },
        removeCartItem: (state, action: PayloadAction<string>) => {
            state.loading = true
            state.cartItems = state.cartItems.filter((i) => i.productId !== action.payload)
            state.loading = false
        },
        increaseQuantity: (state, action: PayloadAction<string>) => {
            state.loading = true
            let idx = state.cartItems.findIndex(i => i.productId === action.payload)
            if (state.cartItems[idx].stock >= state.cartItems[idx].quantity + 1) {
                state.cartItems[idx].quantity++
            }
            state.loading = false
        },
        decreaseQuantity: (state, action: PayloadAction<string>) => {
            state.loading = true
            let idx = state.cartItems.findIndex(i => i.productId === action.payload)
            if (idx !== -1 && state.cartItems[idx].quantity != 1) {
                state.cartItems[idx].quantity--
            } else if (state.cartItems[idx].quantity == 1)
                state.cartItems = state.cartItems.filter((i) => {
                    return i.productId !== action.payload
                })
            state.loading = false
        },
        calculateprice: (state, action) => {
            state.loading = true
            state.subTotal = state.cartItems.reduce((accumulator, item) => {
                let sum = item.quantity * item.price
                return accumulator + sum
            }, 0)

            state.shippingCharges = state.subTotal > 1000 ? 200 : 0

            state.tax = (state.subTotal) * 18 / 100

            state.total = state.subTotal + state.shippingCharges + state.tax - state.discount

            state.loading = false
        },
        setDiscount: (state, action: PayloadAction<number>) => {
            state.discount = action.payload
        },
        saveShippingInfo: (state, action: PayloadAction<ShippingInfo>) => {
            state.shippingInfo = action.payload
        },
        resetCart: (state, action) => initialState
    }
})

export const { addToCart, removeCartItem, increaseQuantity, decreaseQuantity, calculateprice, setDiscount, saveShippingInfo, resetCart } = cartReducer.actions
