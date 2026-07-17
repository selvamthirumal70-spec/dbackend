import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import { Readable } from "stream";
import { getGridFSBucket } from "../config/db.js";

const router = express.Router();

// Multer Memory Storage
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// =========================
// Upload Image
// =========================
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    const bucket = getGridFSBucket();

    const filename = `${Date.now()}-${req.file.originalname}`;

    const uploadStream = bucket.openUploadStream(filename, {
      contentType: req.file.mimetype,
    });

    const readable = Readable.from(req.file.buffer);

    readable.pipe(uploadStream);

    uploadStream.on("error", (err) => {
      console.error(err);

      return res.status(500).json({
        message: "Image upload failed",
      });
    });

    uploadStream.on("finish", () => {
      res.status(200).json({
        message: "Image uploaded successfully",
        image: uploadStream.id.toString(),
      });
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// =========================
// Get Image
// =========================
router.get("/:id", async (req, res) => {
  try {
    const bucket = getGridFSBucket();

    const fileId = new mongoose.Types.ObjectId(req.params.id);

    const files = await bucket.find({
      _id: fileId,
    }).toArray();

    if (!files.length) {
      return res.status(404).json({
        message: "Image not found",
      });
    }

    res.set("Content-Type", files[0].contentType);

    const downloadStream = bucket.openDownloadStream(fileId);

    downloadStream.pipe(res);

    downloadStream.on("error", () => {
      res.status(404).json({
        message: "Image not found",
      });
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;