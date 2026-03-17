import express from "express";
import pool from "../../db/connect.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    console.log("Отсутствует id");
    res.json({ success: false, message: "Ошибка сервера" });
  }
  const { rows } = await pool.query("SELECT * FROM services WHERE id = $1", [
    id,
  ]);
  const service = rows[0];

  if (!service) {
    return res
      .status(401)
      .json({ success: false, message: "Такой услуги не существует" });
  }

  try {
    await pool.query("DELETE FROM services WHERE id = $1", [id]);
     res.json({ success: true, message: "Услуга удалена" });

  } catch (error) {
    console.log("Ошибка удаления услуги", error);
    res.json({
      success: false,
      message: "Ошибка сервера. Попробуйте еще раз",
    });
  }
});

export default router;
