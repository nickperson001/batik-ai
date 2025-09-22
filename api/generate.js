// api/generate.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  console.log('Request method:', req.method);
  console.log('Request path:', req.url);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    console.log('Method not allowed, received:', req.method);
    return res.status(405).json({ 
      error: 'Method not allowed. Only POST requests are accepted.' 
    });
  }

  try {
    console.log('Processing POST request...');
    
    // Parse request body
    let body;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      console.log('Parsed body:', body);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return res.status(400).json({ error: 'Invalid JSON in request body' });
    }

    const { prompt } = body;
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const HF_TOKEN = process.env.HUGGINGFACE_API_KEY;
    if (!HF_TOKEN) {
      console.error('HUGGINGFACE_API_KEY is missing');
      return res.status(500).json({ 
        error: 'Server configuration error: API key not configured' 
      });
    }

    const HF_MODEL = process.env.HF_MODEL || 'runwayml/stable-diffusion-v1-5';
    const enhancedPrompt = `batik pattern, ${prompt}, traditional Indonesian batik, intricate details, high resolution`;

    console.log('Calling Hugging Face API...');
    console.log('Model:', HF_MODEL);
    console.log('Prompt:', enhancedPrompt);

    // Call Hugging Face API
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${HF_MODEL}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: enhancedPrompt,
          parameters: {
            num_inference_steps: 20,
            guidance_scale: 7.5,
            width: 512,
            height: 512
          }
        }),
      }
    );

    console.log('HF API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HF API error:', response.status, errorText);
      return res.status(500).json({ 
        error: `Hugging Face API error: ${response.status}` 
      });
    }

    // Get image buffer
    const imageBuffer = await response.buffer();
    console.log('Image received, size:', imageBuffer.length, 'bytes');
    
    // Convert to base64
    const base64Image = imageBuffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64Image}`;

    console.log('Sending response with image data');
    
    res.status(200).json({ 
      success: true,
      image: dataUrl,
      prompt: enhancedPrompt,
      imageSize: imageBuffer.length
    });

  } catch (err) {
    console.error('Error in generate API:', err);
    res.status(500).json({ 
      error: `Internal server error: ${err.message}` 
    });
  }
};