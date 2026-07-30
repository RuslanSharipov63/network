import express from 'express';
import pool from "../../db/connect.js";


const router = express.Router();

router.get('/', async (req, res) => {


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
  ORDER BY services.created_at DESC
`);
    res.json({ success: true, rows });
  } catch (error) {
    console.log('админпанель. выборка с ошибкой', error);
    res.json({ success: false, message: "ошибка сервера" })
  }
})


export default router;