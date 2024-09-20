import { ReactElement, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaPlus } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Column } from 'react-table';
import AdminSideBar from '../../components/adminDashboard/AdminSideBar';
import TableHOC from '../../components/adminDashboard/TableHOC';
import { useAllProductsQuery } from '../../redux/api/productApi';
import { ApiErrorType } from '../../types/api-types';
import { UserReducerInitialState } from '../../types/reducer-types';

interface DataType {
    photo: ReactElement,
    name: string,
    price: number,
    stock: number,
    action: ReactElement;
}

const columns: Column<DataType>[] = [
    {
        Header: "Photo",
        accessor: "photo"
    }, {
        Header: "Name",
        accessor: "name"
    }, {
        Header: "Price",
        accessor: "price"
    }, {
        Header: "Stock",
        accessor: "stock"
    }, {
        Header: "Action",
        accessor: "action"
    }
]

const Products = () => {
    const user = useSelector((state: { userReducer: UserReducerInitialState }) => state.userReducer.user)

    const [list, setList] = useState<DataType[]>([])

    const { data,  isError, error } = useAllProductsQuery(user!._id)

    useEffect(() => {
        if (data?.data.products) {
            setList(data.data.products.map((p) => ({
                photo: <img src={p.photo} />,
                name: p.name,
                price: p.price,
                stock: p.stock,
                action: <Link to={`${p._id}`}>Manage</Link>
            })));
        }
    }, [data]);

    useEffect(() => {
        if (isError) {
            toast.error((error as ApiErrorType).data.message);
        }
    }, [isError]);

    const Table = TableHOC<DataType>(columns, list, "dashboardProductBox", "Products", true);
    return (
        <div className="adminContainer">
            <AdminSideBar />
            <main>
                {Table}
            </main>

            <Link to="/admin/product/new" className='createProductBtn'>
                <FaPlus />
            </Link>
        </div>
    )
}

export default Products