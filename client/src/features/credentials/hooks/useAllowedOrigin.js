import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    getAllowedOriginsAPI,
    addAllowedOriginAPI,
    removeAllowedOriginAPI,
} from "../apis/allowedOriginAPI.js";


export const useAllowedOrigins = () => {
    return useQuery({
        queryKey: ["allowed-origins"],
        queryFn: getAllowedOriginsAPI,
        retry: false,
    });
};


export const useAddAllowedOrigin = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addAllowedOriginAPI,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["allowed-origins"],
            });
        },
    });
};


export const useRemoveAllowedOrigin = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: removeAllowedOriginAPI,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["allowed-origins"],
            });
        },
    });
};