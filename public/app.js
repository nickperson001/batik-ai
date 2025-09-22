// public/app.js
document.addEventListener('DOMContentLoaded', () => {
  const promptInput = document.getElementById('prompt-input');
  const btnGenerate = document.getElementById('btn-generate');
  const previewImg = document.getElementById('preview-img');
  const previewContainer = document.getElementById('preview-container');
  const downloadBtn = document.getElementById('download-img');
  const loadingSpinner = document.getElementById('loading-spinner');

  btnGenerate.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) {
      alert('Prompt tidak boleh kosong');
      return;
    }

    // Show loading state
    btnGenerate.disabled = true;
    btnGenerate.textContent = 'Generating...';
    if (loadingSpinner) loadingSpinner.classList.remove('hidden');
    previewContainer.classList.add('hidden');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ prompt })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `HTTP error! status: ${res.status}`);
      }

      // Set image source
      previewImg.src = data.image;
      previewImg.alt = `Generated batik: ${prompt}`;
      
      // Show preview container
      previewContainer.classList.remove('hidden');
      
      // Set up download
      downloadBtn.href = data.image;
      downloadBtn.download = `batik-${Date.now()}.png`;
      downloadBtn.textContent = 'Download Batik';

    } catch (err) {
      console.error('❌ Generation error:', err);
      alert('Gagal generate batik: ' + err.message);
    } finally {
      // Reset loading state
      btnGenerate.disabled = false;
      btnGenerate.textContent = 'Generate Batik';
      if (loadingSpinner) loadingSpinner.classList.add('hidden');
    }
  });

  // Enter key support
  promptInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      btnGenerate.click();
    }
  });
});