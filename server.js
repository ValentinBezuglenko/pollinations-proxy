const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Proxy is running!');
});

app.get('/ask', async (req, res) => {
  const question = req.query.q;
  if (!question) return res.status(400).send('Missing "q" query parameter');

  try {
    const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(question)}`);
    const text = await response.text();
    res.send(text);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error connecting to Pollinations');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
