const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Прокси-эндпоинт для ESP32
app.get("/ask", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).send({ error: "No query provided" });
  }

  try {
    // Отправляем запрос на Pollinations Text API
    const response = await axios.get(`https://text.pollinations.ai/${encodeURIComponent(query)}`, {
      timeout: 10000
    });

    // Возвращаем текст в виде plain text
    res.send(response.data);
  } catch (err) {
    console.error("Ошибка запроса к Pollinations:", err.message);
    res.status(500).send({ error: "Ошибка запроса к Pollinations" });
  }
});

app.listen(PORT, () => {
  console.log(`Pollinations proxy server running on port ${PORT}`);
});
