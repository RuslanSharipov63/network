import express from "express";
import pool from "../../db/connect.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { id, userId, title, description, needed, status } = req.body;

  if (!userId || !title || !description || !needed) {
    console.log("Отсутствуют параметры запроса");
    res.json({ success: false, message: "Введите все необходимые данные" });
  }
  const date = new Date();

  try {
    const query = `
  UPDATE services
  SET title = $2, description = $3, needed = $4, status = $5, updated_at = $6
  WHERE id = $1
  RETURNING id, userid AS userId, title, description, needed, created_at, status, updated_at
`;

    const values = [id, title, description, needed, status, new Date()];
    const dbResult = await pool.query(query, values);
    const services = dbResult.rows[0];

    res.json({ success: true, message: "Запись обновлена. Ожидает модерации", services, status: "fulfilled"});

  } catch (error) {
    console.log("Ошибка добавления", error);
    res.json({
      success: false,
      message: "Ошибка добавления новой записи. Попробуйте еще раз",
    });
  }
});

export default router;
