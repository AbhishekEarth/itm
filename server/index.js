const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock Data for Events
const events = [
  {
    id: 1,
    title: "International Conference on Advanced Computing",
    date: "15 Oct 2026",
    description: "Join us for the 3rd International Conference focusing on AI and Cloud Computing."
  },
  {
    id: 2,
    title: "Alumni Meet 2026",
    date: "20 Nov 2026",
    description: "An evening to reconnect, reminisce, and celebrate the success of our alumni."
  },
  {
    id: 3,
    title: "Tech Fest - 'Avinya'",
    date: "05 Dec 2026",
    description: "Annual technical festival featuring coding competitions, robotics, and more."
  }
];

// Routes
app.get('/api/events', (req, res) => {
  res.json(events);
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }
  // Simulate saving to DB
  res.status(200).json({ success: true, message: "Message received successfully!" });
});

app.get('/', (req, res) => {
  res.send('ITM GOI Clone API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
