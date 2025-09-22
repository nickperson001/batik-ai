// /api/generate.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const HF_TOKEN = process.env.HUGGINGFACE_API_KEY;
  const HF_MODEL = process.env.HF_MODEL || "runwayml/stable-diffusion-v1-5";

  if (!HF_TOKEN) {
    return res.status(500).json({ error: "HF API key not configured in environment" });
  }

  const { prompt, width = 512, height = 512 } = req.body || {};

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        options: { wait_for_model: true },
        parameters: { width: parseInt(width), height: parseInt(height) },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: `HF API error: ${text}` });
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.startsWith("image/")) {
      const buffer = await response.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      return res.status(200).json({ image: `data:${contentType};base64,${base64}` });
    }

    const data = await response.json();
    // common base64 key
    const base64Key = data.image || data.generated_image || data.image_base64;
    if (!base64Key) {
      return res.status(500).json({ error: "No image returned from HF API" });
    }

    const imgData = base64Key.startsWith("data:") ? base64Key : `data:image/png;base64,${base64Key}`;
    return res.status(200).json({ image: imgData });

  } catch (err) {
    console.error("HF generate error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}
