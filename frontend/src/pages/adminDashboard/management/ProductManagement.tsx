import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import AdminSideBar from '../../../components/adminDashboard/AdminSideBar'
import { useDeleteProductMutation, useProductDetailsQuery, useUpdateProductMutation } from '../../../redux/api/productApi'
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { UserReducerInitialState } from '../../../types/reducer-types';
import { Product } from '../../../types/types';
import { Skeleton } from '../../../components/Loader';
import toast from 'react-hot-toast';
import { responseToast } from '../../../features/RTKHandler';
import { FaTrash } from 'react-icons/fa';

const ProductManagement = () => {
  const params = useParams()
  const [update] = useUpdateProductMutation()
  const [deleteProduct] = useDeleteProductMutation()
  const navigate = useNavigate()

  const user = useSelector((state: { userReducer: UserReducerInitialState }) => state.userReducer.user);

  const { data, isLoading } = useProductDetailsQuery(params.id!)

  const [product, setProduct] = useState<Product>({
    category: "",
    name: "",
    photo: "",
    price: 0,
    stock: 0,
    _id: ""
  })

  // Fetched from DB
  const { category, name, photo, price, stock, _id } = product

  // Updated data
  const [nameUpdate, setNameUpdate] = useState<string>("")
  const [priceUpdate, setPriceUpdate] = useState<number>(0)
  const [stockUpdate, setStockUpdate] = useState<number>(0)
  const [photoUpdate, setPhotoUpdate] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoUpdate(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhotoPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!nameUpdate && !priceUpdate && !stockUpdate && !photoUpdate) {
      toast.error('Please update atleat one field');
      return;
    }

    const formData = new FormData();
    if (nameUpdate != name) formData.append('name', nameUpdate);
    if (priceUpdate != price) formData.append('price', priceUpdate.toString());
    if (stockUpdate != stock) formData.append('stock', stockUpdate.toString());
    if (photoUpdate) formData.append('photo', photoUpdate);

    // console.log(photoPreview) to use in src of image
    // console.log(photoUpdate) to send to backend

    const response = await update({ formData, pid: params.id || "", uid: user?._id || "" });
    let { error } = response
    console.log(error)
    responseToast(response, navigate, '/admin/product');
  }

  const deleteHandler = async () => {
    const response = await deleteProduct({ id: params.id || "", uid: user?._id || "" });
    responseToast(response, navigate, '/admin/product');
  }

  useEffect(() => {
    if (data) {
      setProduct(data.data.product!)
      setNameUpdate(data.data.product!.name || "")
      setPriceUpdate(data.data.product!.price || 0)
      setStockUpdate(data.data.product!.stock || 0)
    }
  }, [data])

  return (
    <div className="adminContainer">
      <AdminSideBar />
      <main className="productManagement">
        {
          isLoading ? <Skeleton /> : <>
            <section>
              <strong>ID- {_id}</strong>
              <img src={photo} alt="Product" />
              <p>{name}</p>
              {
                stock > 0 ? <span className='green'>{stock} Available</span> : <span className='red'>Not Available</span>
              }
              <h3>${price}</h3>
            </section>
            <article>
              <button onClick={deleteHandler}>
                <FaTrash />
              </button>
              <form onSubmit={submitHandler}>
                <h2>Manage</h2>
                <div>
                  <label htmlFor="Name">Name</label>
                  <input type="text" name="Name" id="Name" placeholder='Name' onChange={(e) => setNameUpdate(e.target.value)} value={nameUpdate} required />
                </div>
                <div>
                  <label htmlFor="Price">Price</label>
                  <input type="number" name="Price" id="Price" placeholder='Price' onChange={(e) => setPriceUpdate(Number(e.target.value))} value={priceUpdate} required />
                </div>
                <div>
                  <label htmlFor="Stock">Stock</label>
                  <input type="number" name="Stock" id="Stock" placeholder='Stock' onChange={(e) => setStockUpdate(Number(e.target.value))} value={stockUpdate} required />
                </div>
                <div>
                  <label htmlFor="Photo">Photo</label>
                  <input type="file" name="Photo" id="Photo" onChange={changeImageHandler} />
                </div>
                {photoPreview && (
                  <img src={photoPreview} alt="Selected Preview" style={{ width: '200px', height: 'auto' }} />
                )}
                <button type='submit'>Update</button>
              </form>
            </article>
          </>
        }
      </main>
    </div>
  )
}


export default ProductManagement