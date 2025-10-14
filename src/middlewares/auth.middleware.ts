import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from "express";
const jwt = require("jsonwebtoken");

interface AuthenticatedRequest extends ExpressRequest {
  user?: any; // Properti 'user' ini opsional
}

exports.authenticateToken = (
  req: AuthenticatedRequest,
  res: ExpressResponse,
  next: NextFunction
) => {
  // 1. Ambil header 'authorization' dari request.
  const authHeader = req.headers["authorization"];
  // Token dikirim dengan format "Bearer TOKEN_PANJANG", jadi kita ambil bagian keduanya.
  const token = authHeader && authHeader.split(" ")[1];

  // 2. Jika tidak ada token sama sekali, langsung tolak.
  if (token == null) {
    return res.sendStatus(401); // 401 Unauthorized
  }

  // 3. Verifikasi token menggunakan "tinta rahasia" kita.
  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    // Jika token salah atau sudah kedaluwarsa, tolak.
    if (err) {
      return res.sendStatus(403); // 403 Forbidden
    }

    // 4. Jika token valid, "tempelkan" data user ke dalam objek request.
    // Ini agar controller nanti bisa tahu siapa yang membuat request.
    req.user = user;

    // 5. Izinkan request untuk melanjutkan ke langkah berikutnya (controller).
    next();
  });
};
