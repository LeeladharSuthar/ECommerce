import { ReactElement, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Column } from 'react-table'
import AdminSideBar from '../../components/adminDashboard/AdminSideBar'
import TableHOC from '../../components/adminDashboard/TableHOC'
import { useAllOrdersQuery } from '../../redux/api/orderApi'
import { ApiErrorType } from '../../types/api-types'
import { UserReducerInitialState } from '../../types/reducer-types'

interface DataType {
  user: string,
  amount: number,
  discount: number,
  quantity: number,
  status: ReactElement,
  action: ReactElement
}

const columns: Column<DataType>[] = [
  {
    Header: "User",
    accessor: "user"
  },
  {
    Header: "Amount",
    accessor: "amount"
  },
  {
    Header: "Discount",
    accessor: "discount"
  },
  {
    Header: "Quantity",
    accessor: "quantity"
  },
  {
    Header: "Status",
    accessor: "status"
  },
  {
    Header: "Action",
    accessor: "action"
  },
]

const Transaction = () => {
  const user = useSelector((state: { userReducer: UserReducerInitialState }) => state.userReducer.user)
  const [tableData, setTableData] = useState<DataType[]>([]);

  const { data,  isError, error } = useAllOrdersQuery(user!._id)

  useEffect(() => {
    if (data?.data.orders) {
      setTableData(data?.data.orders!.map((order) => ({
        user: order.userInfo[0].name,
        amount: order.total,
        discount: order.discount,
        quantity: order.orderItems.length,
        status: <span className={order.status == "Processing" ? 'red' : order.status == "Shipped" ? 'green' : 'purple'}>{order.status}</span>,
        action: <Link to={`/admin/transaction/${order._id}`}>Manage</Link>
      })))
    }
  }, [data])

  useEffect(() => {
    if (isError) {
      toast.error((error as ApiErrorType).data.message);
    }
  }, [isError]);

  const Table = TableHOC<DataType>(columns, tableData, "dashboard", "customers", true)

  return (
    <div className="adminContainer">
      <AdminSideBar />
      <main>{Table}</main>
    </div>
  )
}

export default Transaction