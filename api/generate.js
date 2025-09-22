import fetch from "node-fetch";

const HF_TOKEN = process.env.HUGGINGFACE_API_KEY;
const HF_MODEL = process.env.HF_MODEL || "stabilityai/stable-diffusion-2-1";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!HF_TOKEN) return res.status(500).json({ error: "HF API key not set" });

  try {
    const { prompt, width = 512, height = 512 } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const payload = {
      inputs: prompt,
      options: { wait_for_model: true },
      parameters: { width, height },
    };

    const response = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${HF_TOKEN}`, Accept: "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    // Ambil image base64
    const imageBase64 = data?.[0]?.generated_image || data?.image_base64 || null;
    if (!imageBase64) return res.status(500).json({ error: "No image returned from HF" });

    res.status(200).json({
      image: imageBase64.startsWith("data:") ? imageBase64 : `data:image/png;base64,${imageBase64}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
}
