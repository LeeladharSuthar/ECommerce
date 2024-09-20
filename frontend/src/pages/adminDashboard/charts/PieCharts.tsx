import AdminSideBar from "../../../components/adminDashboard/AdminSideBar"
import { DoughnutChart, PieChart } from "../../../components/adminDashboard/Charts"
import { categories } from "../../../assets/data.json"
import { usePieQuery } from "../../../redux/api/dashboardApi"
import { ApiErrorType, PieDatType } from "../../../types/api-types"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { RootStore } from "../../../redux/store"
import { useSelector } from "react-redux"
import { Skeleton } from "../../../components/Loader"



const PieCharts = () => {
  const [pieData, setPieData] = useState<PieDataType>()
  const user = useSelector((state: RootStore) => state.userReducer.user)
  const { data, isLoading, isError, error } = usePieQuery(user?._id || '')

  useEffect(() => {
    if (isError) {
      toast.error((error as ApiErrorType).data.message);
    }
  }, [isError]);

  useEffect(() => {
    if (data?.data.pie) {
      setPieData(data?.data.pie)
    }
  }, [data])

  const fulfillmentData = pieData?.orderFulfillmentRatio.reduce((accumulator, i, idx): number[] => {
    if (i.status === "Processing") accumulator[0] = i.count
    else if (i.status === "Shipped") accumulator[1] = i.count
    else if (i.status === "Delivered") accumulator[2] = i.count
    return accumulator
  }, [0, 0, 0])

  const categoryData = pieData?.productCategoryRatio.reduce((accumulator, i, idx) => {
    accumulator.label[idx] = i.category
    accumulator.data[idx] = i.count
    return accumulator
  }, { label: Array(pieData?.productCategoryRatio.length).fill(''), data: Array(pieData?.productCategoryRatio.length).fill(0) })

  return (
    <div className="adminContainer">
      <AdminSideBar />
      {
        isLoading ? <Skeleton /> : <main className="chartContainer">
          <h1>Pie & Doughnut Charts</h1>
          <section>
            <div>
              <PieChart
                labels={["Processing", "Shipped", "Delivered"]}
                data={fulfillmentData!}
                bgColor={["hsl(110, 80%, 80%)", "hsl(110, 80%, 50%)", "hsl(110, 40%, 80%)"]}
                offset={[0, 0, 50]} />
            </div>
            <h2>Order Fulfillment Ratio</h2>
          </section>
          <section>
            <div>
              <DoughnutChart
                labels={categoryData?.label!}
                data={categoryData?.data!}
                legends={false}
                bgColor={categories.map((i) => `hsl(${i.value * 4}, ${i.value}%, 50%)`)}
                offset={[0, 0, 0, 50]} />
            </div>
            <h2>Products Category Ratio</h2>
          </section>
          <section>
            <div>
              <DoughnutChart
                labels={["In Stock", "ut Of Stock"]}
                data={[pieData?.stockAvailbility.stock!, pieData?.stockAvailbility.outOfStock!]}
                legends={false}
                bgColor={["hsl(269, 80%, 40%)", "rgb(53, 162, 255)"]}
                cutout={"70%"}
                offset={[0, 50]} />
            </div>
            <h2>Stock Availability</h2>
          </section>
          <section>
            <div>
              <DoughnutChart
                labels={["Marketing Cost", "Discount", "Burnt", "Production Cost", "Net margin"]}
                data={[pieData?.revenueDistrubution.marketingCost!, pieData?.revenueDistrubution.discount!, pieData?.revenueDistrubution.burnt!, pieData?.revenueDistrubution.productionCharges!, pieData?.revenueDistrubution.netmargin!]}
                legends={false}
                bgColor={["hsl(110, 80%, 40%)", "hsl(19, 80%, 40%)", "hsl(69, 80%, 40%)", "hsl(300, 80%, 40%)", "rgb(53, 162, 255)"]}
                offset={[20, 30, 20, 30, 80]} />
            </div>
            <h2>Revenue Distribution</h2>
          </section>
          <section>
            <div>
              <PieChart
                labels={["Teenager(Below 20)", "Adult(20-40)", "Older(Above 40)"]}
                data={[pieData?.ageGroup.teen!, pieData?.ageGroup.adult!, pieData?.ageGroup.old!]}
                bgColor={["hsl(10, 80%, 80%)", "hsl(10, 80%, 50%)", "hsl(10, 40%, 80%)"]}
                offset={[0, 0, 50]} />
            </div>
            <h2>Users Age Group</h2>
          </section>
          <section>
            <div>
              <DoughnutChart
                labels={["Admin", "Customers"]}
                data={[pieData?.roleDistribution.admin!, pieData?.roleDistribution.user!]}
                bgColor={["hsl(335, 100%, 38%)", "hsl(44, 98%, 50%)"]}
                offset={[0, 80]} />
            </div>
          </section>
        </main>
      }
    </div>
  )
}

export default PieCharts