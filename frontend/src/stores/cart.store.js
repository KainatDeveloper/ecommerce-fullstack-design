import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const getStoredCart = () => {
  try {
    return JSON.parse(localStorage.getItem("ecommerce_cart") || "[]");
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  localStorage.setItem("ecommerce_cart", JSON.stringify(items));
};

export const useCartStore = create((set, get) => ({
  cartItems: getStoredCart(),
  isLoading: false,

  addToCart: async (productId, productData = null) => {
    set({ isLoading: true });
    try {
      // Try backend first
      const res = await axiosInstance.post("/cart", { productId });
      if (res.data?.cartItems) {
        set({ cartItems: res.data.cartItems, isLoading: false });
        toast.success("Item added to cart");
        return;
      }
    } catch (error) {
      // Fallback to localStorage
      const { cartItems } = get();
      const existing = cartItems.find((item) => item.product?._id === productId || item.productId === productId);
      let newItems;
      if (existing) {
        newItems = cartItems.map((item) =>
          (item.product?._id === productId || item.productId === productId)
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        newItems = [...cartItems, { product: productData || { _id: productId }, productId, quantity: 1 }];
      }
      set({ cartItems: newItems, isLoading: false });
      saveCart(newItems);
      toast.success("Item added to cart");
    }
  },

  getCartItems: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/cart");
      if (res.data?.cartItems) {
        set({ cartItems: res.data.cartItems, isLoading: false });
        saveCart(res.data.cartItems);
      }
    } catch (error) {
      // Use localStorage fallback
      const stored = getStoredCart();
      set({ cartItems: stored, isLoading: false });
    }
  },

  deleteCartItem: async (productId) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete("/cart", { data: { productId } });
    } catch (error) {
      // localStorage fallback
    }
    const { cartItems } = get();
    const newItems = cartItems.filter((item) => (item.product?._id !== productId && item.productId !== productId));
    set({ cartItems: newItems, isLoading: false });
    saveCart(newItems);
    toast.success("Item removed from cart");
  },

  updateCArtItem: async (productId, newQty) => {
    set({ isLoading: true });
    try {
      await axiosInstance.put("/cart", { productId, quantity: newQty });
    } catch (error) {
      // localStorage fallback
    }
    const { cartItems } = get();
    const newItems = cartItems.map((item) =>
      (item.product?._id === productId || item.productId === productId)
        ? { ...item, quantity: newQty }
        : item
    );
    set({ cartItems: newItems, isLoading: false });
    saveCart(newItems);
    toast.success("Quantity updated");
  },
}));

