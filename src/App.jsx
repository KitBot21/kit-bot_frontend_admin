// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import Layout from "./components/Layout.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import UserManagementPage from "./pages/UserManagementPage.jsx";
import PostManagementPage from "./pages/PostManagementPage.jsx";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 로그인 화면 */}
          <Route path="/login" element={<LoginPage />} />

          {/* 로그인 이후 관리자 레이아웃 */}
          <Route
            element={
              <AdminRoute>
                <Layout />
              </AdminRoute>
            }
          >
            {/* 사이드바에서 이동할 페이지들 */}
            <Route path="/users" element={<UserManagementPage />} />
            <Route path="/posts" element={<PostManagementPage />} />

            {/* 기본 루트는 사용자 관리로 리다이렉트 */}
            <Route path="/" element={<Navigate to="/users" replace />} />
          </Route>

          {/* 나머지는 전부 루트로 → 결국 /users로 감 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
