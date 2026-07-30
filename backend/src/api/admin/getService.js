import express from 'express';
import pool from "../../db/connect.js";


const router = express.Router();

router.post('/', async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.json({ success: false, message: "Не указан id" })
  }

  try {
    const { rows } = await pool.query(
      `SELECT 
  services.*,
  users.id AS userId,
  users.username,
  users.avatar,
  users.address
FROM services 
JOIN users ON services.userid = users.id  
WHERE services.id = $1`,
      [id]
    );


    if (rows.length == 0) {
      return res.json({ success: false, rows: [], message: "Запись не найдена" })
    }
    res.json({ success: true, rows });
  } catch (error) {
    console.log('админпанель. выборка с ошибкой', error);
    res.json({ success: false, message: "ошибка сервера" })
  }
})


export default router;
