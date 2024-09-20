import { ChangeEvent, useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CartReducerInitialState } from "../types/reducer-types";
import axios from "axios";
import { saveShippingInfo } from "../redux/reducer/cartReducer";

const countries = [
  { name: 'United States', abbreviation: 'US' },
  { name: 'Canada', abbreviation: 'CA' },
  { name: 'Mexico', abbreviation: 'MX' },
  { name: 'United Kingdom', abbreviation: 'GB' },
  { name: 'Germany', abbreviation: 'DE' },
  { name: 'France', abbreviation: 'FR' },
  { name: 'Italy', abbreviation: 'IT' },
  { name: 'Spain', abbreviation: 'ES' },
  { name: 'Australia', abbreviation: 'AU' },
  { name: 'Japan', abbreviation: 'JP' },
  { name: 'China', abbreviation: 'CN' },
  { name: 'India', abbreviation: 'IN' },
  { name: 'Brazil', abbreviation: 'BR' },
  { name: 'South Africa', abbreviation: 'ZA' },
  { name: 'Russia', abbreviation: 'RU' }
];


const Shipping = () => {


  let { cartItems, total } = useSelector((state: { cartReducer: CartReducerInitialState }) => {
    return state.cartReducer
  })



  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: ""
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeHandler = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShippingAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  useEffect(() => {
    if (cartItems.length == 0) {
      return navigate("/cart")
    }
  }, [cartItems])


  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(saveShippingInfo(shippingAddress))
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_SERVER}/api/v1/payment/create`, {
        'amount': total.toFixed(2)
      })
      // console.log(data.data.client_secret) logs slientSecret
      // if success == true
      navigate('/pay', { state: {secret: data.data.client_secret} })

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="shipping">
      <button className="backBtn" onClick={() => navigate("/cart")}><BiArrowBack /></button>
      <form onSubmit={submitHandler}>
        <h1>Shipping Address</h1>
        <input type="text" placeholder="Address" value={shippingAddress.address} name="address" required onChange={changeHandler} />
        <input type="text" placeholder="City" value={shippingAddress.city} name="city" required onChange={changeHandler} />
        <input type="text" placeholder="State" value={shippingAddress.state} name="state" required onChange={changeHandler} />
        <select name="country" value={shippingAddress.country} onChange={changeHandler} required>
          {
            countries.map((country) => <option value={country.abbreviation}>{country.name}</option>)
          }
        </select>
        <input type="number" placeholder="Pin Code" value={shippingAddress.pinCode} name="pinCode" required onChange={changeHandler} />
        <button type="submit">Pay Now</button>
      </form>

    </div>
  )
}

export default Shipping