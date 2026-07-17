import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import express from "express";
import multer from "multer";

const router = express.Router();

const moduleDir = path.dirname(fileURLToPath(import.meta.url));

export const uploadsDir = process.env.VERCEL
  ? path.join("/tmp", "uploads")
  : path.join(moduleDir, "..", "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage });

router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "No image uploaded" });
  }

  const backendUrl =
    process.env.BACKEND_URL || "https://dbackend-gamma.vercel.app";

  // Return a relative static path so the frontend can consistently render it.
  // Express serves files at: /uploads -> <project>/uploads
  res.status(200).send({
    message: "Image uploaded",
    image: `/uploads/${req.file.filename}`,
  });
});

export default router;