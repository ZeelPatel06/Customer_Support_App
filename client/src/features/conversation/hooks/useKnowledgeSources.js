import { useQuery } from "@tanstack/react-query";
import { getKnowledgeSourceAPI } from "../apis/conversationAPI.js";

export const useKnowledgeSources = () => {
    return useQuery({
        queryKey: ["knowledgeSources"],
        queryFn: getKnowledgeSourceAPI,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false
    });
};