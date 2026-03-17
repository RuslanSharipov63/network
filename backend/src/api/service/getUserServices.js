import express from "express";
import pool from "../../db/connect.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    console.log("Отсутствует id");
    res.json({ success: false, message: "Ошибка сервера" });
  }
   const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ success: false, message: "Пользователя не существует" });
    }

  try {
   const { rows } = await pool.query("SELECT * FROM services WHERE userid = $1 ORDER BY id DESC", [id]);

    const services = rows;
    res.json({ success: true, services });
  } catch (error) {
    console.log("Ошибка получения всех статей", error);
    res.json({
      success: false,
      message: "Ошибка сервера. Попробуйте еще раз",
    });
  }
});

export default router;
