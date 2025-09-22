// api/generate.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt required' });
    }

    const HF_TOKEN = process.env.HUGGINGFACE_API_KEY;
    if (!HF_TOKEN) {
      return res.status(500).json({ error: 'HF API key not configured' });
    }

    const HF_MODEL = process.env.HF_MODEL || 'stabilityai/stable-diffusion-2-1';
    
    // Enhanced prompt untuk hasil batik yang lebih baik
    const enhancedPrompt = `batik pattern, ${prompt}, traditional Indonesian batik, intricate details, high resolution, cultural art`;
    
    console.log('Generating image for prompt:', enhancedPrompt);

    const response = await fetch(
      `https://api-inference.huggingface.co/models/${HF_MODEL}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: enhancedPrompt,
          parameters: {
            num_inference_steps: 50,
            guidance_scale: 7.5,
            width: 512,
            height: 512
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HF API error: ${response.status} - ${errorText}`);
    }

    // Get image as array buffer
    const imageBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64Image}`;

    res.status(200).json({ 
      image: dataUrl,
      prompt: enhancedPrompt
    });

  } catch (err) {
    console.error('Error in generate API:', err);
    res.status(500).json({ 
      error: `Generation failed: ${err.message}` 
    });
  }
}