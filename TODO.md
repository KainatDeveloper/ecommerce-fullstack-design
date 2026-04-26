# eCommerce Full-Stack Development - TODO

## Phase 1: Backend Completion
- [x] Create TODO.md
- [x] Create Cart Model (`backend/models/Cart.js`)
- [x] Create SaveForLater Model (`backend/models/SaveForLater.js`)
- [x] Create Auth Middleware (`backend/middleware/auth.js`)
- [x] Update Product Routes (GET by ID, PUT, DELETE, GET featured)
- [x] Create Cart Routes (`backend/routes/cartRoutes.js`)
- [x] Create SaveForLater Routes (`backend/routes/saveForLaterRoutes.js`)
- [x] Update Auth Routes (checkAuth, logout)
- [x] Update Server.js to register new routes

## Phase 2: Frontend Completion
- [x] Setup Toast Provider in main.jsx
- [x] Create Product Details Page
- [x] Create Login/Register Pages
- [x] Create Admin Panel
- [x] Update Home Page (Hero + Categories + Featured Products)
- [x] Update Navbar (search, auth state, mobile menu)
- [x] Update App.jsx (new routes, protected routes)
- [x] Update Cart Store (fix state updates)
- [x] Add Search functionality

## Phase 3: Integration & Polish
- [x] Seed sample products
- [x] Test all flows end-to-end
- [x] Ensure responsive design

## Phase 4: Reference UI Integration & Backend Compatibility
- [x] Clone and analyze reference marketplace UI repository
- [x] Copy reference components (Navbar, Footer, Home, Products, Cart, etc.)
- [x] Copy reference pages (signup, login, cart, saved, profile, product, home, orders, checkout)
- [x] Copy image assets from reference to frontend/public/
- [x] Update index.css with reference design system styles
- [x] Update main.jsx with reference structure
- [x] Update App.jsx with reference routing and layout
- [x] Fix backend field compatibility: `image` (single) vs `images` (array)
- [x] Fix backend field compatibility: `name` vs `username`
- [x] Fix auth store to use localStorage (backend lacks checkAuth/logout)
- [x] Fix cart store to use localStorage (backend cart endpoints not fully implemented)
- [x] Fix ContentMain.jsx image map for single image
- [x] Fix ContentMainForMobile.jsx carousel for single image
- [x] Fix CreateProductForm.jsx for single image upload
- [x] Fix all `.images?.[0]` references to `.image`
- [x] Fix all `authUser?.username` references to `authUser?.name`
- [x] Verify no remaining `.images` or `username` references in JSX
- [x] Fix missing `react-icons` dependency (installed package)
- [x] Remove unused `react-icons/si` import from CartPage.jsx

