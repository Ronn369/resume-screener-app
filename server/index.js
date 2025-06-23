const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

// Create upload folder if it doesn't exist
const fs = require("fs");
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// POST route for uploading resume + job description
app.post("/upload", upload.single("resume"), (req, res) => {
  const resumePath = req.file.path;
  const jobDescription = req.body.jobDescription;

  // For now, send dummy match percentage
  console.log("Received resume:", resumePath);
  console.log("Job description:", jobDescription);

  res.json({
    success: true,
    message: "File and job description received",
    matchScore: Math.floor(Math.random() * 100) + "%",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
