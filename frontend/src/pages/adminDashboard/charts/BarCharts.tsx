import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import AdminSideBar from '../../../components/adminDashboard/AdminSideBar';
import { BarChart } from '../../../components/adminDashboard/Charts';
import { useBarQuery } from '../../../redux/api/dashboardApi';
import { RootStore } from '../../../redux/store';
import { ApiErrorType, BarDataType } from '../../../types/api-types';
import { Skeleton } from '../../../components/Loader';

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const BarCharts = () => {

    const [barData, setBarData] = useState<BarDataType>()
    const user = useSelector((state: RootStore) => state.userReducer.user)
    const { data, isLoading, isError, error } = useBarQuery(user?._id || '')

    useEffect(() => {
        if (isError) {
            toast.error((error as ApiErrorType).data.message);
        }
    }, [isError]);

    useEffect(() => {
        if (data?.data.bar) {
            setBarData(data?.data.bar)
        }
    }, [data])
    return (
        <div className="adminContainer">
            <AdminSideBar />
            {
                isLoading ? <Skeleton /> : <main className="chartContainer">
                    <h1>Bar Charts</h1>
                    <section>
                        <BarChart data_1={barData?.sixMonthProdut!} data_2={barData?.sixMonthUser!} title_1='Products' title_2='Users' bgColor_1='hsl(260, 50%, 30%)' bgColor_2='hsl(360, 90%, 90%)' />
                        <h2>Top Selling Products & Top Customers</h2>
                    </section>
                    <section>
                        <BarChart horizontal={true} labels={months} data_1={barData?.twelveMonthorder!} data_2={[]} title_1='Products' title_2='' bgColor_1='hsl(180, 40%, 50%)' bgColor_2='' />
                        <h2>Orders throughout the year</h2>
                    </section>
                </main>
            }
        </div>
    )
}

export default BarCharts