import express from 'express';
import pool from "../../db/connect.js";
import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email и пароль обязательны" });
    }

    try {
        const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ success: false, message: "Неверный email или пароль" });
        }
        if (user.role !== 'admin') {
            return res.status(401).json({ success: false, message: "У вас нет доступа." });
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ success: false, message: "Неверный email или пароль" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || "dev-secret-2025",
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        });

        res.json({
            success: true,
            message: "Вход выполнен",
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                avatarUrl: user.avatar,
                address: user.address,
                role: user.role
            },
        });
    } catch (err) {
        console.error("Ошибка входа", err);
        res.status(500).json({ success: false, message: "Серверная ошибка" });
    }

})

export default router;