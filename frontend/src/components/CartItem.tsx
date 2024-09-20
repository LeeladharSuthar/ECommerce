import { FaTrash } from "react-icons/fa"
import { Link } from "react-router-dom"
import { CartItemType } from "../types/types"
import { useDispatch } from "react-redux"
import { calculateprice, decreaseQuantity, increaseQuantity, removeCartItem } from "../redux/reducer/cartReducer"



interface CartItemProps {
    cartItem: CartItemType
}
const CartItem = ({ cartItem }: CartItemProps) => {
    const { photo, productId, name, price, quantity } = cartItem
    const dispatch = useDispatch()
    let removeCartItemhandler = (id: string) => {
        dispatch(removeCartItem(id))
        dispatch(calculateprice(""))

    }
    let increaseQuantityHandler = (id: string) => {
        dispatch(increaseQuantity(id))
        dispatch(calculateprice(""))

    }
    let decreaseQuantityHandler = (id: string) => {
        dispatch(decreaseQuantity(id))
        dispatch(calculateprice(""))

    }
    return (
        <div className="cartItem">
            <img src={photo} alt="" />
            <article>
                <Link to={`/product/${productId}`}>{name}</Link>
                <span>{price}</span>
            </article>
            <div>
                <button onClick={() => decreaseQuantityHandler(productId)}>-</button>
                <p>{quantity}</p>
                <button onClick={() => increaseQuantityHandler(productId)}>+</button>
            </div>
            <button onClick={() => removeCartItemhandler(productId)}><FaTrash /></button>
        </div>
    )
}

export default CartItem