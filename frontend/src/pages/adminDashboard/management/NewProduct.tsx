import React, { ChangeEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import AdminSideBar from '../../../components/adminDashboard/AdminSideBar';
import { useNewProductMutation } from '../../../redux/api/productApi';
import { UserReducerInitialState } from '../../../types/reducer-types';
import { responseToast } from '../../../features/RTKHandler';
import { useNavigate } from 'react-router-dom';

const NewProduct = () => {
  const user = useSelector((state: { userReducer: UserReducerInitialState }) => state.userReducer.user);

  const navigate = useNavigate()

  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null); // Added state for image preview
  const [category, setCategory] = useState<string>('');

  const [newProduct] = useNewProductMutation();

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhotoPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !category || !price || !stock || !photo) {
      toast.error('Enter all fields');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price.toString());
    formData.append('category', category);
    formData.append('stock', stock.toString());
    formData.append('photo', photo);

    // console.log(photoPreview) to use in src of image
    // console.log(photo) to send to backend

    const response = await newProduct({ id: user?._id || '', formData });
    responseToast(response, navigate, '/admin/product');
  };

  return (
    <div className="adminContainer">
      <AdminSideBar />
      <main className="productManagement">
        <article>
          <form onSubmit={submitHandler}>
            <h2>New Product</h2>
            <div>
              <label htmlFor="Name">Name</label>
              <input
                type="text"
                name="name"
                id="Name"
                placeholder='Name'
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
            </div>
            <div>
              <label htmlFor="Price">Price</label>
              <input
                type="number"
                name="price"
                id="Price"
                placeholder='Price'
                onChange={(e) => setPrice(Number(e.target.value))}
                value={price}
                required
              />
            </div>
            <div>
              <label htmlFor="Stock">Stock</label>
              <input
                type="number"
                name="stock"
                id="Stock"
                placeholder='Stock'
                onChange={(e) => setStock(Number(e.target.value))}
                value={stock}
                required
              />
            </div>
            <div>
              <label htmlFor="Category">Category</label>
              <input
                type="text"
                name="category"
                id="Category"
                placeholder='Category'
                onChange={(e) => setCategory(e.target.value)}
                value={category}
                required
              />
            </div>
            <div>
              <label htmlFor="Photo">Photo</label>
              <input
                type="file"
                name="photo"
                id="Photo"
                onChange={changeImageHandler}
                required
              />
            </div>
            {photoPreview && (
              <div>
                <p>Selected File:</p>
                <img src={photoPreview} alt="Selected Preview" style={{ width: '200px', height: 'auto' }} />
              </div>
            )}
            <button type='submit'>Create</button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;
