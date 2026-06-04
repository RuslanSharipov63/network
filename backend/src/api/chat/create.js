import express from "express";
import pool from "../../db/connect.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const {
        from_user_id,
        to_user_id,
        text,
    } = req.body;


    if (!from_user_id || !to_user_id || !text) {
        console.log("Отсутствуют параметры запроса");
        res.json({ success: false, message: "Введите все необходимые данные" });
    }

    const { rows: from_user } = await pool.query(`SELECT EXISTS(
        SELECT 1 FROM users WHERE id = $1
    ) as from_user_exists`, [from_user_id])


    if (!from_user[0].from_user_exists) {
        return res.json({ success: false, message: "Пользователь не найден" })
    }

    const { rows: to_user } = await pool.query(`SELECT EXISTS(
        SELECT 1 FROM users WHERE id = $1
    ) as to_user_exists`, [to_user_id])

    if (!to_user[0].to_user_exists) {
        return res.json({ success: false, message: "Адресат не найден не найден" })
    }

    try {
        const query = `INSERT INTO messages (from_user_id, to_user_id, text) VALUES ($1, $2, $3) 
        RETURNING id, from_user_id, to_user_id, text, created_at, is_read, read_at`;
        const values = [from_user_id, to_user_id, text]
        const dbResult = await pool.query(query, values);
        const messageChat = dbResult.rows[0];
        return res.json({ success: true, alertMessage: "Сообщение отправлено", messageChat })
    } catch (error) {
        console.log(error)
        return res.json({ success: false, alertMessage: "Ошибка отправки сообщения" })
    }

});

export default router;
