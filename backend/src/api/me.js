import express from "express";
import "dotenv/config";
import jwt from 'jsonwebtoken';
import pool from "../db/connect.js";


const router = express.Router()

router.get('/', async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({ success: false, message: "Не авторизован" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret-2025");

    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [decoded.id]);
    const user = rows[0];

    if (!user) {
      return res.json({ success: false, message: "Пользователь не найден" });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatarUrl: user.avatar,
        address: user.address
      }
    });
  } catch (err) {
    console.error("[/api/me] Ошибка проверки токена:", err);
    res.json({ success: false, message: "Невалидный или просроченный токен" });
  }
})

export default router