export {};
const express = require("express");
const userRoutes = require("./routes/user.routes");

const app = express();
const PORT = 3000;

// Middleware penting agar aplikasi bisa membaca body dalam format JSON
app.use(express.json());

// Arahkan semua request yang diawali '/api/users' ke userRoutes
// Jadi, URL lengkap untuk register adalah POST /api/users/register
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
