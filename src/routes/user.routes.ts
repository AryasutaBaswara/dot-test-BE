// src/routes/user.routes.ts

const { Router } = require("express");
const userController = require("../controllers/user.controller");

const userRoutes = Router();

// Ini aturannya:
// Jika ada request POST ke alamat /register, serahkan ke userController.handleRegisterUser
userRoutes.post("/register", userController.handleRegisterUser);
userRoutes.post("/login", userController.handleLoginUser);

module.exports = userRoutes;
