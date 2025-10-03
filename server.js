const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/ask", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).send("No query provided");
  }

  try {
    const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(query)}`);
    const text = await response.text();
    res.send(text);
  } catch (err) {
    console.error("Ошибка запроса к Pollinations:", err.message);
    res.status(500).send("Ошибка запроса к Pollinations");
  }
});

app.listen(PORT, () => {
  console.log(`Pollinations proxy server running on port ${PORT}`);
});
