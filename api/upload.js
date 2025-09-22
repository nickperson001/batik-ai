import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  upload.single("file")(req, res, (err) => {
    if (err) return res.status(500).json({ error: "Upload failed" });
    if (!req.file) return res.status(400).json({ error: "File required" });

    const b64 = req.file.buffer.toString("base64");
    const mime = req.file.mimetype || "image/png";
    res.status(200).json({ url: `data:${mime};base64,${b64}` });
  });
}
