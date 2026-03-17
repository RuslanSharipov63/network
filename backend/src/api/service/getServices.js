import express from "express";
import pool from "../../db/connect.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { pageService } = req.body;
  let page = Number(pageService);
  if (page === 1 || page === 0) {
    page = 0;
  }
  if (page !== 1 && page !== 0) {
    page = (page - 1) * 10;
  }


  try {
    const { rows } = await pool.query(`
  SELECT 
    services.*,
    users.id as userId,
    users.username,
    users.avatar,
    users.address
  FROM services 
  JOIN users ON services.userid = users.id 
  WHERE services.status = 'одобрен'
  ORDER BY services.created_at DESC
LIMIT $1 OFFSET $2
`, [10, page]);


    const result = await pool.query(
      'SELECT COUNT(*) FROM services WHERE status = $1',
      ['одобрен']
    );
    const totalPages = parseInt(result.rows[0].count, 10);


    if (!rows || rows.length === 0) {
      return res.json({
        success: true,
        services: [],
        message: "Услуги не найдены"
      });
    }
    const services = rows;
    res.json({ success: true, services, totalPages });
  } catch (error) {
    console.log("Ошибка получения всех статей", error);
    res.json({
      success: false,
      message: "Ошибка сервера. Попробуйте еще раз",
    });
  }
});

export default router;
