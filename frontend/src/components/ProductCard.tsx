import { FaPlus } from "react-icons/fa";
import { CartItemType } from "../types/types";

interface ProductsProps {
    image: string;
    name: string;
    _id: string;
    stock: number;
    price: number;
    handler: (cartItem: CartItemType) => string | undefined;
}


const ProductCard = ({ _id, handler, image, name, price, stock }: ProductsProps) => {
    return (
        <div className="productCard">
            <img src={image} alt={name} />
            <p>{name}</p>
            <span>{price}</span>
            <div>
                <button onClick={() => handler({ name, photo: image, price, productId: _id, stock, quantity: 1 })}><FaPlus /></button>
            </div>
        </div>
    )
}

export default ProductCard