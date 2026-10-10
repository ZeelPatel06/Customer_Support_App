import { Navigate, Outlet } from "react-router";
import { useAuthUser } from "../../auth/hooks/useAuth.js";

const PublicRoute = () => {
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

    // If authenticated, prevent access to login/register.
    if (!isError && data?.user) {
        return (
            <Navigate
                to="/profile"
                replace
            />
        );
    }

    // Logged-out users can access public routes.
    return <Outlet />;
};

export default PublicRoute;