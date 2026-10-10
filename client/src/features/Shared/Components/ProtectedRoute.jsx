import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthUser } from "../../auth/hooks/useAuth.js";

const ProtectedRoute = () => {
    const location = useLocation();

    const {
        data,
        isLoading,
        isError,
    } = useAuthUser();

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                Checking authentication...
            </div>
        );
    }

    if (isError || !data?.user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    return <Outlet />;
};

export default ProtectedRoute;