import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { template, color, instruction } = req.body;

  // === Fallback Engine Handling ===
  const engines = [
    "stable-diffusion-v1-6",
    "stable-diffusion-xl-1024-v1-0"
  ];

  let imageUrl = null;
  let lastError = null;

  for (const engine of engines) {
    try {
      const response = await fetch(
        `https://api.stability.ai/v1/generation/${engine}/text-to-image`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.STABILITY_API_KEY}`,
          },
          body: JSON.stringify({
            text_prompts: [
              {
                text: `Batik motif ${template} dengan warna ${color}. ${instruction || ""}`,
              },
            ],
            cfg_scale: 7,
            width: engine.includes("xl") ? 1024 : 512,
            height: engine.includes("xl") ? 1024 : 512,
            samples: 1,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Engine ${engine} failed: ${await response.text()}`);
      }

      const data = await response.json();
      const base64 = data.artifacts[0].base64;
      imageUrl = `data:image/png;base64,${base64}`;
      break;
    } catch (err) {
      lastError = err;
      console.warn(`⚠️ Engine ${engine} failed: ${err.message}`);
    }
  }

  if (!imageUrl) {
    return res.status(500).json({
      error: "All engines failed",
      details: lastError?.message,
    });
  }

  res.status(200).json({ imageUrl });
}
