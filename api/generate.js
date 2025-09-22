import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const HF_TOKEN = process.env.HUGGINGFACE_API_KEY;
  if (!HF_TOKEN) {
    return res.status(500).json({ error: "HF API key not configured" });
  }

  const HF_MODEL = process.env.HF_MODEL || "stabilityai/stable-diffusion-2-1";

  const { prompt, width = 512, height = 512 } = req.body || {};

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const payload = {
      inputs: prompt,
      options: { wait_for_model: true },
      parameters: { width, height }
    };

    const response = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: `HF API error: ${text}` });
    }

    const data = await response.json();

    // Ambil base64 image dari response
    let imageBase64 = "";
    if (Array.isArray(data) && data[0]?.generated_image) {
      imageBase64 = `data:image/png;base64,${data[0].generated_image}`;
    } else if (data.image_base64) {
      imageBase64 = `data:image/png;base64,${data.image_base64}`;
    } else {
      return res.status(500).json({ error: "HF API did not return an image" });
    }

    return res.status(200).json({ image: imageBase64 });

  } catch (err) {
    console.error("HF generate error:", err);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}
