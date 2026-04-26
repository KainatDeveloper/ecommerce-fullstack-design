import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, Component } from "react";
import { useAuthStore } from "./stores/auth.store";
import { useProductStore } from "./stores/product.store";

// Layout Components
import Header from "./components/navbar/header";
import HeaderForMobile from "./components/navbar/HeaderForMobile";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/Footer/Footer";

// Pages
import HomePage from "./pages/HomePage";
import ProductListPage from "./pages/ProductListPage";
import DetailPage from "./pages/DetailPage";
import AdminPage from "./pages/AdminPage";

// Misc
import { Toaster } from "react-hot-toast";
import CartPage from "./pages/CartPage";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: 40, 
          background: "#fee", 
          color: "#c00",
          fontFamily: "monospace",
          minHeight: "100vh"
        }}>
          <h1>Something went wrong:</h1>
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {this.state.error?.toString()}
            {"\n\n"}
            {this.state.error?.stack}
          </pre>
          <p>Check the browser console (F12) for more details.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const location = useLocation();
  const { authUser, checkAuth, loader } = useAuthStore();
  const { loading, getAllProducts } = useProductStore();

  useEffect(() => {
    // Check auth first
    checkAuth();
    
    // Load products in background (don't block UI)
    getAllProducts().catch((error) => {
      console.error("Background product load failed:", error);
    });
  }, []);

  // Only show loading while checking auth, not while loading products
  if (loader) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-[#f8f9fc]">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        <Header />
        {location.pathname !== "/cart" && <Navbar />}

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/cart"
              element={authUser ? <CartPage /> : <Navigate to={"/"} />}
            />
            <Route
              path="/admin"
              element={
                authUser?.role === "admin" ? <AdminPage /> : <Navigate to="/" />
              }
            />
            <Route path="/product/:id?" element={<DetailPage />} />
            <Route path="/category/:category?" element={<ProductListPage />} />
            <Route path="/search/:keyword?" element={<ProductListPage />} />
          </Routes>
        </main>

        <Footer />
        <Toaster position="top-center" />
      </div>
    </ErrorBoundary>
  );
}

export default App;
