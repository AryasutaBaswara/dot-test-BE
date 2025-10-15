// src/services/comment.service.ts
export {};
const commentRepository = require("../repositories/comment.repository");
const postRepository = require("../repositories/post.repository"); // Kita butuh ini untuk mengecek post

// Logika bisnis untuk membuat komentar baru
exports.createComment = async (
  text: string,
  authorId: number,
  postId: number
) => {
  // Aturan #1: Pastikan postingan yang mau dikomentari itu ada
  const post = await postRepository.findPostById(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  // Jika postingan ada, perintahkan repository untuk membuat komentar
  return commentRepository.createComment(text, authorId, postId);
};

// Logika bisnis untuk mendapatkan semua komentar di sebuah post
exports.getCommentsByPostId = async (postId: number) => {
  return commentRepository.findCommentsByPostId(postId);
};

// Logika bisnis untuk mengedit komentar
exports.updateComment = async (
  commentId: number,
  userId: number,
  text: string
) => {
  // 1. Cari dulu komentarnya
  const comment = await commentRepository.findCommentById(commentId);
  if (!comment) {
    throw new Error("Comment not found");
  }

  // 2. Aturan Keamanan: Pastikan yang mau mengedit adalah pemilik asli komentar
  if (comment.authorId !== userId) {
    throw new Error("You are not authorized to edit this comment");
  }

  // Jika semua aturan terpenuhi, perbarui komentar
  return commentRepository.updateComment(commentId, text);
};

// Logika bisnis untuk menghapus komentar
exports.deleteComment = async (commentId: number, userId: number) => {
  // 1. Cari dulu komentarnya
  const comment = await commentRepository.findCommentById(commentId);
  if (!comment) {
    throw new Error("Comment not found");
  }

  // 2. Aturan Keamanan: Pastikan yang mau menghapus adalah pemilik asli komentar
  if (comment.authorId !== userId) {
    throw new Error("You are not authorized to delete this comment");
  }

  // Jika semua aturan terpenuhi, hapus komentar
  return commentRepository.deleteComment(commentId);
};
