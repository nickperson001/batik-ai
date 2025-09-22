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
      console.error('HUGGINGFACE_API_KEY is missing');
      return res.status(500).json({ error: 'API key not configured. Please check your environment variables.' });
    }

    const HF_MODEL = process.env.HF_MODEL || 'runwayml/stable-diffusion-v1-5';
    
    // Enhanced prompt untuk hasil batik yang lebih baik
    const enhancedPrompt = `batik pattern, ${prompt}, traditional Indonesian batik, intricate details, high resolution, cultural art, textile pattern`;
    
    console.log('Generating image for prompt:', enhancedPrompt);

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

    console.log('HF API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HF API error:', response.status, errorText);
      throw new Error(`HF API error: ${response.status} - ${errorText}`);
    }

    // Check content type to handle different response formats
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      // Handle JSON response (some models return JSON with base64)
      const jsonData = await response.json();
      console.log('JSON response received');
      
      if (jsonData.error) {
        throw new Error(`HF API error: ${jsonData.error}`);
      }
      
      let base64Image;
      if (jsonData[0] && jsonData[0].generated_image) {
        base64Image = jsonData[0].generated_image;
      } else if (jsonData.image_base64) {
        base64Image = jsonData.image_base64;
      } else {
        throw new Error('No image data found in JSON response');
      }
      
      const dataUrl = `data:image/png;base64,${base64Image}`;
      
      res.status(200).json({ 
        image: dataUrl,
        prompt: enhancedPrompt
      });
    } else {
      // Handle binary image response (most common)
      console.log('Binary image response received');
      const imageBuffer = await response.arrayBuffer();
      const base64Image = Buffer.from(imageBuffer).toString('base64');
      const dataUrl = `data:image/png;base64,${base64Image}`;

      res.status(200).json({ 
        image: dataUrl,
        prompt: enhancedPrompt
      });
    }

  } catch (err) {
    console.error('Error in generate API:', err);
    
    // Provide more specific error messages
    if (err.message.includes('Failed to fetch')) {
      res.status(500).json({ 
        error: 'Network error: Cannot connect to Hugging Face API. Please check your internet connection.' 
      });
    } else if (err.message.includes('API key')) {
      res.status(500).json({ 
        error: 'Authentication error: Invalid or missing Hugging Face API key.' 
      });
    } else {
      res.status(500).json({ 
        error: `Generation failed: ${err.message}` 
      });
    }
  }
}