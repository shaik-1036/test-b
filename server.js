/*
 * Copyright (c) 2025 Your Company Name
 * All rights reserved.
 */
const express = require("express")
const cors = require("cors")
const fileUpload = require("express-fileupload")
const fs = require("fs")
const path = require("path")
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const messageRoutes = require("./routes/messages")
const uploadRoutes = require("./routes/admin") // Changed from admin to upload
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 5000

const tempDir = process.env.VERCEL ? "/tmp" : path.join(process.cwd(), "tmp")
if (!fs.existsSync(tempDir)) {
  try {
    fs.mkdirSync(tempDir, { recursive: true })
    console.log("Temporary directory created:", tempDir)
  } catch (err) {
    console.error("Error creating temporary directory:", err)
  }
}

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://hi-hi.in",
      /\.vercel\.app$/, // Allow all Vercel preview deployments
    ],
    credentials: true,
  }),
)

app.use(express.json())
app.use(
  fileUpload({
    createParentPath: true,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max file size
    useTempFiles: true,
    tempFileDir: tempDir,
    safeFileNames: true,
    abortOnLimit: true,
    responseOnLimit: "File size exceeds 2MB limit",
  }),
)

// Root route for testing
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Restaurant App Backend is Running",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  })
})

// Routes
app.use("/api", authRoutes)
app.use("/api", userRoutes)
app.use("/api", messageRoutes)
app.use("/api", uploadRoutes)

// Basic Health Check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  })
})

app.use((err, req, res, next) => {
  console.error("Error:", err)
  res.status(500).json({
    error: process.env.NODE_ENV === "production" ? "Internal Server Error" : err.message,
  })
})

// Cleanup temporary files
app.use((req, res, next) => {
  if (req.files) {
    Object.values(req.files).forEach((file) => {
      if (file.tempFilePath && fs.existsSync(file.tempFilePath)) {
        fs.unlink(file.tempFilePath, (err) => {
          if (err) console.error("Error cleaning up temp file:", err)
        })
      }
    })
  }
  next()
})

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

module.exports = app
