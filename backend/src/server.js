import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from 'cookie-parser';
import http from 'http'; 

import registerRouter from "./api/register.js";
import loginRouter from "./api/login.js";
import meRouter from './api/me.js'
import logoutRouter from './api/logout.js'
import serviceRouter from './api/service/index.js'
import suggestAddressRouter from './api/suggest_address.js'
import chatRouter from './api/chat/index.js'
import adminRouter from './api/admin/index.js'
/* import Server from 'socket.io'; */
/* import {Server as SocketIO} from 'socket.io'; */


const app = express();
const PORT = process.env.PORT || 5000;
app.use(cookieParser());
// CORS: разрешаем запросы с фронта (порт 3000)
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

app.use('/api/register', registerRouter)
app.use('/api/login', loginRouter)
app.use('/api/me', meRouter)
app.use('/api/logout', logoutRouter)
app.use('/api/service', serviceRouter)
app.use('/api/suggest_address', suggestAddressRouter)
app.use('/api/chat', chatRouter)
app.use('/api/admin', adminRouter)


/* для сокетов */
/* const server = http.createServer(app);
const io = new SocketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  },
  pingTimeout: 60000, // Тайм-аут пинга в мс
  maxHttpBufferSize: 1e6, // Максимальный размер сообщения (1 МБ)
  transports: ['websocket', 'polling'] // Предпочтительные транспорты
});

// Настраиваем Socket.IO
io.on('connection', (socket) => {
  console.log('Пользователь подключился, ID:', socket.id);

  // Добавляем пользователя в комнату (например, по ID пользователя)
  socket.join('room1');

  // Обрабатываем сообщения
  socket.on('chat message', (msg) => {
    console.log('Сообщение:', msg);

    // Отправляем сообщение всем в комнате
    io.to('room1').emit('chat message', msg);
  });

  // Обрабатываем отключение
  socket.on('disconnect', () => {
    console.log('Пользователь отключился');
  });
}); */


/* для сокетов */

// 6. Запуск сервера


/* для сокетов server.listen... */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Express сервер запущен на http://localhost:${PORT}`);
});
