import { useQuery } from "@tanstack/react-query";
import { getDashboardStatsAPI } from "../apis/conversationAPI.js";

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ["dashboardStats"],
        queryFn: getDashboardStatsAPI,
        staleTime: 1000*60*5,
        refetchOnWindowFocus: false
    });
};