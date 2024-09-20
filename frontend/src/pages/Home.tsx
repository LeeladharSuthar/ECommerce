import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { Skeleton } from "../components/Loader"
import ProductCard from "../components/ProductCard"
import { useLatestProductsQuery } from "../redux/api/productApi"
import { addToCart, calculateprice } from "../redux/reducer/cartReducer"
import { CartItemType } from "../types/types"

const Home = () => {

  const dispatch = useDispatch()

  let { isError, isLoading, data } = useLatestProductsQuery("")
  
  if (isError) toast.error("Something went wrong while fetching products")

  const addTocartHandler = (cartItem: CartItemType) => {
    if (cartItem.stock < 1) return toast.error("Out of stock")
    dispatch(addToCart(cartItem))
    dispatch(calculateprice(""))
    toast.success("Added to cart")
  }


  return <>
    <div className="home">
      <section></section>
      <h1>
        Latest Products
        <Link to={"/search"} className="findMore">More</Link>
      </h1>
      {
        isLoading ? (<Skeleton />) : (<main>
          {
            data && data.data.products?.map((p) => {
              return <ProductCard _id={p._id} handler={addTocartHandler} image={`${p.photo}`} name={p.name} price={p.price} stock={p.stock} key={p._id} />
            })
          }
        </main>)
      }

    </div>
  </>

}

export default Home