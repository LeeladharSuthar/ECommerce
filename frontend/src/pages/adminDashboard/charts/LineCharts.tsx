import { useEffect, useState } from "react";
import AdminSideBar from "../../../components/adminDashboard/AdminSideBar";
import { LineChart } from "../../../components/adminDashboard/Charts";
import { ApiErrorType, LineDataType } from "../../../types/api-types";
import { RootStore } from "../../../redux/store";
import { useLineQuery } from "../../../redux/api/dashboardApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Skeleton } from "../../../components/Loader";

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const LineCharts = () => {
    const [lineData, setLineData] = useState<LineDataType>()
    const user = useSelector((state: RootStore) => state.userReducer.user)
    const { data, isLoading, isError, error } = useLineQuery(user?._id || '')

    useEffect(() => {
        if (isError) {
            toast.error((error as ApiErrorType).data.message);
        }
    }, [isError]);

    useEffect(() => {
        if (data?.data.line) {
            setLineData(data?.data.line)
        }
    }, [data])


    return (
        <div className="adminContainer">
            <AdminSideBar />
            {
                isLoading ? <Skeleton /> : <main className="chartContainer">
                    <h1>Line Charts</h1>
                    <section>
                        <LineChart
                            bgColor='rgba(53, 162, 255, 0.5)'
                            borderColor='rgb(53, 162, 255)'
                            data={lineData?.activeUsers!}
                            label='Users'
                            labels={months}
                        />
                        <h2>Active Users</h2>
                    </section>
                    <section>
                        <LineChart
                            bgColor='rgba(53, 162, 255, 0.5)'
                            borderColor='rgb(53, 162, 255)'
                            data={lineData?.totalProducts!}
                            label='Products'
                            labels={months}
                        />
                        <h2>Total Products (SKU)</h2>
                    </section>
                    <section>
                        <LineChart
                            bgColor='rgba(53, 162, 255, 0.5)'
                            borderColor='rgb(53, 162, 255)'
                            data={lineData?.totalRevenue!}
                            label='Revenue'
                            labels={months}
                        />
                        <h2>Total Revenue</h2>
                    </section>
                    <section>
                        <LineChart
                            bgColor='rgba(53, 162, 255, 0.5)'
                            borderColor='rgb(53, 162, 255)'
                            data={lineData?.totalDiscount!}
                            label='Discount'
                            labels={months}
                        />
                        <h2>Discount Alloted</h2>
                    </section>
                </main>
            }
        </div>
    )
}

export default LineCharts