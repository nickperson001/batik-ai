// public/app.js
document.addEventListener("DOMContentLoaded", () => {
  const promptInput = document.getElementById("prompt-input");
  const btnGenerate = document.getElementById("btn-generate");
  const previewImg = document.getElementById("preview-img");
  const previewContainer = document.getElementById("preview-container");
  const downloadBtn = document.getElementById("download-img");
  const loadingSpinner = document.getElementById("loading");

  btnGenerate.addEventListener("click", async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) {
      alert("Prompt tidak boleh kosong");
      return;
    }

    // Show loading state
    previewContainer.classList.add("hidden");
    previewImg.src = "";
    btnGenerate.disabled = true;
    btnGenerate.innerHTML = '<i data-feather="loader" class="animate-spin inline mr-2"></i> Generating...';
    
    if (loadingSpinner) {
      loadingSpinner.classList.remove("hidden");
    }

    try {
      // Gunakan absolute URL untuk menghindari path issues
      const API_URL = '/api/generate';
      console.log('Calling API:', API_URL, 'with prompt:', prompt);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ prompt })
      });

      console.log('Response status:', res.status);

      // Check content type
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await res.text();
        console.error('Non-JSON response:', textResponse.substring(0, 200));
        throw new Error(`Expected JSON but got: ${contentType}`);
      }

      const data = await res.json();
      console.log('Response data:', data);

      if (!res.ok) {
        throw new Error(data.error || `HTTP error! status: ${res.status}`);
      }

      if (!data.image) {
        throw new Error('No image data received from API');
      }

      // Set image source
      previewImg.onload = () => {
        previewContainer.classList.remove("hidden");
        console.log('Image loaded successfully');
      };
      
      previewImg.onerror = () => {
        throw new Error('Failed to load generated image');
      };
      
      previewImg.src = data.image;
      previewImg.alt = `Generated batik: ${prompt}`;
      
      // Set up download
      downloadBtn.href = data.image;
      downloadBtn.download = `batik-${Date.now()}.png`;
      
      // Force show container after a delay (fallback)
      setTimeout(() => {
        previewContainer.classList.remove("hidden");
      }, 1000);

    } catch (err) {
      console.error("❌ Generation error:", err);
      
      let errorMessage = "Gagal generate batik: ";
      
      if (err.message.includes('Method not allowed')) {
        errorMessage += "API endpoint tidak menerima POST request. ";
        errorMessage += "Silakan coba refresh halaman.";
      } else if (err.message.includes('Failed to fetch')) {
        errorMessage += "Koneksi internet bermasalah. Periksa koneksi Anda.";
      } else if (err.message.includes('Expected JSON')) {
        errorMessage += "Server mengembalikan response yang tidak expected.";
      } else {
        errorMessage += err.message;
      }
      
      alert(errorMessage);
    } finally {
      // Reset loading state
      btnGenerate.disabled = false;
      btnGenerate.innerHTML = '<i data-feather="sparkles" class="inline mr-2"></i> Generate';
      
      if (loadingSpinner) {
        loadingSpinner.classList.add("hidden");
      }
      
      // Update feather icons
      if (typeof feather !== 'undefined') {
        feather.replace();
      }
    }
  });

  // Enter key support
  promptInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      btnGenerate.click();
    }
  });

  // Test API connection on load
  console.log('Batik AI Generator loaded');
});