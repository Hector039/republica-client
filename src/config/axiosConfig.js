import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: "https://republica-server.onrender.com/api/",
    proxy: {
        host: "localhost",
        port: 5173
    }
});

axiosInstance.interceptors.request.use(
    function (config) {
        const token = sessionStorage.getItem("temp");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            console.error('Server Error:', error.response.data);
        } else if (error.request) {
            console.error('No Response:', error.request);
        } else {
            console.error('Error:', error.message);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance; 