import path from "path";
import express from "express";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
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