# 🚀 TaxTrace Frontend Manifest

## 🛠 Tech Stack
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS
- **State Management:** React Context API (Auth)
- **API Client:** Axios with Interceptors
- **Routing:** React Router DOM

## 📂 Architecture
- `/src/api`: Centralized Axios configuration for the Render backend.
- `/src/context`: AuthContext for persistent login sessions.
- `/src/pages`: Functional views (Login, Register, Dashboard, Scanner).

## 📡 Backend Integration
- **Base URL:** https://tax-trace-backend-1.onrender.com/api
- **Auth Strategy:** JWT stored in LocalStorage.

## 🔐 Authentication Logic
- **AuthContext.jsx**: Manages global user state.
- **Functions**: `login(token)`, `logout()`.
- **Persistence**: Token is saved in `localStorage` to keep user logged in on refresh.

## 📦 Installed Packages
- `axios`: For API calls.
- `react-router-dom`: For page navigation.

## 🎨 Styling
- **Tailwind CSS**: Configured for utility-first styling.
- **Directives**: Added to `src/index.css`.
- **Config**: Scans `src` folder for `.js` and `.jsx` files.

## 📦 Installed Packages (Dev)
- `tailwindcss`, `postcss`, `autoprefixer`: For modern CSS processing.

## 📄 Pages Implemented
- **Register.jsx**: 
  - Uses 'Controlled Components' for form handling.
  - Integrates with `POST /auth/register`.
  - Automatically logs user in and redirects on success.

## ⚙️ Logic Noted
- **Spread Operator (`...formData`)**: Used in `setFormData` to update only one field while keeping others intact (very important in React state!).

## 💡 Best Practices Implemented
- **Loading States**: Buttons are disabled during API calls to prevent "double-tap" duplicate entries.
- **Error Handling**: Centralized error state to display backend validation messages to users.
- **Input Validation**: Client-side checks (e.g., password length) to reduce unnecessary API calls.
- **UX**: Use of `finally` block in try/catch to ensure loading stops regardless of the outcome.

## 📄 Pages Implemented
- **Login.jsx**:
  - Handles user authentication.
  - Uses `Link` from `react-router-dom` for internal navigation (no page reload).
  - Maintains consistent UI/UX with the Register page.

## 🏗 Key Components
- **react-router-dom (Routes)**: Defines the mapping between URLs and UI components. 

## 📄 Pages Implemented
- **Scanner.jsx**:
  - Implements a two-step "Wizard" flow (Lookup -> Confirmation).
  - Handles barcode-to-product resolution via backend.
  - Submits purchase data to `/scans` for tax calculation.

## ⚙️ Logic Noted
- **Step Pattern**: Using a `step` state to conditionally render different parts of the same page. This keeps the UI clean for the user.
- **Data Casting**: Ensuring strings from inputs are converted to `Number()` before sending to the backend (crucial for math operations).

## 📷 Hardware Integration (V3 - Stable)
- **Library**: `@zxing/browser` & `@zxing/library`.
- **Implementation**: Used `useRef` to attach the camera stream to a `video` element.
- **Scanning Engine**: `BrowserMultiFormatReader` - supports multiple barcode formats (EAN-13, UPC, etc.).
- **Lifecycle**: Used `codeReader.reset()` in the cleanup function to ensure the camera hardware is released correctly.

## 🛠 Key Concepts
- **React Refs (`useRef`)**: Accesses the underlying DOM `<video>` tag directly for the ZXing engine.
- **Overlay UI**: Created a CSS-based viewfinder box to help users center their barcodes.

## 🧱 UI Architecture
- **Navbar.jsx**: Sticky navigation component that conditionally shows links based on `AuthContext`.
- **Layout Logic**: Navbar is placed outside `<Routes>` so it persists across page transitions.

## 🐛 Bug Fixes
- **API Race Condition**: Added `isScanning` boolean flag to `Scanner.jsx` to prevent multiple simultaneous calls to the lookup endpoint.
- **Error Throttling**: Used `setTimeout` to pause scanning after an error, giving users time to read the feedback.

## 📊 Analytics Module
- **Dashboard.jsx**: Fetches and visualizes economic data.
- **Promise.all**: Used for concurrent API requests to optimize load times.
- **Data Visualization**: Converts raw GST totals into "Minutes" and "Days" using the user's hourly rate calculation from the backend.
- **Comparison Logic**: Displays relative tax burden across different income brackets.

## 🛡️ Security & Routing
- **ProtectedRoute.jsx**: A Higher-Order Component (HOC) that guards private routes.
- **Auto-Redirect**: Users attempting to access `/dashboard` without a token are redirected to `/login`.

## ✅ V1 Checklist Completed
1. [x] Project Foundation (Tailwind + Axios)
2. [x] Auth System (Register/Login + JWT Storage)
3. [x] Hardware Scanner (ZXing Camera Integration)
4. [x] Analytics Dashboard (Daily/Monthly Tax Stats)
5. [x] Responsive Design (Mobile-friendly Layout)

## 📲 Input Strategy
- **Hybrid Scanning**: Implemented a choice between Camera and Manual Input.
- **Unified Logic**: Both inputs route through the `processLookup` function to minimize duplicate code.
- **Graceful Fail**: Added a "Cancel & Type Manually" option inside the camera view.

## 🖼️ UI/UX Enhancements
- **Product Visuals**: Added `<img>` tag to Step 2 of the Scanner to display the product image returned from the backend.
- **Image Fallback**: Implemented a placeholder icon for items that do not have an image URL in the database.
- **Data Persistence**: Ensured `image` URL is included in the `/scans` POST payload to populate the local database on first scan.