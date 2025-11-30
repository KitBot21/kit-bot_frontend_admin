// src/pages/PostManagementPage.jsx
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
import {
  fetchPosts,
  unblindPost,
  softDeletePost,
  // blindPost (게시글 API 확인 후 추가)
} from "../api/adminApi";

export default function PostManagementPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchPosts();
      setPosts(data);
    } catch (e) {
      console.error(e);
      alert("게시글 목록 조회 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleUnblind = async (id) => {
    await unblindPost(id);
    await load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("해당 게시글을 삭제하시겠습니까?")) return;
    await softDeletePost(id);
    await load();
  };

  // 블라인드 처리 엔드포인트 확인 후 사용
  // const handleBlind = async (id) => {
  //   await blindPost(id);
  //   await load();
  // };

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
        관리자 게시글 관리
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>게시글 ID</TableCell>
              <TableCell>제목</TableCell>
              <TableCell>작성자</TableCell>
              <TableCell>블라인드 여부</TableCell>
              <TableCell>관리</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.id}</TableCell>
                <TableCell>{p.title}</TableCell>
                <TableCell>{p.authorNickname}</TableCell>
                <TableCell>
                  {/* 응답에 "blinded" (boolean) 같은 필드가 있다고 가정 */}
                  <Chip
                    label={p.blinded ? "블라인드" : "노출"}
                    color={p.blinded ? "warning" : "success"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    {p.blinded && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleUnblind(p.id)}
                      >
                        언블라인드
                      </Button>
                    )}

                    {/* 블라인드 엔드포인트 생기면 이렇게 쓰면 됨
                    {!p.blinded && (
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleBlind(p.id)}
                      >
                        블라인드
                      </Button>
                    )} */}

                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(p.id)}
                    >
                      삭제
                    </Button>
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
