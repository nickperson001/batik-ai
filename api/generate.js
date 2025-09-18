export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { template, color, instruction } = req.body;
  const prompt = `Batik motif ${template} dengan warna ${color}. ${instruction || ""}`;

  const engines = ["stable-diffusion-v1-6", "stable-diffusion-xl-1024-v1-0"];
  let imageUrl = null;

  for (const engine of engines) {
    try {
      const response = await fetch(`https://api.stability.ai/v1/generation/${engine}/text-to-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.STABILITY_API_KEY}`,
        },
        body: JSON.stringify({
          text_prompts: [{ text: prompt }],
          width: engine.includes("xl") ? 1024 : 512,
          height: engine.includes("xl") ? 1024 : 512,
          samples: 1,
        }),
      });

      if (!response.ok) throw new Error(await response.text());
      const result = await response.json();
      const b64 = result.artifacts[0].base64;
      imageUrl = `data:image/png;base64,${b64}`;
      break;
    } catch (err) {
      console.warn(`⚠️ Engine ${engine} failed:`, err.message);
    }
  }

  if (!imageUrl) {
    return res.status(500).json({ error: "Semua engine gagal" });
  }

  res.status(200).json({ imageUrl });
}
