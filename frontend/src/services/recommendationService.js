import api from "../api/api";


export const getJobRecommendations = async () => {

    const response = await api.get("/recommendations/");

    return response.data;

};