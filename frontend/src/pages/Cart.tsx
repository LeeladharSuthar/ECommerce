import { useEffect, useState } from "react";
import CartItem from "../components/CartItem";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CartReducerInitialState } from "../types/reducer-types";
import { Skeleton } from "../components/Loader";
import axios, { AxiosError } from "axios";
import { ApiResponseType } from "../types/api-types";
import { calculateprice, setDiscount } from "../redux/reducer/cartReducer";
// const subtotal = 4000;
// const tax = 40;
// const shippingCharges = 20;
// const discount = 400;
// const total = subtotal + shippingCharges + tax;

const Cart = () => {

  const dispatch = useDispatch()

  let { cartItems, discount, loading, shippingCharges, subTotal, tax, total } = useSelector((state: { cartReducer: CartReducerInitialState }) => {
    return state.cartReducer
  })


  const [couponCode, setCouponCode] = useState<string>("")
  const [isValid, setIsValid] = useState<boolean>(false)


  useEffect(() => {
    const { cancel, token } = axios.CancelToken.source()

    if (!couponCode) {
      dispatch(setDiscount(0))
    }

    const id = setTimeout(async () => {
      try {
        let { data }: { data: ApiResponseType } = await axios.get(`${import.meta.env.VITE_SERVER}/api/v1/payment/discount?coupon=${couponCode}`, { cancelToken: token })
        dispatch(setDiscount(data.data.couponDoc?.amount || 0))
        setIsValid(true)
        dispatch(calculateprice(""))
      } catch (error) {
        setIsValid(false)
        dispatch(setDiscount(0))
        dispatch(calculateprice(""))
      }
    }, 1000);

    return () => {
      clearTimeout(id)
      cancel()
      setIsValid(false)
    }
  }, [couponCode])

  return (
    <div className="cart">
      {
        loading ? <Skeleton /> : <>
          <main>
            {cartItems && cartItems.length > 0 ?
              (
                cartItems.map((item, idx) => <CartItem key={idx} cartItem={item} />)
              ) : (
                <h1>No Items Added</h1>
              )
            }
          </main>
          <aside>
            <p>Subtotal: {subTotal.toFixed(2)}</p>
            <p>Shipping Charges: {shippingCharges.toFixed(2)}</p>
            <p>Tax: {tax.toFixed(2)}</p>
            <p>Discount: <em>-{discount.toFixed(2)}</em></p>
            <p><b>Total: ${total.toFixed(2)}</b></p>

            <input
              type="text"
              placeholder="Coupon Code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              disabled={cartItems.length === 0}
            />
            {
              couponCode && (isValid ? (
                <span className="green">${discount} off using the <code>{couponCode}</code></span>
              ) : (
                <span className="red">Invalid Code</span>
              ))
            }
            {
              cartItems && cartItems.length > 0 && <Link to={"/shipping"}>Check out</Link>
            }
          </aside>
        </>
      }
    </div>
  )
}

export default Cart