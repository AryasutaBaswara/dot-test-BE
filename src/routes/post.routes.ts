// src/routes/post.routes.ts
//  // Mencegah error 'redeclare block-scoped variable'
const { Router } = require("express");
const postController = require("../controllers/post.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const postRoutes = Router();

// =======================================================
// Aturan Menu untuk Postingan
// =======================================================

// GET /api/posts -> Lihat semua postingan
// Siapa saja boleh lihat, jadi TIDAK perlu penjaga.
postRoutes.get("/", postController.handleGetAllPosts);

// POST /api/posts -> Buat postingan baru
// WAJIB punya token, jadi kita tempatkan 'authenticateToken' SEBELUM controller.
postRoutes.post(
  "/",
  authMiddleware.authenticateToken,
  postController.handleCreatePost
);

// PATCH /api/posts/:id -> Edit postingan
// WAJIB punya token. Penjaga akan memeriksa tokennya dulu.
postRoutes.patch(
  "/:id",
  authMiddleware.authenticateToken,
  postController.handleUpdatePost
);

// DELETE /api/posts/:id -> Hapus postingan
// WAJIB punya token. Penjaga akan memeriksa tokennya dulu.
postRoutes.delete(
  "/:id",
  authMiddleware.authenticateToken,
  postController.handleDeletePost
);

module.exports = postRoutes;
