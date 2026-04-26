import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import connectDB from "./db.js";

dotenv.config();
connectDB();

const sampleProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    description: "Premium over-ear headphones with active noise cancellation and 30-hour battery life.",
    category: "Electronics",
    stock: 50,
  },
  {
    name: "Running Sneakers",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    description: "Lightweight breathable running shoes with cushioned sole for maximum comfort.",
    category: "Sports",
    stock: 30,
  },
  {
    name: "Smart Watch Pro",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    description: "Advanced fitness tracker with heart rate monitor, GPS, and 7-day battery life.",
    category: "Electronics",
    stock: 25,
  },
  {
    name: "Leather Messenger Bag",
    price: 189.99,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop",
    description: "Genuine leather laptop bag with multiple compartments and adjustable strap.",
    category: "Accessories",
    stock: 15,
  },
  {
    name: "Organic Face Serum",
    price: 45.99,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop",
    description: "Vitamin C brightening serum with hyaluronic acid for glowing skin.",
    category: "Beauty",
    stock: 60,
  },
  {
    name: "Minimalist Table Lamp",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
    description: "Modern LED desk lamp with adjustable brightness and touch controls.",
    category: "Home",
    stock: 40,
  },
  {
    name: "Denim Jacket",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop",
    description: "Classic vintage wash denim jacket with button closure and chest pockets.",
    category: "Fashion",
    stock: 20,
  },
  {
    name: "Yoga Mat Premium",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop",
    description: "Non-slip eco-friendly yoga mat with alignment lines and carrying strap.",
    category: "Sports",
    stock: 45,
  },
  {
    name: "Stainless Steel Water Bottle",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
    description: "Insulated 32oz water bottle keeps drinks cold for 24 hours or hot for 12.",
    category: "Accessories",
    stock: 80,
  },
  {
    name: "Wireless Charging Pad",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=400&h=400&fit=crop",
    description: "Fast wireless charger compatible with all Qi-enabled devices.",
    category: "Electronics",
    stock: 55,
  },
  {
    name: "Aromatherapy Diffuser",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1608501821300-4a99e79bba4b?w=400&h=400&fit=crop",
    description: "Ultrasonic essential oil diffuser with 7 color LED lights and auto shut-off.",
    category: "Home",
    stock: 35,
  },
  {
    name: "Casual Summer Dress",
    price: 54.99,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop",
    description: "Flowy floral print dress perfect for summer outings and beach days.",
    category: "Fashion",
    stock: 18,
  },
];

const seedDB = async () => {
  try {
    await Product.deleteMany();
    console.log("Existing products cleared.");

    await Product.insertMany(sampleProducts);
    console.log(`${sampleProducts.length} sample products added.`);

    console.log("Database seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Seeding error:", error.message);
    process.exit(1);
  }
};

seedDB();

