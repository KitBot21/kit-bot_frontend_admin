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

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
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

  const handleBlock = async (id) => {
    await blockUser(id);
    await load();
  };

  const handleActivate = async (id) => {
    await activateUser(id);
    await load();
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
              <TableCell>사용자 ID</TableCell>
              <TableCell>이메일</TableCell>
              <TableCell>이름/닉네임</TableCell>
              <TableCell>상태</TableCell>
              <TableCell>관리</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.id}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.username}</TableCell>
                <TableCell>
                  {/* 응답에 status(예: "BLOCKED","ACTIVE") 같은 필드가 있다고 가정 */}
                  <Chip
                    label={u.status === "BLOCKED" ? "정지" : "정상"}
                    color={u.status === "BLOCKED" ? "error" : "success"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    {u.status === "BLOCKED" ? (
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
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
