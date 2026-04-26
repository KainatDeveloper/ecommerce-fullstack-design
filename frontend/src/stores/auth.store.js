import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
  loading: false,
  authUser: null, // Start with null, let checkAuth load from localStorage
  loader: true, // Start with true to show loading screen

  Login: async (formData) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post("/auth/login", formData);
      const user = res.data.user || res.data;
      set({ authUser: user, loading: false });
      localStorage.setItem("ecommerce_user", JSON.stringify(user));
      if (res.data.token) {
        localStorage.setItem("ecommerce_token", res.data.token);
      }
      toast.success("Successfully Logged In");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Login failed");
      console.log("error in login", error.message);
    }
  },

  SignUp: async (formData) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post("/auth/register", formData);
      const user = res.data.user || res.data;
      set({ authUser: user, loading: false });
      localStorage.setItem("ecommerce_user", JSON.stringify(user));
      if (res.data.token) {
        localStorage.setItem("ecommerce_token", res.data.token);
      }
      toast.success("Successfully Registered!");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Signup failed");
      console.log("error in signup", error.message);
    }
  },

  checkAuth: () => {
    try {
      const saved = localStorage.getItem("ecommerce_user");
      if (saved) {
        set({ authUser: JSON.parse(saved), loader: false });
      } else {
        set({ authUser: null, loader: false });
      }
    } catch (error) {
      console.error("Auth check error:", error);
      set({ authUser: null, loader: false });
    }
  },

  LogOut: () => {
    localStorage.removeItem("ecommerce_user");
    localStorage.removeItem("ecommerce_token");
    set({ authUser: null });
    toast.success("Successfully Logged Out!");
  },
}));

