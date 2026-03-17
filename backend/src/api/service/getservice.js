import express from "express";
import pool from "../../db/connect.js";

const router = express.Router();

router.post("/", async (req, res) => {

    const { id } = req.body;
    if (!id) res.json({
        success: false,
        message: "Ошибка сервера. Попробуйте еще раз",
    });
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
  WHERE services.id = $1
`, [id]);


      /*   const result = await pool.query(
            'SELECT COUNT(*) FROM services WHERE status = $1',
            ['одобрен']
        );
        const totalPages = parseInt(result.rows[0].count, 10);
 */
/* 
        if (!rows || rows.length === 0) {
            return res.json({
                success: true,
                services: [],
                message: "Услуги не найдены"
            });
        } */
        const service = rows;
        res.json({ success: true, service });
    } catch (error) {
        console.log("Ошибка получения всех статей", error);
        res.json({
            success: false,
            message: "Ошибка сервера. Попробуйте еще раз",
        });
    }
});

export default router;
