// src/repositories/user.repository.ts
const db = require("../db");

// Fungsi untuk mencari satu user berdasarkan emailnya
// Ini akan kita gunakan untuk mengecek apakah user sudah terdaftar
exports.findUserByEmail = async (email: string) => {
  // Perintah SQL untuk memilih user berdasarkan kolom email
  const queryText = 'SELECT * FROM "User" WHERE email = $1';
  // Menjalankan query, [email] adalah nilai untuk $1
  const { rows } = await db.query(queryText, [email]);
  // Mengembalikan user pertama yang ditemukan (atau undefined jika tidak ada)
  return rows[0];
};

// Fungsi untuk membuat user baru di database
exports.createUser = async (
  email: string,
  hashedPassword: string,
  name?: string
) => {
  // Perintah SQL untuk memasukkan data baru ke tabel User
  // RETURNING ... akan mengembalikan data yang baru saja dibuat
  const queryText =
    'INSERT INTO "User"(email, password, name) VALUES($1, $2, $3) RETURNING id, email, name';
  const values = [email, hashedPassword, name];
  // Menjalankan query dengan data yang akan dimasukkan
  const { rows } = await db.query(queryText, values);
  // Mengembalikan user yang baru saja dibuat
  return rows[0];
};
