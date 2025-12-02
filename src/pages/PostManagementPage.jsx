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
import { fetchPosts, unblindPost, softDeletePost } from "../api/adminApi";
import PostDetailDialog from "../components/PostDetailDialog.jsx"; // ✅ 새로 만들 컴포넌트

export default function PostManagementPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ 상세보기용
  const [selectedPostId, setSelectedPostId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchPosts({ status: "ALL", page: 0, size: 100 });
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
    try {
      await unblindPost(id);
      await load();
    } catch (e) {
      console.error(e);
      alert("언블라인드 처리 실패");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("해당 게시글을 삭제하시겠습니까?")) return;
    try {
      await softDeletePost(id);
      await load();
    } catch (e) {
      console.error(e);
      alert("게시글 삭제 실패");
    }
  };

  const formatDateTime = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${dd} ${hh}:${mm}`;
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
        관리자 게시글 관리
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>제목</TableCell>
              <TableCell>내용</TableCell>
              <TableCell align="center">추천/댓글/신고</TableCell>
              <TableCell>상태</TableCell>
              <TableCell>블라인드 사유</TableCell>
              <TableCell>작성일</TableCell>
              <TableCell>관리</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map((p) => {
              const status = (p.status || "").toUpperCase();
              const isActive = status === "ACTIVE";
              const isBlinded = status === "BLINDED";
              const isDeleted = status === "DELETED";

              let chipLabel = "알 수 없음";
              let chipColor = "default";

              if (isActive) {
                chipLabel = "노출";
                chipColor = "success";
              } else if (isBlinded) {
                chipLabel = "블라인드";
                chipColor = "warning";
              } else if (isDeleted) {
                chipLabel = "삭제됨";
                chipColor = "default";
              }

              return (
                <TableRow key={p.id}>
                  <TableCell>{p.title}</TableCell>
                  <TableCell>{p.content}</TableCell>

                  <TableCell align="center">
                    {p.recommendCount} / {p.commentCount} / {p.reportCount}
                  </TableCell>

                  <TableCell>
                    <Chip label={chipLabel} color={chipColor} size="small" />
                  </TableCell>

                  <TableCell>{p.blindedReason || "-"}</TableCell>

                  <TableCell>{formatDateTime(p.createdAt)}</TableCell>

                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      {/* ✅ 상세보기 버튼 */}
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setSelectedPostId(p.id)}
                      >
                        상세보기
                      </Button>

                      {isBlinded && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleUnblind(p.id)}
                        >
                          언블라인드
                        </Button>
                      )}

                      {!isDeleted && (
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => handleDelete(p.id)}
                        >
                          삭제
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

      {/* ✅ 게시글 상세 + 댓글/대댓글 모달 */}
      <PostDetailDialog
        open={!!selectedPostId}
        postId={selectedPostId}
        onClose={() => setSelectedPostId(null)}
      />
    </Box>
  );
}
