const express = require('express');
const fetch = require('node-fetch'); // npm install node-fetch@2
const app = express();

app.use(express.text()); // для raw текста из POST

// Pollinations базовый URL
const POLLINATIONS_URL = 'https://text.pollinations.ai/';

// Обработчик /ask
app.all('/ask', async (req, res) => {
  try {
    // Получаем текст от ESP32: GET ?q= или POST raw body
    let text = req.query.q || req.body;
    if (!text) {
      return res.status(400).send('No text provided');
    }

    // Формируем корректный URL для Pollinations
    const url = POLLINATIONS_URL + encodeURIComponent(text);

    // Отправка запроса на Pollinations
    const response = await fetch(url, { method: 'GET' });
    if (!response.ok) {
      return res.status(500).send(`Pollinations error: ${response.status}`);
    }

    // Получаем чистый текст
    const aiText = await response.text();

    // Возвращаем ESP32 только plain text
    res.set('Content-Type', 'text/plain');
    res.send(aiText);

  } catch (err) {
    res.status(500).send(`Error: ${err.message}`);
  }
});

// Запуск сервера на Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
