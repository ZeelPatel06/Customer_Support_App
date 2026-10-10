import apiInstance from "../../apiGlobal/apiInstance.js";

export const getKnowledgeChunksAPI = async (sourceId) => {
    const { data } = await apiInstance.get(`/knowledge/data/${sourceId}/chunks`);
    return data;
}
