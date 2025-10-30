import axios from "axios";

export const api = axios.create({
    baseURL:"https://expense-tracker-backend-six-omega.vercel.app",
    withCredentials: true
})