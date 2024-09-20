import { lazy, Suspense, useEffect } from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { Toaster } from "react-hot-toast"
import Loader, { Skeleton } from './components/Loader'

import "./styles/app.scss"
import Dashboard from './pages/adminDashboard/Dashboard'
import Products from './pages/adminDashboard/Products'
import Customer from './pages/adminDashboard/Customer'
import Transaction from './pages/adminDashboard/Transaction'
import BarCharts from './pages/adminDashboard/charts/BarCharts'
import LineCharts from './pages/adminDashboard/charts/LineCharts'
import PieCharts from './pages/adminDashboard/charts/PieCharts'
import Toss from './pages/adminDashboard/apps/Toss'
import StopWatch from './pages/adminDashboard/apps/StopWatch'
import Coupon from './pages/adminDashboard/apps/Coupon'
import NewProduct from './pages/adminDashboard/management/NewProduct'
import ProductManagement from './pages/adminDashboard/management/ProductManagement'
import TransactionManagement from './pages/adminDashboard/management/TransactionManagement'

const Home = lazy(() => import("./pages/Home"))
const Search = lazy(() => import("./pages/Search"))
const Cart = lazy(() => import("./pages/Cart"))

import "./styles/app.scss"
import Header from './components/Header'
import Shipping from './pages/Shipping'
import Login from './pages/Login'
import Order from './pages/Order'
import OrderDetails from './pages/OrderDetails'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import { login, logOut } from './redux/reducer/userReducer'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from './redux/api/userAPI'
import { UserReducerInitialState } from './types/reducer-types'
import { ProtectedRoute } from './components/ProtectedRoute'
import Table from './components/adminDashboard/Table'
import NotFound from './pages/NotFound'
import CheckOut from './pages/CheckOut'
import { RootStore } from './redux/store'
// Admin Route Components


const App = () => {

  const dispatch = useDispatch()

  const { user } = useSelector((state: RootStore) => {
    return state.userReducer
  })

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data = await getUser(user.uid)
        dispatch(login(data!))
      } else {
        dispatch(logOut({}))
      }
    })
  }, [])

  // console.log(user)
  return <Router>
    <Header user={user} />
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Login Not Required */}
        <Route element={<Home />} path='/' />
        <Route element={<Cart />} path='/cart' />
        <Route element={<Search />} path='/search' />
        {/* <Route element={<Table />} path='/table' /> */}

        {/* Only when user not logged in */}
        <Route element={<ProtectedRoute isAuthenticated={user ? false : true}><Login /></ProtectedRoute>} path='/login' />

        {/* Login Required */}
        <Route element={<ProtectedRoute isAuthenticated={user ? true : false} />}>
          <Route element={<Shipping />} path='/shipping' />
          <Route element={<CheckOut />} path='/pay' />
          <Route element={<Order />} path='/orders' />
          <Route element={<OrderDetails />} path='/orderDetails/:id' />
        </Route>

        {/* Admin Routes */}
        {/* <Route element={<ProtectedRoute isAdmin={user!.role === "admin" ? true : false} isAuthenticated={user ? true : false} adminRoute={true} />}> */}
        <Route path='/admin/dashboard' element={<Dashboard />} />
        <Route path='/admin/product' element={<Products />} />
        <Route path='/admin/customer' element={<Customer />} />
        <Route path='/admin/transaction' element={<Transaction />} />
        {/* Charts */}
        <Route path='/admin/chart/bar' element={<BarCharts />} />
        <Route path='/admin/chart/line' element={<LineCharts />} />
        <Route path='/admin/chart/pie' element={<PieCharts />} />
        {/* Apps */}
        <Route path='/admin/app/toss' element={<Toss />} />
        <Route path='/admin/app/stopWatch' element={<StopWatch />} />
        <Route path='/admin/app/coupon' element={<Coupon />} />
        {/* Management */}
        <Route path='/admin/product/new' element={<NewProduct />} />
        <Route path='/admin/product/:id' element={<ProductManagement />} />
        <Route path='/admin/transaction/:id' element={<TransactionManagement />} />

        {/* </Route> */}

        <Route path='*' element={<NotFound />} />
      </Routes>
    </Suspense>
    <Toaster position='bottom-center' />
  </Router>
}

export default App