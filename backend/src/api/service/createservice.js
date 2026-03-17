import express from "express";
import pool from "../../db/connect.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { userId, title, description, needed, status } = req.body;

  if (!userId || !title || !description || !needed) {
    console.log("Отсутствуют параметры запроса");
    res.json({ success: false, message: "Введите все необходимые данные" });
  }
  const date = new Date();

  try {
      const query = `INSERT INTO services (userid, title, description, needed, created_at, status)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, userId, title, description, needed, created_at, status, updated_at`
   
    const values = [userId, title, description, needed, date, status];
    const dbResult = await pool.query(query, values);
    const services = dbResult.rows[0];

    res.json({ success: true, message: "Запись добавлена. Ожидает модерации", });

  } catch (error) {
    console.log("Ошибка добавления", error);
    res.json({
      success: false,
      message: "Ошибка добавления новой записи. Попробуйте еще раз",
    });
  }
});

export default router;
