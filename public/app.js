document.addEventListener("DOMContentLoaded", () => {
  const promptInput = document.getElementById("prompt-input");
  const btnGenerate = document.getElementById("btn-generate");
  const previewImg = document.getElementById("preview-img");
  const previewContainer = document.getElementById("preview-container");
  const downloadBtn = document.getElementById("download-img");

  btnGenerate.addEventListener("click", async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) return alert("Prompt tidak boleh kosong");

    previewContainer.classList.add("hidden");
    previewImg.src = "";

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      previewImg.src = data.image;
      previewContainer.classList.remove("hidden");

      downloadBtn.href = data.image;
      downloadBtn.download = `batik-${Date.now()}.png`;
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Gagal generate batik: " + err.message);
    }
  });
});
