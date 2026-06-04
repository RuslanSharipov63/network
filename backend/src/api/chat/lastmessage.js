import express from 'express';
import pool from "../../db/connect.js";

const router = express.Router();

router.post('/', async (req, res) => {
    const { lastDate, from_user_id, to_user_id } = req.body

    if (!lastDate) {
        return res.json({ success: false, alertMessage: "Нет даты последнего сообщения" })
    }
    try {

        const result = await pool.query(`
        SELECT *
        FROM messages
        WHERE from_user_id = $1 AND
        to_user_id = $2
          AND created_at > $3
        ORDER BY created_at DESC
        LIMIT 1;
      `,
            [from_user_id, to_user_id, lastDate]);
        
        const lastMessage = result.rows[0] || null;

        res.json({ success: true, lastMessage })
    } catch (error) {
        console.log(error);
        res.json({ success: false, alertMessage: "Ошибка сервера" })
    }

})

export default router;