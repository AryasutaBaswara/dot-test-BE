// Ganti cara kita mengimpor express
import express = require("express");
const userService = require("../services/user.service");

// Sekarang kita bisa menggunakan 'express.Request' dan 'express.Response' dengan aman
exports.handleRegisterUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const newUser = await userService.registerUser(email, password, name);
    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Handle Login

exports.handleLoginUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { email, password } = req.body;
    const token = await userService.loginUser(email, password);

    res.status(200).json({
      message: "Login successful",
      token: token,
    });
  } catch (error: any) {
    // Gunakan status 401 Unauthorized untuk login gagal
    res.status(401).json({ message: error.message });
  }
};
