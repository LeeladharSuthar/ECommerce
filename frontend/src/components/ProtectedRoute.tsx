import { ReactElement } from "react"
import { Navigate, Outlet } from "react-router-dom";
interface Props {
    children?: ReactElement;
    isAuthenticated: boolean;
    adminRoute?: boolean;
    isAdmin?: boolean;
    redirect?: string
}

export const ProtectedRoute = ({ children, isAuthenticated, adminRoute, isAdmin, redirect = "/" }: Props) => {
    // Not logged in
    if (!isAuthenticated) return <Navigate to={redirect} />

    // admin route
    if (adminRoute) {
        if (isAdmin) {
            return children
        } else {
            return <Navigate to={redirect} />
        }
    }

    return children ? children : <Outlet />
}