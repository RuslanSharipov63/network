import express from "express";
import pool from "../../db/connect.js";

const router = express.Router();

router.post('/', async (req, res) => {
    const { authorId, recipientId } = req.body;

    if (!authorId || !recipientId) {
        return res.json({ success: false, alertMessage: 'Отсутствуют параметры запроса' })
    }
    try {

        /*  const query = `SELECT COUNT(*) = 2 as both_exist FROM  users WHERE id IN ($1, $2)`;
 
         const values = [authorId, recipientId];
         const { rows } = await pool.query(query, values);
 
 
         if (rows[0].bot_exist === false) {
             return res.json({ success: false, alertMessage: "Пользователи не найдены" })
         }
  */
        const queryMessage = `SELECT * 
FROM messages 
WHERE 
  (from_user_id = $1 AND to_user_id = $2) 
  OR 
  (from_user_id = $2 AND to_user_id = $1)
ORDER BY created_at ASC;`;
        const valuesMessage = [authorId, recipientId];
        const { rows: messages } = await pool.query(queryMessage, valuesMessage)
        return res.json({ success: true, messages })

    } catch (error) {
        console.log(error);
        return res.json({ success: false, alertMessage: 'Ошибка выборки сообщений' })
    }

})

export default router;