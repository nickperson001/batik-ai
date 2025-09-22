document.addEventListener("DOMContentLoaded", () => {
  const promptInput = document.getElementById("prompt-input");
  const btnGenerate = document.getElementById("btn-generate");
  const loading = document.getElementById("loading");
  const previewContainer = document.getElementById("preview-container");
  const previewImg = document.getElementById("preview-img");
  const downloadBtn = document.getElementById("download-img");

  btnGenerate.addEventListener("click", async () => {
    const prompt = promptInput.value.trim();

    if (!prompt) {
      alert("⚠️ Prompt tidak boleh kosong!");
      return;
    }

    // Reset UI
    previewContainer.classList.add("hidden");
    previewImg.src = "";
    loading.classList.remove("hidden");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, width: 512, height: 512 }), // pastikan width/height selalu ada
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server error ${response.status}`);
      }

      const data = await response.json();

      if (!data.image) {
        throw new Error("Tidak ada hasil gambar dari API");
      }

      // Tampilkan hasil
      previewImg.src = data.image;
      previewContainer.classList.remove("hidden");

      // Link download
      downloadBtn.href = data.image;
      downloadBtn.download = `batik-${Date.now()}.png`;
    } catch (err) {
      console.error("❌ Error:", err);
      alert(`Gagal generate batik: ${err.message}`);
    } finally {
      loading.classList.add("hidden");
    }
  });

  // Tombol Canvas
  const btnCanvas = document.getElementById("btn-canvas");
  if (btnCanvas) {
    btnCanvas.addEventListener("click", () => {
      window.location.href = "editor.html";
    });
  }
});
