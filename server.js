import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Fungsi untuk panggil Stability AI
async function generateWithEngine(engineId, prompt, width, height) {
  const response = await fetch(
    `https://api.stability.ai/v1/generation/${engineId}/text-to-image`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.STABILITY_API_KEY}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text_prompts: [{ text: prompt }],
        cfg_scale: 7,
        width,
        height,
        samples: 1,
        steps: 30,
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Engine ${engineId} failed: ${errText}`);
  }

  const data = await response.json();
  return data.artifacts?.[0]?.base64 || null;
}

// Endpoint utama
app.post("/api/generate", async (req, res) => {
  try {
    const { template, color, instruction } = req.body;
    const prompt = `Batik motif ${template} dengan warna dominan ${color}. ${instruction || ""}`.trim();

    let imageBase64 = null;

    try {
      // ⚡ Coba engine lama v1-6 (512x512)
      console.log("⚡ Trying engine: stable-diffusion-v1-6 (512x512)");
      imageBase64 = await generateWithEngine("stable-diffusion-v1-6", prompt, 512, 512);
    } catch (err) {
      console.warn("⚠️ Engine v1-6 failed, fallback ke SDXL:", err.message);
      // ⚡ Fallback ke SDXL (1024x1024)
      imageBase64 = await generateWithEngine("stable-diffusion-xl-1024-v1-0", prompt, 1024, 1024);
    }

    if (!imageBase64) {
      return res.status(500).json({ error: "No image generated" });
    }

    res.json({ imageBase64 });
  } catch (err) {
    console.error("❌ Internal error:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
