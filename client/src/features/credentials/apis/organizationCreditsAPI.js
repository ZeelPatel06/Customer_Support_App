import apiInstance from "../../apiGlobal/apiInstance.js";

export const getOrganizationCredentialsAPI = async () => {
    const { data } = await apiInstance.get("/organization/credentials");
    return data;
}

export const generateOrganizationCredentialsAPI = async (environment = "test") => {
    const { data } = await apiInstance.post("/organization/credentials", { environment });
    return data;
}

export const revokeOrganizationCredentialsAPI = async (id) => {
    const { data } = await apiInstance.delete(`/organization/credentials/${id}`);
    return data;
}