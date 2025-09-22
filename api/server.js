import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import fetch from "node-fetch"; // pastikan install node-fetch

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Multer config for optional uploads (editor)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// === Config / Env ===
const HF_TOKEN = process.env.HUGGINGFACE_API_KEY || "";
if (!HF_TOKEN) {
  console.warn("Warning: HUGGINGFACE_API_KEY not set. /api/generate will fail without it.");
}
const HF_MODEL = process.env.HF_MODEL || "stabilityai/stable-diffusion-2-1";

// Helper: Hugging Face image generation
async function hfGenerate(prompt, options = {}) {
  if (!HF_TOKEN) throw new Error("Hugging Face API key not configured (HUGGINGFACE_API_KEY).");

  const payload = {
    inputs: prompt,
    options: { wait_for_model: true },
    parameters: { width: options.width || 512, height: options.height || 512 },
  };

  const url = `https://api-inference.huggingface.co/models/${HF_MODEL}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${HF_TOKEN}`, Accept: "application/json" },
    body: JSON.stringify(payload),
  });

  const contentType = res.headers.get("content-type") || "";
  if (contentType.startsWith("image/")) {
    const buffer = await res.arrayBuffer();
    const b64 = Buffer.from(buffer).toString("base64");
    return `data:${contentType};base64,${b64}`;
  }

  const data = await res.json();

  if (Array.isArray(data) && data.length && typeof data[0] === "object") {
    const keysToCheck = ["generated_image", "image_base64", "b64_json", "image"];
    for (const obj of data) {
      for (const k of keysToCheck) {
        if (obj[k]) {
          const val = obj[k];
          if (val.startsWith("data:")) return val;
          return `data:image/png;base64,${val}`;
        }
      }
    }
  } else if (data && typeof data === "object") {
    const keysToCheck = ["generated_image", "image_base64", "b64_json", "image", "data"];
    for (const k of keysToCheck) {
      if (data[k]) {
        const v = data[k];
        if (typeof v === "string") return v.startsWith("data:") ? v : `data:image/png;base64,${v}`;
        if (Array.isArray(v) && v[0] && v[0].b64_json) return `data:image/png;base64,${v[0].b64_json}`;
      }
    }
  }

  throw new Error("Unexpected HF response format: " + JSON.stringify(data).slice(0, 400));
}

// Routes
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt, width, height } = req.body || {};
    if (!prompt?.trim()) return res.status(400).json({ error: "Prompt is required" });
    const opts = { width: parseInt(width) || 512, height: parseInt(height) || 512 };
    const image = await hfGenerate(prompt, opts);
    return res.json({ image });
  } catch (err) {
    console.error("API generate error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
});

app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "File required" });
    const b64 = req.file.buffer.toString("base64");
    const mime = req.file.mimetype || "image/png";
    return res.json({ url: `data:${mime};base64,${b64}` });
  } catch (err) {
    console.error("upload error", err);
    return res.status(500).json({ error: "Upload failed" });
  }
});

// Export app sebagai serverless function
export default app;
