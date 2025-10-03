const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Временное хранилище для частей сообщений по сессиям
let sessions = {};

// Парсинг тела POST
app.use(bodyParser.text({ type: '*/*' }));

// Endpoint для ESP32
app.post('/ask', async (req, res) => {
  const sessionId = req.headers['esp-session-id'] || 'default';
  const part = req.body;

  if (!sessions[sessionId]) {
    sessions[sessionId] = '';
  }

  // Собираем части
  sessions[sessionId] += part;

  // Проверим, пришла ли "конец сообщения" (можно договориться с ESP32)
  const endMarker = '[END]';
  if (sessions[sessionId].endsWith(endMarker)) {
    const fullMessage = sessions[sessionId].slice(0, -endMarker.length);
    sessions[sessionId] = ''; // очистим для новой сессии

    try {
      // Отправляем на AI (Pollinations или OpenAI)
      const aiResponse = await axios.post(
        'https://text.pollinations.ai/' + encodeURIComponent(fullMessage),
        {},
        { timeout: 10000 } // таймаут 10 сек
      );

      res.send(aiResponse.data); // возвращаем полный ответ ESP32
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Ошибка при обращении к AI');
    }
  } else {
    // Пока ждём остальные части, подтверждаем получение
    res.send('OK');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
