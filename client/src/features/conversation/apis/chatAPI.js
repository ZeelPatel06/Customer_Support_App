import apiInstance from "../../apiGlobal/apiInstance";

export const sendChatMessageAPI = async (payload) => {
    const { data } = await apiInstance.post("/v1/chat", payload);
    return data;
};

export const clearChatAPI = async (conversationId) => {
    const { data } = await apiInstance.request({ method: "DELETE", url: "/v1/chat/clear", data: { conversationId } });
    return data;
};