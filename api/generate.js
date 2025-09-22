import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { prompt, width = 512, height = 512 } = req.body;

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const HF_TOKEN = process.env.HUGGINGFACE_API_KEY;
  const HF_MODEL = process.env.HF_MODEL || "runwayml/stable-diffusion-v1-5";

  if (!HF_TOKEN) return res.status(500).json({ error: "HF token not configured" });

  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { width, height },
        options: { wait_for_model: true }
      })
    });

    if (!response.ok) {
      const txt = await response.text();
      throw new Error(`HF API error: ${txt}`);
    }

    const data = await response.json();
    const image = data[0]?.generated_image || data.image_base64 || null;

    if (!image) return res.status(500).json({ error: "No image returned from HF" });

    res.status(200).json({ image: image.startsWith("data:") ? image : `data:image/png;base64,${image}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
