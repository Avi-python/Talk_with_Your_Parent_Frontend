import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import dayjs from 'dayjs';

const baseURL = 'localhost:8000'

const useAxios = () => {
    const axiosInstance = axios.create({
        baseURL,
        headers: {
            Authorization: `Bearer ${localStorage.getItem('authTokenAccess')}`,
        }
    });

    axiosInstance.interceptors.request.use(async req => {
        
        const payload = jwtDecode(String(localStorage.getItem('authTokenAccess')));
        // const isExpired = dayjs.unix(payload.exp).diff(dayjs()) < 1; 
        // This checks if the difference is less than 1 millisecond.

        const isExpired = dayjs.unix(payload.exp).diff(dayjs()) < 1;
        // payload.exp 的部分是 jwt的過期時間，如果這個過期時間超過了當前時間 dayjs 就會傳 true 代表 token 已經失效
        if(!isExpired){
            return req;
        } else {
            const response = await axios.post(`${baseURL}/api/token/refresh/`, {
                refresh: localStorage.getItem('authTokenRefresh'),   
            })

            localStorage.setItem("authTokenRefresh", response.data['refresh']);
            localStorage.setItem("authTokenAccess", response.data['access']);

            req.headers.Authorization = `Bearer ${response.data['access']}`;
            return req;
        }
    });

    return axiosInstance;
}

export default useAxios;