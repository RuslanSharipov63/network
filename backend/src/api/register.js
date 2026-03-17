import express from "express";
import "dotenv/config";
import multer from "multer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path, { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import crypto from "crypto";
import pool from "../db/connect.js";

const app = express();
const router = express.Router()


// Для __dirname в ES-модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// backend/src/ → поднимаемся на 2 уровня: src → backend → project-root
const PROJECT_ROOT = resolve(__dirname, "..", "..", "..",);

// пкть к frontend/public/uploads/avatars — на одном уровне с backend/
const AVATAR_UPLOAD_DIR = path.join(
  PROJECT_ROOT,
  "frontend",
  "public",
  "uploads",
  "avatars"
);

await fs.mkdir(AVATAR_UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, AVATAR_UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (![".png", ".jpg", ".jpeg", ".gif", ".webp"].includes(ext)) {
      return cb(new Error("Недопустимое расширение файла"), null);
    }
    const uniqueSuffix = `${Date.now()}-${crypto
      .randomBytes(8)
      .toString("hex")}`;
    cb(null, `avatar-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Только изображения разрешены!"), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/", async (req, res) => {
  const form = new multer({ storage: multer.memoryStorage() }).single("avatar");

  form(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.json({
        message: "Ошибка загрузки файла: " + err.message,
        success: false,
      });
    }
    if (err) {
      return res.json({ message: "Некорректный файл", success: false });
    }
    // Теперь req.body и req.file доступны — но файл в памяти
    const { email, password, username, address } = req.body;
    const avatarFile = req.file; // ← буфер в памяти, не файл на диске

    try {
      if (!email || !password || !username) {
        // Очищаем память (если был файл)
        if (avatarFile) {
          avatarFile.buffer = null;
        }
        return res.json({
          message: "Email, пароль и имя обязательны",
          success: false,
        });
      }

      // Проверка email и имени пользователя
      const { rows: existing } = await pool.query(
        "SELECT id, email, username FROM users WHERE email = $1 OR username = $2",
        [email, username]
      );

      const existingUser = existing[0];
      if (existingUser) {
        if (existingUser.email === email) {
          return res.json({ message: "Email уже занят", success: false });
        }
        if (existingUser.username === username) {
          return res.json({
            message: "Имя пользователя уже занято",
            success: false,
          });
        }
      }

      //  Хэширование пароля
      const hashedPassword = await bcrypt.hash(password, 12);

      //  сохраняем аватар на диск (если есть)
      let avatarUrl = "/uploads/avatars/defaultavatar.png"; // заглушка по умолчанию

      if (avatarFile) {
        // Проверяем тип
        if (!avatarFile.mimetype.startsWith("image/")) {
          return res.json({
            message: "Только изображения разрешены!",
            success: false,
          });
        }
        if (avatarFile.size > 5 * 1024 * 1024) {
          return res.json({
            message: "Файл слишком большой (макс. 5 МБ)",
            success: false,
          });
        }

        // Генерируем имя
        const ext = path.extname(avatarFile.originalname).toLowerCase();
        const safeExts = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
        if (!safeExts.includes(ext)) {
          return res.json({
            message: "Недопустимое расширение файла",
            success: false,
          });
        }

        const filename = `avatar_${Date.now()}_${crypto
          .randomBytes(6)
          .toString("hex")}${ext}`;
        const filePath = path.join(AVATAR_UPLOAD_DIR, filename);

        // ✅ Пишем файл на диск
        await fs.writeFile(filePath, avatarFile.buffer);
        avatarUrl = `/uploads/avatars/${filename}`;
      }

      // Вставка в БД
      // 🔹 ШАГ 6: Запись в БД
      const { rows } = await pool.query(
        `INSERT INTO users (email, password, username, address, avatar)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, email, username, address, avatar;`,
        [email, hashedPassword, username, address || null, avatarUrl]
      );

      const user = rows[0];
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || "dev-secret-2025",
        { expiresIn: "7d" }
      );

      // Устанавливаем httpOnly cookie — на сервере!
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", // или 'lax' — если нужен редирект с внешних сайтов
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней в мс
        path: "/",
      });

      //  В ответе НЕ отправляем токен в теле!
      res.json({
        success: true,
        message: "Регистрация прошла успешно",
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          address: user.address,
          avatarUrl: user.avatar,
        },
      });
    } catch (err) {
      console.error("[Ошибка регистрации]", err);
      res.json({ message: "Серверная ошибка", success: false });
    }
  });
});

export default router