import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { loginUserApi, registerUserApi, getMeApi, logoutUserApi, updateProfileApi } from "../apis/authAPI";
import { toast } from "react-hot-toast";

export const useLogin = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: loginUserApi,
        onSuccess: (data) => {
            queryClient.setQueryData(['authUser'], data);
            navigate("/dashboard", { replace: true });
        },
        onError: (err) => {
            const message = err?.response?.data?.message || 'Login failed. Please try again.';
            toast.error(message);

        }
    });
};

export const useRegister = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: registerUserApi,
        onSuccess: async () => {
            try {
                const { data } = await getMeApi();
                queryClient.setQueryData(["authUser"], data);
                navigate("/dashboard", { replace: true });
            } catch (error) {
                toast.error("Registration successful, but failed to load profile.");
            }
        },
        onError: (err) => {
            const message = err?.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(message);
        }
    });
};

export const useAuthUser = () => {
    return useQuery({
        queryKey: ['authUser'],
        queryFn: getMeApi,
        retry: false,
        staleTime: 1000 * 60 * 15, // Cache session data for 15 minutes to reduce unnecessary API calls
        refetchOnWindowFocus: false,
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: logoutUserApi,
        onSuccess: () => {
            // 1. Instantly clear the authenticated user from TanStack Query cache
            queryClient.setQueryData(['authUser'], null);

            // 2. Show feedback notification
            toast.success('Logged out successfully');

            // 3. Redirect to login page
            navigate('/login');
        },
        onError: (error) => {
            const message = error?.response?.data?.message || 'Failed to logout';
            toast.error(message);
        },
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProfileApi,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["authUser"],
            });

            toast.success("Updated successfully");
        },

        onError: (error) => {
            const message =
                error?.response?.data?.message ||
                "Failed to update";

            toast.error(message);
        },
    });
};