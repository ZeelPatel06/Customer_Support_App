import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadKnowledgeDocumentAPI, addManualTextAPI, updateKnowledgeSourceAPI, deleteKnowledgeSourceAPI, updateManualKnowledgeAPI, getManualKnowledgeContentAPI } from "../apis/conversationAPI.js";

export const useKnowledgeUpload = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: uploadKnowledgeDocumentAPI,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["knowledgeSources"],
            });
        },
    });
};

export const useAddManualText = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addManualTextAPI,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["knowledgeSources"]
            });
        },
    });
};

export const useUpdateKnowledgeSource = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }) => updateKnowledgeSourceAPI(id, payload),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["knowledgeSources"],
            });
        },
    });
};

export const useDeleteKnowledgeSource = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteKnowledgeSourceAPI,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["knowledgeSources"],
            });
        },
    });
};

export const useUpdateManualText = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({id, payload}) => updateManualKnowledgeAPI(id, payload),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["knowledge-sources"],
            });
        },
    });
};

export const useManualKnowledgeContent = () => {
    return useMutation({
        mutationFn: (id) =>
            getManualKnowledgeContentAPI(id),
    });
};