import axios from "axios";

// const API = process.env.API_URL;
export const API = "http://localhost:8000/";

export const AUTH = API + "api/auth/";

// export const googleAuth = (code) => API.get(`/google?code=${code}`);

export const googleAuth = (code) => axios.get(`${AUTH}google?code=${code}`);
