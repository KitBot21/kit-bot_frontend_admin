// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import UserManagementPage from "./pages/UserManagementPage.jsx";
import PostManagementPage from "./pages/PostManagementPage.jsx";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/users"
            element={
              <AdminRoute>
                <UserManagementPage />
              </AdminRoute>
            }
          />
          <Route
            path="/posts"
            element={
              <AdminRoute>
                <PostManagementPage />
              </AdminRoute>
            }
          />
          {/* 기본 루트는 사용자 관리로 보내기 */}
          <Route
            path="/"
            element={
              <AdminRoute>
                <UserManagementPage />
              </AdminRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
