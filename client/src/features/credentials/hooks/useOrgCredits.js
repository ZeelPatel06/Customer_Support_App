import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    generateOrganizationCredentialsAPI,
    getOrganizationCredentialsAPI,
    revokeOrganizationCredentialsAPI,
} from "../apis/organizationCreditsAPI";


export const useOrganizationCredentials = () => {
    return useQuery({
        queryKey: ["organization-credentials"],
        queryFn: getOrganizationCredentialsAPI,
        retry: false,
    });
};


export const useGenerateOrganizationCredentials = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: generateOrganizationCredentialsAPI,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["organization-credentials"],
            });
        },
    });
};


export const useRevokeOrganizationCredentials = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: revokeOrganizationCredentialsAPI,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["organization-credentials"],
            });
        },
    });
};