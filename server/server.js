const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/resumeDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Schema
const submissionSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  address: String,
  authorized: Boolean,
  coverLetter: String,
  resumePath: String,
});

const Submission = mongoose.model('Submission', submissionSchema);

// Multer Setup
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// API Route
app.post('/submit', upload.single('resume'), async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    address,
    coverLetter,
    authorized,
  } = req.body;

  const newSubmission = new Submission({
    firstName,
    lastName,
    email,
    phone,
    address,
    authorized: authorized === 'true',
    coverLetter,
    resumePath: req.file.path,
  });

  try {
    await newSubmission.save();
    res.status(201).json({ message: 'Resume submitted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit resume.' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
