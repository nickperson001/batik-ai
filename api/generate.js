import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const HF_TOKEN = process.env.HUGGINGFACE_API_KEY;
const HF_MODEL = process.env.HF_MODEL || "stabilityai/stable-diffusion-2-1";

async function hfGenerate(prompt, options = {}) {
  if (!HF_TOKEN) throw new Error("Hugging Face API key not configured");

  const payload = {
    inputs: prompt,
    options: { wait_for_model: true },
    parameters: {
      width: options.width || 512,
      height: options.height || 512,
    },
  };

  const res = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${HF_TOKEN}`, Accept: "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!data || !data[0]?.image_base64) throw new Error("Invalid HF response");

  return `data:image/png;base64,${data[0].image_base64}`;
}

app.post("/api/generate", async (req, res) => {
  try {
    const { prompt, width, height } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const image = await hfGenerate(prompt, { width, height });
    res.json({ image });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default app;
