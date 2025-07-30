const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { nanoid } = require('nanoid');
const path = require('path');

const app = express();
const PORT = 3000;

// In-memory storage (replace with DB if needed)
const urlDatabase = {};

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static frontend files from "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// API route to shorten a URL
app.post('/shorten-url', (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl || !originalUrl.startsWith('http')) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  const shortId = nanoid(6); // Generates a 6-char ID
  const shortenedUrl = `http://localhost:${PORT}/${shortId}`;
  const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days from now

  // Save to in-memory "database"
  urlDatabase[shortId] = { originalUrl, expiryDate };

  res.json({ shortenedUrl, expiryDate });
});

// Redirect route using short ID
app.get('/:shortId', (req, res) => {
  const { shortId } = req.params;
  const record = urlDatabase[shortId];

  if (record) {
    const now = new Date();
    const expiry = new Date(record.expiryDate);

    if (now < expiry) {
      return res.redirect(record.originalUrl);
    } else {
      return res.status(410).send('This link has expired.');
    }
  }

  res.status(404).send('Short URL not found.');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
