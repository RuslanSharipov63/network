import express from "express";
import "dotenv/config";

const router = express.Router();

router.post("/", (req, res) => {
  try {
    // Удаляем cookie 'token'
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/", // ← важно: должен совпадать с путём при установке
    });

    // Опционально: можно очистить другие куки (например, refresh-token, если будет)

    res.status(200).json({
      success: true,
      message: "Выход выполнен",
    });
  } catch (error) {
    console.log(error)
     res.json({
      success: false,
      message: "Выход не выполнен",
    });
  }
});

export default router;
