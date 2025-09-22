import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { prompt } = req.body;
    if (!prompt || !prompt.trim()) return res.status(400).json({ error: "Prompt required" });

    const HF_TOKEN = process.env.HUGGINGFACE_API_KEY;
    if (!HF_TOKEN) return res.status(500).json({ error: "HF API key not configured" });

    const HF_MODEL = process.env.HF_MODEL || "stabilityai/stable-diffusion-2-1";

    const response = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt })
    });

    const data = await response.json();

    if (data.error) return res.status(500).json({ error: `HF API error: ${data.error}` });

    const b64 = data?.[0]?.generated_image || data?.image_base64 || null;
    if (!b64) return res.status(500).json({ error: "HF API returned no image" });

    res.status(200).json({ image: b64.startsWith("data:") ? b64 : `data:image/png;base64,${b64}` });
  } catch (err) {
    res.status(500).json({ error: `HF API error: ${err.message}` });
  }
}
