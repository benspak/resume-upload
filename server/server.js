require('dotenv').config(); // Load .env variables
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFSBucket, ObjectId } = require('mongodb');
const cors = require('cors');
const stream = require('stream');

const app = express();
app.use(cors());
app.use(express.json());

// Load MONGO_URI from .env
const mongoURI = process.env.MONGO_URI;
const client = new mongoose.mongo.MongoClient(mongoURI);

let gfsBucket;

// Connect to MongoDB
mongoose.connect(mongoURI);
mongoose.connection.once('open', async () => {
  const db = mongoose.connection.db;
  gfsBucket = new GridFSBucket(db, { bucketName: 'resumes' });
  console.log('GridFSBucket connected');
});

// Submission schema
const submissionSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  address: String,
  coverLetter: String,
  authorized: Boolean,
  resumeFileId: mongoose.Schema.Types.ObjectId,
}, { timestamps: true });
const Submission = mongoose.model('Submission', submissionSchema);

// Multer memory storage (buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST route
app.post('/submit', upload.single('resume'), async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      coverLetter,
      authorized,
    } = req.body;

    // ✅ Check for duplicate email or phone
    const existing = await Submission.findOne({
      $or: [{ email }, { phone }],
    });

    if (existing) {
      return res.status(409).json({
        error: 'A submission with this email or phone number already exists.',
      });
    }

    // Upload file to GridFS
    const readableStream = new stream.Readable();
    readableStream.push(req.file.buffer);
    readableStream.push(null); // End stream

    const uploadStream = gfsBucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    readableStream.pipe(uploadStream)
      .on('error', (err) => {
        console.error(err);
        return res.status(500).json({ error: 'Failed to upload resume' });
      })
      .on('finish', async () => {
        const submission = new Submission({
          firstName,
          lastName,
          email,
          phone,
          address,
          coverLetter,
          authorized: authorized === 'true',
          resumeFileId: uploadStream.id,
        });

        await submission.save();
        res.status(201).json({ message: 'Resume submitted successfully' });
      });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Submission failed' });
  }
});


// Download resume
app.get('/resume/:id', async (req, res) => {
  try {
    const fileId = new ObjectId(req.params.id);
    const downloadStream = gfsBucket.openDownloadStream(fileId);

    downloadStream.on('error', () => {
      res.status(404).json({ error: 'File not found' });
    });

    res.set('Content-Type', 'application/octet-stream');
    downloadStream.pipe(res);
  } catch (err) {
    res.status(500).json({ error: 'Failed to download resume' });
  }
});

// Get all submissions
app.get('/submissions', async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

app.listen(5555, () => console.log('Server running on port 5555'));
