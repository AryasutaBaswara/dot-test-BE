// src/routes/comment.routes.ts
export {};
const { Router } = require("express");
const commentController = require("../controllers/comment.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const commentRoutes = Router();

// =======================================================
// Aturan Menu untuk Komentar
// =======================================================

// POST /api/posts/:postId/comments -> Buat komentar baru di sebuah post
// WAJIB login, jadi kita pasang penjaga.
commentRoutes.post(
  "/posts/:postId/comments",
  authMiddleware.authenticateToken,
  commentController.handleCreateComment
);

// GET /api/posts/:postId/comments -> Lihat semua komentar di sebuah post
// Siapa saja boleh lihat, jadi TIDAK perlu penjaga.
commentRoutes.get(
  "/posts/:postId/comments",
  commentController.handleGetCommentsByPostId
);

// PATCH /api/comments/:commentId -> Edit sebuah komentar
// WAJIB login.
commentRoutes.patch(
  "/comments/:commentId",
  authMiddleware.authenticateToken,
  commentController.handleUpdateComment
);

// DELETE /api/comments/:commentId -> Hapus sebuah komentar
// WAJIB login.
commentRoutes.delete(
  "/comments/:commentId",
  authMiddleware.authenticateToken,
  commentController.handleDeleteComment
);

module.exports = commentRoutes;
