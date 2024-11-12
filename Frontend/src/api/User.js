import apiClient from "./Index";

export const LOGIN = (email, password) =>
    apiClient.post("/auth/local", {
        identifier: email,
        password: password,
    });

export const REGISTER_USER = (body) => apiClient.post("/auth/local/register", body);

export const GET_ME = () => apiClient.get("users/me");

export const GET_USER_ALBUM_REVIEW = async (userID, filters = {}, sort = []) => {
    try {
        const sortQueryParam = Array.isArray(sort) && sort.length > 0 ? sort.join(',') : undefined;

        const response = await apiClient.get(`users-albums`, {
            params: {
                filters: {
                    userID: userID,
                    ...filters
                },
                populate: '*',
                pagination: {
                    pageSize: 100,
                },
                sort: sortQueryParam,
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const ADD_ALBUM_REVIEW = async (data) => {
    try {
        const response = await apiClient.post(`/users-albums`, { data });
        return response.data; // Assuming the API response includes the new review data
    } catch (error) {
        throw error;
    }
};

export const UPDATE_ALBUM = async (id, data) =>
    apiClient.put(`/users-albums/${id}`, { data });

export const CREATE_LIST = async (data) => {
    try {
        const response = await apiClient.post(`/lists`, { data });
        return response.data; // Assuming the API response includes the new review data
    } catch (error) {
        throw error;
    }
};

export const UPDATE_LIST = async (id, data) =>
    apiClient.put(`/lists/${id}`, { data });

export const GET_LISTS = async (filters = {}) => {
    try {
        const response = await apiClient.get(`lists`, {
            params: {
                filters: {
                    ...filters
                },
                populate: '*',
                pagination: {
                    pageSize: 100,
                },
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const DELETE_LIST = async (id) =>
    apiClient.delete(`/lists/${id}`);

export const GET_USERS = async (filters = {}) => {
    try {
        const response = await apiClient.get('users', {
            params: {
                filters: {
                    ...filters
                },
                populate: '*',
                pagination: {
                    pageSize: 100,
                },
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const UPDATE_FOLLOW = async (id, data) => {
    try {
        const response = await apiClient.put(`/users/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const UPLOAD_IMAGE = async (formData) => {
    try {
        const response = await apiClient.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data; // This typically includes the file details from Strapi
    } catch (error) {
        console.error("Error uploading image to Strapi:", error.response ? error.response.data : error.message);
        throw error;
    }
};
