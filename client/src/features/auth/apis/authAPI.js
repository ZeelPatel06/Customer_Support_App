import axiosInstance from "../../apiGlobal/apiInstance.js";

export const loginUserApi = async (credentials) => {
    const { data } = await axiosInstance.post("/auth/login", credentials);
    return data;
};

export const registerUserApi = async (userData) => {
    const { data } = await axiosInstance.post("/auth/register", userData);
    return data;
};

export const getMeApi = async () => {
    const { data } = await axiosInstance.get("/auth/me");
    return data;
};

export const logoutUserApi = async () => {
    const { data } = await axiosInstance.post("/auth/logout");
    return data;
};

export const updateProfileApi = async (userData) => {
    const { data } = await axiosInstance.put("/auth/change-profile", userData);
    return data;
}