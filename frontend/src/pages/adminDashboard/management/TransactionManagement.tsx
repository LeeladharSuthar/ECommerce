import React, { useEffect, useState } from 'react'
import { OrderItemType, OrderType } from '../../../types'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import AdminSideBar from '../../../components/adminDashboard/AdminSideBar'
import { useOrderDetailsQuery, useProcessOrderMutation } from '../../../redux/api/orderApi'
import { ApiErrorType, ApiResponseType } from '../../../types/api-types'
import { Skeleton } from '../../../components/Loader'
import { useSelector } from 'react-redux'
import { UserReducerInitialState } from '../../../types/reducer-types'
import toast from 'react-hot-toast'
import { FaTrash } from 'react-icons/fa'

const TransactionManagement = () => {

  const user = useSelector((state: { userReducer: UserReducerInitialState }) => state.userReducer.user)

  const params = useParams()
  const navigate = useNavigate()

  const [processOrder] = useProcessOrderMutation()

  const [order, setOrder] = useState<OrderType>()

  const { data, isError, isLoading, error } = useOrderDetailsQuery(params.id || "")

  useEffect(() => {
    if (data?.data.orders) {
      setOrder({
        name: data.data.orders[0].userInfo[0].name,
        address: data.data.orders[0].ShippingInfo.address,
        city: data.data.orders[0].ShippingInfo.city,
        country: data.data.orders[0].ShippingInfo.country,
        state: data.data.orders[0].ShippingInfo.state,
        pinCode: data.data.orders[0].ShippingInfo.pinCode,
        status: data.data.orders[0].status,
        subTotal: data.data.orders[0].subTotal,
        discount: data.data.orders[0].discount,
        shippingCharges: data.data.orders[0].shippingCharges,
        tax: data.data.orders[0].tax,
        total: data.data.orders[0].total,
        orderedItems: data.data.orders[0].orderItems.map((order) => ({
          name: order.name,
          photo: order.photo,
          price: order.price,
          quantity: order.quantity,
          _id: order.productId
        })
        ),
        _id: data.data.orders[0]._id
      })
    }
  }, [data])

  useEffect(() => {
    if (isError) {
      toast.error((error as ApiErrorType).data.message);
    }
  }, [isError]);

  const updateHandler = async (id: string) => {
    const response = await processOrder({ id: id, uid: user?._id || "" })
    if (response.data!.success == true) {
      navigate(`/admin/transaction/${params.id}`)
    } else {
      toast.error("Updation Failed")
    }
  }

  const deleteHandler = (id: string) => { }

  return (
    <div className="adminContainer">
      <AdminSideBar />

      {
        isLoading ? <Skeleton /> : <main className="productManagement">
          <section style={{ padding: "2rem" }}>
            <h2>Order Items</h2>
            {
              order?.orderedItems.map((item) => <ProductCard _id={item._id} name={item.name} photo={item.photo} price={item.price} quantity={item.quantity} />)
            }
          </section>
          <article className='shippingInfoCard' style={{position: 'relative'}}>
            <button onClick={() => deleteHandler(order?._id ||'')} style={{backgroundColor: 'gray', padding: '5px 10px', width: '2rem', height: '2rem', borderRadius: '50%', minWidth: '3rem', position: 'absolute', top: '-2rem', right: '0rem'}}>
              <FaTrash />
            </button>
            <h1>Order Info</h1>
            <h5>User Info</h5>
            <p>Name: {order?.name}</p>
            <p>Address: {`${order?.address} ${order?.city} ${order?.state} ${order?.country} ${order?.pinCode}`}</p>
            <h5>Amount Info</h5>
            <p>Sub-total: {order?.subTotal}</p>
            <p>Shipping Charges: {order?.shippingCharges}</p>
            <p> tax: {order?.tax}</p>
            <p>Discount: {order?.discount}</p>
            <p>Total: {order?.total}</p>
            <h5>Status Info</h5>
            <p>Status: <span className={order?.status === "Delivered" ? "purple" : order?.status === "Shipped" ? "green" : "red"}>{order?.status}</span></p>
            <button onClick={() => updateHandler(order?._id || '')}>Process Status</button>
          </article>
        </main>
      }

    </div>
  )
}

const ProductCard = ({ name, photo, price, quantity, _id }: OrderItemType) => {
  return <div className='transactionProductCard'>
    <img src={photo} alt={`image of ${name}`} />
    <Link to={`/product/${_id}`} >{name}</Link>
    <span>{`${price} x ${quantity} = ${price * quantity}`}</span>
  </div>
}

export default TransactionManagement