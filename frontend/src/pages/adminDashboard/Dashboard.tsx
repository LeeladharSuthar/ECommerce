import { BsSearch } from "react-icons/bs"
import { FaRegBell } from "react-icons/fa"
import { HiTrendingDown, HiTrendingUp } from "react-icons/hi"
import data from "../../assets/data.json"

import { BiMaleFemale } from "react-icons/bi"
import userImg from "../../assets/userpic.png"
import Table from "../../components/adminDashboard/DashboardTable"
import AdminSideBar from "../../components/adminDashboard/AdminSideBar"
import { BarChart, DoughnutChart } from "../../components/adminDashboard/Charts"
import { useStatsQuery } from "../../redux/api/dashboardApi"
import { RootStore } from "../../redux/store"
import { useSelector } from "react-redux"
import { ApiErrorType, DashBoardResponseType, StatsDataType } from "../../types/api-types"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Skeleton } from "../../components/Loader"

const Dashboard = () => {
  const user = useSelector((state: RootStore) => state.userReducer.user)
  const [statsData, setStatsData] = useState<StatsDataType>()
  const { isLoading, isError, data: responseData, error } = useStatsQuery(user?._id || '')

  useEffect(() => {
    if (isError) {
      toast.error((error as ApiErrorType).data.message);
    }
  }, [isError]);

  useEffect(() => {
    if (responseData?.data.stats) {
      setStatsData(responseData?.data.stats)
    }
  }, [data])


  return (
    <div className="adminContainer">
      <AdminSideBar />
      {
        isLoading || !statsData ? <Skeleton /> :
          (<main className="dashboard">
            <div className="bar">
              <BsSearch />
              <input type="text" placeholder="Search for data, users, docs" />
              <FaRegBell />
              <img src={userImg} alt="User" />
            </div>

            <section className="widgetContainer">

              <WidgetItem percent={statsData?.percentage.revenueChangePercentage!} amount={true} heading="Revenue" color="rgb(0, 115, 255)" value={statsData?.total.totalRevenue!} />
              <WidgetItem percent={statsData?.percentage.userChangePercentage!} heading="Users" color="rgb(0, 198, 205)" value={statsData?.total.totalUsers!} />
              <WidgetItem percent={statsData?.percentage.orderChangePercentage!} heading="Transactions" color="rgb(255, 195, 0)" value={statsData?.total.totalOrders!} />
              <WidgetItem percent={statsData?.percentage.productChangePercentage!} heading="Products" color="rgb(76, 0, 255)" value={statsData?.total.totalProducts!} />
            </section>

            <section className="graphContainer">
              <div className="revenueChart">
                <h2>Revenue & Transaction</h2>
                {/* Graph here */}
                <BarChart
                  data_1={statsData?.revenueOrderGrowth.revenue!}
                  data_2={statsData?.revenueOrderGrowth.order!}
                  title_1="Revenue"
                  title_2="Transaction"
                  bgColor_1="rgb(0, 155, 255)"
                  bgColor_2="rgba(53, 162, 235, 0.8)" />

              </div>
              <div className="dashboardCategory">
                <h2>Inventory</h2>
                <div>
                  {
                    statsData?.categories.map((cat) => (<CategoryItem key={cat.category} color={`hsl(${cat.totalItems * 4}, ${cat.totalItems}%, 50%)`} heading={cat.category} value={cat.totalItems} />))
                  }
                </div>
              </div>
            </section>

            <section className="transactionContaier">
              <div className="genderChart">
                <h2>Gender Ratio</h2>
                <DoughnutChart labels={["Female", "Male"]} data={[statsData?.userRatio.female ?? 0, statsData?.userRatio.male ?? 0,]} bgColor={["hsl(340, 82%, 56%)", "rgba(53, 162, 235, 0.8)"]} cutout={90} />
                <p><BiMaleFemale /></p>
              </div>


              <Table data={statsData?.latestTransactions ?? []} />
            </section>

          </main>)
      }
    </div>
  )
}


interface WidgetItemProps {
  heading: string,
  value: number,
  color: string,
  percent: number,
  amount?: boolean
}

const WidgetItem = ({ heading, value, color, percent, amount = false }: WidgetItemProps) => {
  return <article className="widget">
    <div className="WidgetInfo">
      <p>{heading}</p>
      <h4>{amount ? `$${value}` : value}</h4>
      {
        percent > 0 ? (
          <span className="green"><HiTrendingUp />+{percent}</span>
        ) : (
          <span className="red"><HiTrendingDown /> {percent}</span>
        )
      }
    </div>
    <div className="widgetCircle" style={{
      background: `conic-gradient(${color} ${Math.abs(percent) / 100 * 100}deg, rgb(255, 255, 255) 0)`,
      color
    }}>
      <span style={{ color: color }}>{percent}%</span>

    </div>
  </article>
}

interface CategoryProps {
  color: string,
  value: number,
  heading: string
}


const CategoryItem = ({ color, value, heading }: CategoryProps) => {
  return <div className="categoryItem">
    <h5>{heading}</h5>
    <div>
      <div style={{ backgroundColor: color, width: `${value}%` }}>
      </div>
    </div>
    <span>{value}%</span>
  </div>
}

export default Dashboard