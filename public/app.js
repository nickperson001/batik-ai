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
    if (!prompt) return alert("Prompt tidak boleh kosong");

    // Show loading state
    previewContainer.classList.add("hidden");
    previewImg.src = "";
    btnGenerate.disabled = true;
    btnGenerate.innerHTML = '<i data-feather="loader" class="animate-spin inline mr-2"></i> Generating...';
    
    if (loadingSpinner) {
      loadingSpinner.classList.remove("hidden");
    }

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
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
      previewContainer.classList.remove("hidden");
      
      // Set up download
      downloadBtn.href = data.image;
      downloadBtn.download = `batik-${Date.now()}.png`;
      
      // Update feather icons
      if (typeof feather !== 'undefined') {
        feather.replace();
      }

    } catch (err) {
      console.error("❌ Generation error:", err);
      
      // More user-friendly error messages
      let errorMessage = "Gagal generate batik: ";
      if (err.message.includes('Network error') || err.message.includes('Failed to fetch')) {
        errorMessage += "Koneksi internet bermasalah. Periksa koneksi Anda.";
      } else if (err.message.includes('API key') || err.message.includes('Authentication')) {
        errorMessage += "Masalah konfigurasi server. Silakan hubungi administrator.";
      } else if (err.message.includes('rate limit') || err.message.includes('quota')) {
        errorMessage += "Quota API habis. Silakan coba lagi nanti.";
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
});