import { useState } from "react"
import toast from "react-hot-toast"
import { Skeleton } from "../components/Loader"
import ProductCard from "../components/ProductCard"
import { useCategoriesQuery, useSearchProductsQuery } from "../redux/api/productApi"
import { ApiErrorType } from "../types/api-types"
import { CartItemType } from "../types/types"
import { addToCart, calculateprice } from "../redux/reducer/cartReducer"
import { useDispatch } from "react-redux"

const Search = () => {
  const dispatch = useDispatch()

  const { data: catData, isLoading: catIsLoading, isError: catIsError, error: catError } = useCategoriesQuery("")

  const [search, setSearch] = useState<string>("")
  const [sort, setSort] = useState<string>("")
  const [maxPrice, setMaxPrice] = useState<number>(100000)
  const [category, setCategory] = useState<string>("")
  const [page, setPage] = useState<number>(1)

  const { data, isLoading, isError, error, isSuccess } = useSearchProductsQuery({ category, page, sort, search, price: maxPrice })

  if (catIsError) {
    toast.error((catError as ApiErrorType).data.message)
  }
  if (isError) {
    toast.error((error as ApiErrorType).data.message)
  }

  const addTocartHandler = (cartItem: CartItemType) => {
    if (cartItem.stock < 1) return toast.error("Out of stock")
    dispatch(addToCart(cartItem))
    dispatch(calculateprice(""))
    toast.success("Added to cart")
  }

  return (
    <div className="productSearch">
      <aside>
        <h2>Filters</h2>
        <div>
          <h4>Sort</h4>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">Default</option>
            <option value="asc">Price low to high</option>
            <option value="dsc">Price high to low</option>
          </select>
        </div>
        <div>
          <h4>Max Price: {maxPrice}</h4>
          <input type="range" name="maxPrice" min={1} max={1000} value={maxPrice} onChange={(e) => setMaxPrice(parseInt(e.target.value))} />
        </div>
        <div>
          <h4>Category</h4>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All</option>
            {
              catData?.data.categories!.map((cat) => <option key={cat} value={cat}>{cat}</option>)
            }
          </select>
        </div>
      </aside>
      <main>
        <h1>Products</h1>
        <input type="text" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
        {
          isLoading ? <Skeleton /> : <div className="searchProductList">
            {
              data?.data.products!.map((p) => (
                <ProductCard _id={p._id} key={p._id} handler={() => addTocartHandler({ name: p.name, photo: p.photo, price: p.price, productId: p._id, stock: p.stock, quantity: 1 })} image={p.photo} name={p.name} price={p.price} stock={p.stock} />
              ))
            }
          </div>
        }
        {
          data?.data.length && data?.data.length > 1 && <article>
            <button onClick={() => setPage((prev) => prev - 1)} disabled={!(page > 1)}>Previous</button>
            <span>{page} of {data?.data.length}</span>
            <button onClick={() => setPage((prev) => prev + 1)} disabled={!(page < data.data.length)}>Next</button>
          </article>
        }
      </main>
    </div>
  )
}

export default Search