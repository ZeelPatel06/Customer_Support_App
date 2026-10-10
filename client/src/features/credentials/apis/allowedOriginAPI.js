import apiInstance from "../../apiGlobal/apiInstance.js";

export const getAllowedOriginsAPI = async () => {
    const { data } = await apiInstance.get(
        "/organization/allowed-origins"
    );

    return data;
};

export const addAllowedOriginAPI = async (origin) => {
    const { data } = await apiInstance.post(
        "/organization/allowed-origins",
        {
            origin,
        }
    );

    return data;
};

export const removeAllowedOriginAPI = async (origin) => {
    const { data } = await apiInstance.delete(
        "/organization/allowed-origins",
        {
            data: {
                origin,
            },
        }
    );

    return data;
};