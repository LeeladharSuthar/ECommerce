import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import { Column } from 'react-table'
import { FaTrash } from 'react-icons/fa'
import AdminSideBar from '../../components/adminDashboard/AdminSideBar'
import TableHOC from '../../components/adminDashboard/TableHOC'
import { useAllOrdersQuery } from '../../redux/api/orderApi'
import { RootStore } from '../../redux/store'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { ApiErrorType } from '../../types/api-types'
import { useAllUsersQuery, useDeleteUserMutation } from '../../redux/api/userAPI'
import { Skeleton } from '../../components/Loader'

interface DataType {
  avatar: ReactElement,
  name: string,
  email: string,
  gender: string
  role: string,
  action: ReactElement
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "avatar"
  },
  {
    Header: "Name",
    accessor: "name"
  },
  {
    Header: "Email",
    accessor: "email"
  },
  {
    Header: "Gender",
    accessor: "gender"
  },
  {
    Header: "Role",
    accessor: "role"
  },
  {
    Header: "Action",
    accessor: "action"
  },
]

const Customer = () => {

  const [deleteUser] = useDeleteUserMutation()
  const [list, setList] = useState<DataType[]>([]);

  const admin = useSelector((store: RootStore) => store.userReducer.user)


  const deleteHandler = async (uid: string) => {
    const response = await deleteUser({ id: admin?._id || '', uid: uid })
    console.log(response)
  }

  const { data, isLoading, isError, error } = useAllUsersQuery(admin?._id || '')
  console.log(data)
  useEffect(() => {
    if (data?.data.users) {
      setList(data?.data.users.map((user) => {
        return {
          action: <button onClick={() => deleteHandler(user._id)}><FaTrash /></button>,
          avatar: (
            <img src={user.photo} alt={user.name} />
          ),
          email: user.email,
          gender: user.gender || "--",
          name: user.name,
          role: user.role,
        }
      }))
    }
  }, [data])

  useEffect(() => {
    if (isError) {
      toast.error((error as ApiErrorType).data.message);
    }
  }, [isError]);

  const Table = TableHOC<DataType>(columns, list, "dashboard", "customers", true)

  return (
    <div className="adminContainer">
      <AdminSideBar />
      {
        isLoading ? <Skeleton /> : <main>{Table}</main>
      }
    </div>
  )
}

export default Customer