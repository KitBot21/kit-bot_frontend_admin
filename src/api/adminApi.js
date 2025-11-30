// src/api/adminApi.js
import axiosInstance from "./axiosInstance";

/** ================= 사용자 관리 ================= */

// 사용자 목록 조회
export const fetchUsers = async () => {
  const res = await axiosInstance.get("/api/admin/users");
  return res.data.content; // content 배열만 반환
};

// 사용자 정지
export const blockUser = (userId) =>
  axiosInstance.patch(`/api/admin/users/${userId}/block`);

// 사용자 정지 해제
export const activateUser = (userId) =>
  axiosInstance.patch(`/api/admin/users/${userId}/activate`);

/** ================= 게시글 관리 ================= */

// 게시글 목록 조회
export const fetchPosts = async () => {
  const res = await axiosInstance.get("/api/admin/posts");
  return res.data.content; // content 배열만 반환
};
// 게시글 언블라인드 해제
export const unblindPost = (postId) =>
  axiosInstance.patch(`/api/admin/posts/${postId}/unblind`);

// 게시글 소프트 삭제
export const softDeletePost = (postId) =>
  axiosInstance.delete(`/api/admin/posts/${postId}`);

// ⚠ 블라인드 처리 엔드포인트는 일반 게시글 API 쪽에 있을 거라서
// 스웨거 보고 URL 확인 후 이런 식으로 하나 더 추가하면 됨:
// export const blindPost = (postId) =>
//   axiosInstance.patch(`/api/posts/${postId}/blind`);
