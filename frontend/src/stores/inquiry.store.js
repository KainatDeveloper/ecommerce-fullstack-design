import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useInquiryStore = create((set, get) => ({
  inquiries: [],
  currentInquiry: null,
  loading: false,
  error: null,

  /**
   * Create a new inquiry
   */
  createInquiry: async (inquiryData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post("/inquiry", inquiryData);
      
      if (response.data.success) {
        set((state) => ({
          inquiries: [response.data.data.inquiry, ...state.inquiries],
          loading: false,
        }));
        toast.success(response.data.message || "Inquiry sent successfully!");
        return response.data.data.inquiry;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to create inquiry";
      const errorsList = error.response?.data?.errors || [];
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      if (errorsList.length > 0) {
        errorsList.forEach((err) => toast.error(err));
      }
      throw error;
    }
  },

  /**
   * Get user's inquiries
   */
  getInquiries: async (status = null, page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      let url = `/inquiry?page=${page}&limit=${limit}`;
      if (status) {
        url += `&status=${status}`;
      }

      const response = await axiosInstance.get(url);
      
      if (response.data.success) {
        set({
          inquiries: response.data.data.inquiries,
          loading: false,
        });
        return response.data.data;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch inquiries";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  /**
   * Get inquiry details
   */
  getInquiryById: async (inquiryId) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/inquiry/${inquiryId}`);
      
      if (response.data.success) {
        set({
          currentInquiry: response.data.data.inquiry,
          loading: false,
        });
        return response.data.data.inquiry;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch inquiry";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  /**
   * Update inquiry
   */
  updateInquiry: async (inquiryId, updateData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.put(`/inquiry/${inquiryId}`, updateData);
      
      if (response.data.success) {
        set((state) => ({
          inquiries: state.inquiries.map((inq) =>
            inq._id === inquiryId ? response.data.data.inquiry : inq
          ),
          currentInquiry: response.data.data.inquiry,
          loading: false,
        }));
        toast.success("Inquiry updated successfully!");
        return response.data.data.inquiry;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update inquiry";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  /**
   * Delete inquiry
   */
  deleteInquiry: async (inquiryId) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.delete(`/inquiry/${inquiryId}`);
      
      if (response.data.success) {
        set((state) => ({
          inquiries: state.inquiries.filter((inq) => inq._id !== inquiryId),
          loading: false,
        }));
        toast.success("Inquiry deleted successfully!");
        return true;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to delete inquiry";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  /**
   * Clear error
   */
  clearError: () => {
    set({ error: null });
  },

  /**
   * Clear current inquiry
   */
  clearCurrentInquiry: () => {
    set({ currentInquiry: null });
  },
}));
