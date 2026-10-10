import apiInstance from "../../apiGlobal/apiInstance.js";

export const getDashboardStatsAPI = async () => {
    const { data } = await apiInstance.get("/auth/dashboard");

    return data;
};

export const getKnowledgeSourceAPI = async () => {
    const { data } = await apiInstance.get("/knowledge/data");

    return data;
};

export const uploadKnowledgeDocumentAPI = async (formData) => {
    const { data } = await apiInstance.post(
        "/knowledge/data/document",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return data;
};

export const addManualTextAPI = async (payload) => {
    const { data } = await apiInstance.post(
        "/knowledge/data/manual-text",
        payload
    );

    return data;
};

export const updateKnowledgeSourceAPI = async (id, payload) => {
    const { data } = await apiInstance.patch(`/knowledge/data/${id}`, payload);
    return data;
}

export const deleteKnowledgeSourceAPI = async (id) => {
    const { data } = await apiInstance.delete(`/knowledge/data/${id}`);
    return data;
}

export const updateManualKnowledgeAPI = async (id, payload) => {
    const { data } = await apiInstance.put(`/knowledge/data/knowledge/${id}`, payload);
    return data;
}

export const getManualKnowledgeContentAPI = async (id) => {
    const { data } = await apiInstance.get(`/knowledge/data/knowledge/${id}/content`);
    return data;
};