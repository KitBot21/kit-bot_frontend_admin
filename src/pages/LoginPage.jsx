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
      const idToken = credentialResponse.credential;

      const res = await axiosInstance.post("/api/auth/google/login", {
        idToken,
      });

      console.log("백엔드 응답:", res.data); // 이거 추가

      login(res.data);
      nav("/");
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
