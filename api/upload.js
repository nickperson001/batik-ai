import multer from "multer";
import nextConnect from "next-connect";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(500).json({ error: `Upload failed: ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  },
});

apiRoute.use(upload.single("file"));

apiRoute.post((req, res) => {
  if (!req.file) return res.status(400).json({ error: "File required" });
  const b64 = req.file.buffer.toString("base64");
  const mime = req.file.mimetype || "image/png";
  const dataUrl = `data:${mime};base64,${b64}`;
  res.status(200).json({ url: dataUrl });
});

export default apiRoute;
export const config = { api: { bodyParser: false } };
