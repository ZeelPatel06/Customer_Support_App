import { useQuery } from "@tanstack/react-query";
import { getKnowledgeChunksAPI } from "../apis/knowledgeChunksAPI";

export const useKnowledgeChunks = (sourceId) => {
    return useQuery({
        queryKey: ["knowledgeChunks", sourceId],
        queryFn: () => getKnowledgeChunksAPI(sourceId),
        enabled: !!sourceId,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false
    });
};