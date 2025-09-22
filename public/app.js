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
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Server error");
      }

      const data = await response.json();
      previewImg.src = data.image;
      previewContainer.classList.remove("hidden");

      downloadBtn.href = data.image;
      downloadBtn.download = `batik-${Date.now()}.png`;

    } catch (err) {
      console.error("❌ Error:", err);
      alert(`Gagal generate batik: ${err.message}`);
    } finally {
      loading.classList.add("hidden");
    }
  });
});
