import fetch from "node-fetch";

const HF_TOKEN = process.env.HUGGINGFACE_API_KEY;
const HF_MODEL = process.env.HF_MODEL || "stabilityai/stable-diffusion-2-1";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { prompt, width, height } = req.body || {};
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    const payload = {
      inputs: prompt,
      options: { wait_for_model: true },
      parameters: { width: width || 512, height: height || 512 },
    };

    const response = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${HF_TOKEN}`, Accept: "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    const image = data[0]?.generated_image || data.image_base64 || null;

    if (!image) return res.status(500).json({ error: "Failed to generate image" });

    res.status(200).json({ image: `data:image/png;base64,${image}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
