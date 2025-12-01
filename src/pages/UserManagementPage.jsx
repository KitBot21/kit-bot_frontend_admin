// src/pages/UserManagementPage.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Chip,
  Button,
  CircularProgress,
  Typography,
  Stack,
} from "@mui/material";
import { fetchUsers, blockUser, activateUser } from "../api/adminApi";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 사용자 목록 불러오기
  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();

      // 🔹 admin 계정은 목록에서 제외
      const filtered = data.filter(
        (u) => (u.role || "").toLowerCase() !== "admin"
      );
      setUsers(filtered);
    } catch (e) {
      console.error(e);
      alert("사용자 목록 조회 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // 정지
  const handleBlock = async (id) => {
    try {
      await blockUser(id);
      await load();
    } catch (e) {
      console.error(e);
      alert("사용자 정지 실패");
    }
  };

  // 정지 해제
  const handleActivate = async (id) => {
    try {
      await activateUser(id);
      await load();
    } catch (e) {
      console.error(e);
      alert("사용자 정지 해제 실패");
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        관리자 사용자 관리
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>구글 email</TableCell>
              <TableCell>학교 email</TableCell>
              <TableCell>이름/닉네임</TableCell>
              <TableCell>역할</TableCell>
              <TableCell>상태</TableCell>
              <TableCell>관리</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => {
              const isBlocked = (u.status || "").toLowerCase() === "blocked";

              return (
                <TableRow key={u.id}>
                  <TableCell>{u.googleEmail}</TableCell>
                  <TableCell>{u.schoolEmail}</TableCell>
                  <TableCell>{u.username}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell>
                    <Chip
                      label={isBlocked ? "정지" : "정상"}
                      color={isBlocked ? "error" : "success"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      {isBlocked ? (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleActivate(u.id)}
                        >
                          정지 해제
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          onClick={() => handleBlock(u.id)}
                        >
                          정지
                        </Button>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
