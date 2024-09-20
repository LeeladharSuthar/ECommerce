import { ReactElement, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { Column } from 'react-table';
import TableHOC from '../components/adminDashboard/TableHOC';
import { Skeleton } from '../components/Loader';
import { useMyOrdersQuery } from '../redux/api/orderApi';
import { ApiErrorType } from '../types/api-types';
import { UserReducerInitialState } from '../types/reducer-types';
import { Link } from 'react-router-dom';

interface DataType {
    _id: string;
    amount: number;
    quantity: number;
    discount: number;
    status: string;
    action: ReactElement
}

const columns: Column<DataType>[] = [
    {
        Header: "ID",
        accessor: "_id"
    },
    {
        Header: "Amount",
        accessor: "amount"
    },
    {
        Header: "Quantity",
        accessor: "quantity"
    },
    {
        Header: "Discount",
        accessor: "discount"
    },
    {
        Header: "Status",
        accessor: "status"
    },
    {
        Header: "Action",
        accessor: "action"
    }
]

const Order = () => {
    const user = useSelector((state: { userReducer: UserReducerInitialState }) => state.userReducer.user)
    const { data, isLoading, isError, error } = useMyOrdersQuery(user?._id || '')
    const [list, setList] = useState<DataType[]>([])

    useEffect(() => {
        if (data?.data.myOrders) {
            setList(data?.data.myOrders.map((order) => ({
                _id: order._id,
                amount: order.total,
                discount: order.discount,
                quantity: order.orderItems.length,
                status: order.status,
                action: (<Link to={`/orderDetails/${order._id}`}>Details</Link>)
            })))
        }
    }, [data])

    useEffect(() => {
        if (isError) {
            toast.error((error as ApiErrorType).data.message);
        }
    }, [isError]);

    const Table = TableHOC<DataType>(columns, list, "dashboardProductBox", "Orders", list.length > 6)
    return (
        <div className='container'>
            <h1>My Orders</h1>
            {
                isLoading ? <Skeleton /> : Table
            }
        </div>
    )
}

export default Order