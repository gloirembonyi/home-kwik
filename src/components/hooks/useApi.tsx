import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export const api = axios.create({
  baseURL: process.env.API_URL as string,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${Cookies.get("token")}`,
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle 403 error (Forbidden)
      toast.error(
        "You are not authorized to perform this action. Try logging in again."
      );
      window.location.href = "/auth/login";
      // Optionally, you can also perform other actions like redirecting to a login page
    }
    return Promise.reject(error);
  }
);

export const login = async (email: string, password: string) => {
  return api.post("/auth/login", { email, password });
};
