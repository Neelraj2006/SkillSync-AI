import api from "../api/api";

export const uploadResume = async (file, jobTitle) => {

    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post(
        `/resume/upload?job_title=${encodeURIComponent(jobTitle)}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data;
};