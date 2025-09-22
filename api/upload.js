import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();
app.use(cors());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "File required" });

    const b64 = req.file.buffer.toString("base64");
    const mime = req.file.mimetype || "image/png";
    const dataUrl = `data:${mime};base64,${b64}`;

    res.json({ url: dataUrl });
  } catch (err) {
    res.status(500).json({ error: "Upload failed" });
  }
});

export default app;
