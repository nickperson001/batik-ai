import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { template, color, instruction } = req.body;
  const prompt = `Motif batik ${template}, warna dominan ${color}. ${instruction}`;

  async function generateWithEngine(engineId, size) {
    const response = await fetch(`https://api.stability.ai/v1/generation/${engineId}/text-to-image`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.STABILITY_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text_prompts: [{ text: prompt }],
        cfg_scale: 7,
        height: size.height,
        width: size.width,
        samples: 1
      })
    });

    if (!response.ok) throw new Error(`Engine ${engineId} failed: ${await response.text()}`);
    const data = await response.json();
    return "data:image/png;base64," + data.artifacts[0].base64;
  }

  try {
    let imageUrl;
    try {
      imageUrl = await generateWithEngine("stable-diffusion-v1-6", { width: 512, height: 512 });
    } catch (e) {
      console.warn("⚠️ Fallback ke SDXL:", e.message);
      imageUrl = await generateWithEngine("stable-diffusion-xl-1024-v1-0", { width: 1024, height: 1024 });
    }

    res.status(200).json({ imageUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
