import multer from "multer";

export const config = { api: { bodyParser: false } };

const upload = multer({ storage: multer.memoryStorage() });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  upload.single("file")(req, {}, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: "File required" });

    const dataUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    res.status(200).json({ url: dataUrl });
  });
}
