import axios from "axios";
import { useEffect } from "react";

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});
const useAxiosInstance = () => {
    useEffect(() => {
        instance.interceptors.request.use((config)=>{
            const token = localStorage.getItem('token')
            if(token){
                config.headers.Authorization = `Bearer ${token}`
            }
            return config
        })
    }, [])
    return instance

}

export default useAxiosInstance