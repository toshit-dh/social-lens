import axios from "axios";

const ApiClient = axios.create({
  baseURL: "http://localhost:5000/", 
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer your-token",
  },
});

ApiClient.interceptors.request.use(
  (config) => {
    console.log("Request Config:", config); 
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

ApiClient.interceptors.response.use(
  (response) => {
    console.log("Response:", response); 
    return response;
  },
  (error) => {
    console.error("Response Error:", error);
    return Promise.reject(error);
  }
);

export default ApiClient;
