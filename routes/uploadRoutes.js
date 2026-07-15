import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import express from "express";
import multer from "multer";

const router = express.Router();

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
// Vercel's deployment filesystem is read-only; only /tmp can accept uploads.
export const uploadsDir = process.env.VERCEL
  ? path.join("/tmp", "uploads")
  : path.join(moduleDir, "..", "uploads");

// Ensure uploads directory exists (prevents multer ENOENT -> 500)
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "No image uploaded" });
  }

  res.send({
    message: "Image uploaded",
    image: `/uploads/${req.file.filename}`,
  });
});

export default router;
