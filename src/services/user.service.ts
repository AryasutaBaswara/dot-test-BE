// src/services/user.service.ts
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/user.repository");

// Ini adalah "resep" atau logika bisnis untuk registrasi
exports.registerUser = async (
  email: string,
  password: string,
  name?: string
) => {
  // 1. Perintah pertama Koki: "Petugas Gudang, tolong cek apakah email ini sudah ada."
  const existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) {
    // Jika ada, Koki akan marah dan melempar error
    throw new Error("Email already in use");
  }

  // 2. Koki akan mengamankan password dengan menghancurkannya (hashing)
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Perintah kedua Koki: "Petugas Gudang, tolong simpan user baru ini dengan password aman."
  const newUser = await userRepository.createUser(email, hashedPassword, name);

  return newUser;

  // login User
};

exports.loginUser = async (email: string, password: string) => {
  // 1. Cari user berdasarkan email
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    // Jika user tidak ditemukan, lempar error
    throw new Error("Invalid email or password");
  }

  // 2. Bandingkan password yang diberikan dengan password di database
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    // Jika password salah, lempar error
    throw new Error("Invalid email or password");
  }

  // 3. Jika semuanya cocok, buat "stempel" (JWT)
  const token = jwt.sign(
    { id: user.id, email: user.email }, // Payload: informasi yang disimpan di dalam token
    process.env.JWT_SECRET, // Tinta Rahasia dari .env
    { expiresIn: "1h" } // Token akan kedaluwarsa dalam 1 jam
  );

  return token;
};
