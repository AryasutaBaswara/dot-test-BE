// src/repositories/post.repository.ts
export {};
const db = require("../db");

// Fungsi untuk menyimpan postingan baru
exports.createPost = async (
  title: string,
  content: string,
  authorId: number
) => {
  const queryText =
    'INSERT INTO "Post"(title, content, "authorId") VALUES($1, $2, $3) RETURNING *';
  const { rows } = await db.query(queryText, [title, content, authorId]);
  return rows[0];
};

// Fungsi untuk mengambil semua postingan
exports.findAllPosts = async () => {
  const queryText = 'SELECT * FROM "Post" ORDER BY "createdAt" DESC';
  const { rows } = await db.query(queryText, []);
  return rows;
};

// Fungsi untuk mencari satu postingan berdasarkan ID-nya
exports.findPostById = async (postId: number) => {
  const queryText = 'SELECT * FROM "Post" WHERE id = $1';
  const { rows } = await db.query(queryText, [postId]);
  return rows[0];
};

// Fungsi untuk mengubah data postingan
exports.updatePost = async (postId: number, title: string, content: string) => {
  const queryText =
    'UPDATE "Post" SET title = $1, content = $2 WHERE id = $3 RETURNING *';
  const { rows } = await db.query(queryText, [title, content, postId]);
  return rows[0];
};

// Fungsi untuk menghapus postingan
exports.deletePost = async (postId: number) => {
  const queryText = 'DELETE FROM "Post" WHERE id = $1 RETURNING *';
  const { rows } = await db.query(queryText, [postId]);
  return rows[0];
};
