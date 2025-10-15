// src/repositories/comment.repository.ts
const db = require("../db");

// Fungsi untuk menyimpan komentar baru
exports.createComment = async (
  text: string,
  authorId: number,
  postId: number
) => {
  const queryText =
    'INSERT INTO "Comment"(text, "authorId", "postId") VALUES($1, $2, $3) RETURNING *';
  const { rows } = await db.query(queryText, [text, authorId, postId]);
  return rows[0];
};

// Fungsi untuk mengambil semua komentar dari satu postingan
exports.findCommentsByPostId = async (postId: number) => {
  const queryText =
    'SELECT * FROM "Comment" WHERE "postId" = $1 ORDER BY "createdAt" ASC';
  const { rows } = await db.query(queryText, [postId]);
  return rows;
};

// Fungsi untuk mencari satu komentar berdasarkan ID-nya
// Ini penting untuk otorisasi (mengecek siapa pemilik komentar)
exports.findCommentById = async (commentId: number) => {
  const queryText = 'SELECT * FROM "Comment" WHERE id = $1';
  const { rows } = await db.query(queryText, [commentId]);
  return rows[0];
};

// Fungsi untuk mengubah teks komentar
exports.updateComment = async (commentId: number, text: string) => {
  const queryText = 'UPDATE "Comment" SET text = $1 WHERE id = $2 RETURNING *';
  const { rows } = await db.query(queryText, [text, commentId]);
  return rows[0];
};

// Fungsi untuk menghapus komentar
exports.deleteComment = async (commentId: number) => {
  const queryText = 'DELETE FROM "Comment" WHERE id = $1 RETURNING *';
  const { rows } = await db.query(queryText, [commentId]);
  return rows[0];
};
