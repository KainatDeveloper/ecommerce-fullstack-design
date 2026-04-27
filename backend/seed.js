import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import connectDB from "./db.js";

dotenv.config();
connectDB();

const sampleProducts = [
  // Interior/Home & Outdoor Products
  {
    name: "Soft Chairs Premium",
    price: 199.99,
    discount: 25,
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=400&fit=crop",
    description: "Comfortable upholstered chair with modern design.",
    category: "interior",
    stock: 50,
  },
  {
    name: "Sofa & Chair Combo",
    price: 599.99,
    discount: 15,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
    description: "Modern sofa set with comfortable seating.",
    category: "interior",
    stock: 30,
  },
  {
    name: "Kitchen Mixer Professional",
    price: 299.99,
    discount: 0,
    image: "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400&h=400&fit=crop",
    description: "Heavy duty kitchen mixer for all mixing needs.",
    category: "interior",
    stock: 25,
  },
  {
    name: "Blenders Deluxe",
    price: 179.99,
    discount: 20,
    image: "https://images.unsplash.com/photo-1570734356115-1d2b6b1db466?w=400&h=400&fit=crop",
    description: "High-powered blender with multiple speed settings.",
    category: "interior",
    stock: 40,
  },
  {
    name: "Kitchen Dishes Set",
    price: 89.99,
    discount: 10,
    image: "https://images.unsplash.com/photo-1578954550067-2b32e32e0f38?w=400&h=400&fit=crop",
    description: "Premium dinnerware set for your kitchen.",
    category: "interior",
    stock: 60,
  },
  {
    name: "Smart Watches Premium",
    price: 249.99,
    discount: 25,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    description: "Advanced fitness tracker with heart rate monitor.",
    category: "interior",
    stock: 35,
  },
  {
    name: "Coffee Maker Deluxe",
    price: 149.99,
    discount: 0,
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?w=400&h=400&fit=crop",
    description: "Programmable coffee maker with thermal carafe.",
    category: "interior",
    stock: 45,
  },
  {
    name: "Home Appliances Premium",
    price: 199.99,
    discount: 15,
    image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&h=400&fit=crop",
    description: "Modern home appliances for your kitchen.",
    category: "interior",
    stock: 20,
  },

  // Tech Products
  {
    name: "Smart Watches Tech",
    price: 279.99,
    discount: 20,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    description: "Latest smartwatch with advanced features.",
    category: "tech",
    stock: 40,
  },
  {
    name: "Cameras Professional",
    price: 899.99,
    discount: 15,
    image: "https://images.unsplash.com/photo-1606933248051-5ce41ca1160b?w=400&h=400&fit=crop",
    description: "Professional DSLR camera with lens kit.",
    category: "tech",
    stock: 15,
  },
  {
    name: "Headphones Premium",
    price: 179.99,
    discount: 10,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    description: "Noise-cancelling wireless headphones.",
    category: "tech",
    stock: 55,
  },
  {
    name: "Gaming Set Pro",
    price: 349.99,
    discount: 25,
    image: "https://images.unsplash.com/photo-1599305445671-07de47f5f12f?w=400&h=400&fit=crop",
    description: "Complete gaming setup with headset and mouse.",
    category: "tech",
    stock: 25,
  },
  {
    name: "Laptops & PC Powerhouse",
    price: 1299.99,
    discount: 10,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
    description: "High-performance laptop for gaming and work.",
    category: "tech",
    stock: 18,
  },
  {
    name: "Smartphones Latest",
    price: 799.99,
    discount: 15,
    image: "https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=400&h=400&fit=crop",
    description: "Latest smartphone with amazing camera.",
    category: "tech",
    stock: 30,
  },
  {
    name: "Electric Kettle Smart",
    price: 99.99,
    discount: 0,
    image: "https://images.unsplash.com/photo-1608889335941-33f1e1b43b47?w=400&h=400&fit=crop",
    description: "Smart electric kettle with temperature control.",
    category: "tech",
    stock: 50,
  },

  // Additional Products
  {
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    discount: 20,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    description: "Premium over-ear headphones with active noise cancellation.",
    category: "Electronics",
    stock: 50,
  },
  {
    name: "Running Sneakers",
    price: 129.99,
    discount: 15,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    description: "Lightweight breathable running shoes.",
    category: "Sports",
    stock: 30,
  },
  {
    name: "Leather Messenger Bag",
    price: 189.99,
    discount: 25,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop",
    description: "Genuine leather laptop bag.",
    category: "Accessories",
    stock: 15,
  },
  {
    name: "Organic Face Serum",
    price: 45.99,
    discount: 0,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop",
    description: "Vitamin C brightening serum.",
    category: "Beauty",
    stock: 60,
  },
  {
    name: "Minimalist Table Lamp",
    price: 59.99,
    discount: 15,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
    description: "Modern LED desk lamp.",
    category: "Home",
    stock: 40,
  },
  {
    name: "Denim Jacket Classic",
    price: 89.99,
    discount: 20,
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop",
    description: "Classic vintage wash denim jacket.",
    category: "Fashion",
    stock: 20,
  },
  {
    name: "Yoga Mat Premium",
    price: 34.99,
    discount: 15,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop",
    description: "Non-slip eco-friendly yoga mat.",
    category: "Sports",
    stock: 45,
  },
  {
    name: "Stainless Steel Water Bottle",
    price: 24.99,
    discount: 10,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
    description: "Insulated 32oz water bottle.",
    category: "Accessories",
    stock: 80,
  },
  {
    name: "Wireless Charging Pad",
    price: 29.99,
    discount: 25,
    image: "https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=400&h=400&fit=crop",
    description: "Fast wireless charger for all Qi devices.",
    category: "Electronics",
    stock: 55,
  },
  {
    name: "Aromatherapy Diffuser",
    price: 39.99,
    discount: 0,
    image: "https://images.unsplash.com/photo-1608501821300-4a99e79bba4b?w=400&h=400&fit=crop",
    description: "Ultrasonic essential oil diffuser.",
    category: "Home",
    stock: 35,
  },
  {
    name: "Casual Summer Dress",
    price: 54.99,
    discount: 20,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop",
    description: "Flowy floral print dress.",
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

