import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Chip,
  CircularProgress,
  Box,
} from "@mui/material";
import { fetchPostDetail, softDeleteComment } from "../api/adminApi";

// 댓글 트리 재귀 렌더링용
function CommentItem({ node, depth, onSoftDelete }) {
  const isDeleted = (node.status || "").toLowerCase() === "deleted";
  const isBlinded = (node.status || "").toLowerCase() === "blinded";

  return (
    <Box sx={{ pl: depth * 2, mb: 1 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {/* authorNickname / authorName 중 백엔드 필드에 맞춰서 사용 */}
          {node.authorNickname || node.authorName || node.authorId}
        </Typography>

        <Chip
          label={node.status}
          size="small"
          color={isDeleted ? "default" : isBlinded ? "warning" : "success"}
          variant="outlined"
        />

        <Typography variant="caption" color="text.secondary">
          신고 {node.reportCount ?? 0} · 추천 {node.recommendCount ?? 0}
        </Typography>

        {!isDeleted && (
          <Button
            size="small"
            color="error"
            variant="text"
            onClick={() => onSoftDelete(node.id)}
          >
            댓글 삭제
          </Button>
        )}
      </Stack>

      <Typography
        variant="body2"
        sx={{
          mt: 0.5,
          whiteSpace: "pre-wrap",
          textDecoration: isDeleted ? "line-through" : "none",
          color: isDeleted ? "text.disabled" : "text.primary",
        }}
      >
        {node.content}
      </Typography>

      {/* 자식(대댓글) 재귀 렌더링 */}
      {node.children &&
        node.children.map((child) => (
          <CommentItem
            key={child.id}
            node={child}
            depth={depth + 1}
            onSoftDelete={onSoftDelete}
          />
        ))}
    </Box>
  );
}

export default function PostDetailDialog({ open, postId, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  // 상세 조회
  useEffect(() => {
    if (!open || !postId) return;

    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchPostDetail(postId);
        setDetail(data);
      } catch (e) {
        console.error(e);
        alert("게시글 상세 조회 실패");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [open, postId]);

  // 댓글 soft delete 처리 + 로컬 상태 갱신
  const handleSoftDeleteComment = async (commentId) => {
    if (!window.confirm("해당 댓글을 삭제하시겠습니까?")) return;
    try {
      await softDeleteComment(commentId, "관리자 삭제");
      // detail.comments 트리에서 해당 노드 status를 DELETED로 변경
      setDetail((prev) => {
        if (!prev) return prev;

        const cloneTree = (nodes) =>
          nodes.map((n) => {
            if (n.id === commentId) {
              return {
                ...n,
                status: "DELETED",
              };
            }
            if (n.children && n.children.length > 0) {
              return {
                ...n,
                children: cloneTree(n.children),
              };
            }
            return n;
          });

        return {
          ...prev,
          comments: cloneTree(prev.comments || []),
        };
      });
    } catch (e) {
      console.error(e);
      alert("댓글 삭제 실패");
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>게시글 상세</DialogTitle>
      <DialogContent dividers>
        {loading || !detail ? (
          <Stack alignItems="center" py={4}>
            <CircularProgress />
          </Stack>
        ) : (
          <>
            {/* ====== 게시글 기본 정보 ====== */}
            <Stack spacing={1} mb={3}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="h6">{detail.title}</Typography>
                <Chip
                  label={detail.status}
                  size="small"
                  color={
                    detail.status === "ACTIVE"
                      ? "success"
                      : detail.status === "BLINDED"
                      ? "warning"
                      : "default"
                  }
                />
              </Stack>

              <Typography variant="body2" color="text.secondary">
                작성자: {detail.authorNickname || detail.authorId}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                추천 {detail.recommendCount ?? 0} · 댓글{" "}
                {detail.commentCount ?? 0} · 신고 {detail.reportCount ?? 0}
              </Typography>

              {detail.blindedReason && (
                <Typography variant="body2" color="error">
                  블라인드 사유: {detail.blindedReason}
                </Typography>
              )}

              <Typography
                variant="body1"
                sx={{ mt: 1, whiteSpace: "pre-wrap" }}
              >
                {detail.content}
              </Typography>
            </Stack>

            {/* ====== 댓글 / 대댓글 ====== */}
            <Typography variant="subtitle1" gutterBottom>
              댓글 ({detail.comments?.length ?? 0})
            </Typography>

            {(!detail.comments || detail.comments.length === 0) && (
              <Typography variant="body2" color="text.secondary">
                댓글이 없습니다.
              </Typography>
            )}

            {detail.comments &&
              detail.comments.map((c) => (
                <CommentItem
                  key={c.id}
                  node={c}
                  depth={0}
                  onSoftDelete={handleSoftDeleteComment}
                />
              ))}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>닫기</Button>
      </DialogActions>
    </Dialog>
  );
}
