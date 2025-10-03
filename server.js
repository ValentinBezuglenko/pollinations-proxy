const express = require('express');
const fetch = require('node-fetch'); // npm install node-fetch@2
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = 'ВАШ_OPENAI_API_KEY'; // вставьте ключ OpenAI

app.post('/ask', async (req, res) => {
  try {
    const question = req.body.q;
    if (!question) return res.status(400).send('Введите вопрос в поле "q"');

    // Отправка на OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: question }]
      })
    });

    const data = await response.json();

    // Отправляем текст напрямую
    const answer = data.choices && data.choices[0].message.content
      ? data.choices[0].message.content
      : 'Ошибка: пустой ответ';

    res.send(answer);

  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка сервера');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
