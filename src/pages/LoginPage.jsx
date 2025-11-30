// src/pages/LoginPage.jsx
import { Box, Paper, Stack, Typography } from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../contexts/AuthContext.jsx";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential; // 구글에서 준 토큰

      // 백엔드 로그인 호출
      const res = await axiosInstance.post("/api/auth/google/login", {
        idToken,
      });

      // 스웨거 예시 응답 구조
      // { accessToken: "...", user: { id, email, username, role, usernameSet } }
      login(res.data); // AuthContext.login 에서 { accessToken, user } 받게 해둠
      nav("/"); // 기본 관리자 메인으로 이동
    } catch (e) {
      console.error(e);
      alert("로그인 실패");
    }
  };

  const handleGoogleError = () => {
    alert("Google 로그인 실패");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper sx={{ p: 4, width: 360 }}>
        <Stack spacing={3} alignItems="center">
          <Typography variant="h5">KIT-Bot 관리자 로그인</Typography>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </Stack>
      </Paper>
    </Box>
  );
}
