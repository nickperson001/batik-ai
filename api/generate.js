export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;
    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const apiKey = process.env.STABILITY_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API key not configured" });
    }

    // fallback engines
    const engines = [
      { id: "stable-diffusion-v1-6", size: "512x512" },
      { id: "stable-diffusion-xl-1024-v1-0", size: "1024x1024" }
    ];

    let imageBase64 = null;
    let lastError = null;

    for (const engine of engines) {
      try {
        const response = await fetch(
          `https://api.stability.ai/v1/generation/${engine.id}/text-to-image`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              text_prompts: [{ text: prompt }],
              cfg_scale: 7,
              width: parseInt(engine.size.split("x")[0]),
              height: parseInt(engine.size.split("x")[1]),
              samples: 1
            })
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          lastError = `Engine ${engine.id} failed: ${errorText}`;
          continue;
        }

        const data = await response.json();
        if (data.artifacts && data.artifacts[0]) {
          imageBase64 = data.artifacts[0].base64;
          break;
        }
      } catch (err) {
        lastError = err.message;
      }
    }

    if (!imageBase64) {
      return res.status(500).json({ error: "All engines failed", detail: lastError });
    }

    res.status(200).json({ image: `data:image/png;base64,${imageBase64}` });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
