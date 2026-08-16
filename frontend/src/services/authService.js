import api from "../api/api";

export const loginUser = async (userData) => {

    const response = await api.post(
        "/login",
        userData
    );

    if (response.data?.data?.access_token) {

        localStorage.setItem(
            "access_token",
            response.data.data.access_token
        );
    }

    return response.data;
};

export const registerUser = async (userData) => {

    const response = await api.post(
        "/register",
        userData
    );

    return response.data;
};