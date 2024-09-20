import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useNewOrderMutation } from '../redux/api/orderApi';
import { NewOrderResponse } from '../types/types';
import { useDispatch, useSelector } from 'react-redux';
import { CartReducerInitialState, UserReducerInitialState } from '../types/reducer-types';
import { resetCart } from '../redux/reducer/cartReducer';
import { RootStore } from '../redux/store';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const CheckOutForm = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const stripe = useStripe()
    const elements = useElements()
    const [placeOrder] = useNewOrderMutation()

    const { discount, cartItems: orderItems, shippingCharges, shippingInfo: ShippingInfo, subTotal, tax, total } = useSelector((state: RootStore) => state.cartReducer)
    const user = useSelector((state: RootStore) => state.userReducer.user)
    

    const [isProcessing, setIsProcessing] = useState<boolean>(false)

    const submithandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!stripe || !elements) {
            return
        }
        setIsProcessing(true)

        const response = await stripe?.confirmPayment({ elements, confirmParams: { return_url: window.location.origin }, redirect: "if_required" })
        
        if (response?.error) {
            setIsProcessing(false)
            return toast.error(response.error.message || "Something went wrong")
        }
        if (response?.paymentIntent?.status === "succeeded") {
            // placeOrder()
            const orderData: NewOrderResponse = { discount, orderItems, shippingCharges, ShippingInfo, subTotal, tax, total, user: user?._id || '' }

            const response = await placeOrder(orderData)
            console.log(response)
            // verify response
            // if success
            dispatch(resetCart(""))
            navigate('/orders')
        }
        // setIsProcessing(false)
    }
    
    return <div className='checkOutContainer'>
        <form onSubmit={submithandler}>
            <PaymentElement />
            <button disabled={isProcessing}>{isProcessing ? 'Processing...' : 'Pay'}</button>
        </form>
    </div>
}


const CheckOut = () => {
    const location = useLocation()
    const clientSecret: string | undefined = location.state.secret 
    // console.log(clientSecret)
    if (!clientSecret) return <Navigate to={'/shipping'} />


    return <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckOutForm />
    </Elements>
}

export default CheckOut