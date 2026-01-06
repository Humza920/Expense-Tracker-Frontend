import axios from "axios";

export const api = axios.create({
    baseURL:"https://expense-tracker-backend-six-omega.vercel.app",
    // baseURL:"http://localhost:5000",
    withCredentials: true
})