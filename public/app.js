document.addEventListener("DOMContentLoaded", () => {
  const promptInput = document.getElementById("prompt-input");
  const btnGenerate = document.getElementById("btn-generate");
  const loading = document.getElementById("loading");
  const previewContainer = document.getElementById("preview-container");
  const previewImg = document.getElementById("preview-img");
  const downloadBtn = document.getElementById("download-img");

  btnGenerate.addEventListener("click", async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) return alert("⚠️ Prompt tidak boleh kosong!");

    previewContainer.classList.add("hidden");
    previewImg.src = "";
    loading.classList.remove("hidden");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, width: 512, height: 512 })
      });

      if (!res.ok) throw new Error(`Server error ${res.status}`);

      const data = await res.json();
      if (!data.image) throw new Error("Tidak ada hasil gambar dari API");

      previewImg.src = data.image;
      previewContainer.classList.remove("hidden");

      downloadBtn.href = data.image;
      downloadBtn.download = `batik-${Date.now()}.png`;
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Gagal generate batik. Coba lagi.");
    } finally {
      loading.classList.add("hidden");
    }
  });

  const btnCanvas = document.getElementById("btn-canvas");
  if (btnCanvas) btnCanvas.addEventListener("click", () => window.location.href = "editor.html");
});
