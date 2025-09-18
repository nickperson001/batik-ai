 // Inisialisasi Feather Icons
       document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("btn-generate");
  const promptInput = document.getElementById("prompt-input");
  const previewImage = document.getElementById("preview-image");
  const statusText = document.getElementById("status-text");

  generateBtn.addEventListener("click", async () => {
    const prompt = promptInput.value.trim();

    if (!prompt) {
      alert("⚠️ Prompt tidak boleh kosong!");
      return;
    }

    // Status awal
    statusText.textContent = "⏳ Sedang memproses AI...";
    previewImage.src = ""; // kosongkan dulu

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("❌ Error:", data);
        statusText.textContent = `❌ Gagal: ${data.error || "Terjadi kesalahan"}`;
        return;
      }

      // tampilkan hasil
      previewImage.src = data.image;
      statusText.textContent = "✅ Berhasil!";

    } catch (err) {
      console.error("❌ Request error:", err);
      statusText.textContent = "❌ Terjadi kesalahan jaringan.";
    }
  });
});
         
            
            // Download design
            document.getElementById('download-button').addEventListener('click', function() {
                showNotification('Desain berhasil diunduh');
            });
            
            // Contact form
            document.getElementById('contact-form').addEventListener('submit', function(e) {
                e.preventDefault();
                showNotification('Pesan berhasil dikirim');
                this.reset();
            });
            
            // Editor functionality
            const editorContainer = document.getElementById('editor-container');
            const openEditorBtn = document.getElementById('open-editor-btn');
            const closeEditorBtn = document.getElementById('close-editor-btn');
            const canvas = document.getElementById('drawing-canvas');
            const ctx = canvas.getContext('2d');
            
            // Initialize canvas
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Open editor
            openEditorBtn.addEventListener('click', function() {
                editorContainer.style.display = 'flex';
            });
            
            // Close editor
            closeEditorBtn.addEventListener('click', function() {
                editorContainer.style.display = 'none';
            });
            
            // Tool selection
            document.querySelectorAll('.tool-btn[data-tool]').forEach(btn => {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.tool-btn[data-tool]').forEach(b => {
                        b.classList.remove('active');
                    });
                    this.classList.add('active');
                    
                    // If shape tool is selected, open shape modal
                    if (this.getAttribute('data-tool') === 'shape') {
                        document.getElementById('shape-modal').style.display = 'flex';
                    }
                });
            });
            
            // Close shape modal
            document.getElementById('close-shape-modal').addEventListener('click', function() {
                document.getElementById('shape-modal').style.display = 'none';
            });
            
            // Apply shape
            document.getElementById('apply-shape').addEventListener('click', function() {
                const selectedShape = document.querySelector('.shape-option.active').getAttribute('data-shape');
                
                // Draw the selected shape (for demonstration)
                ctx.fillStyle = document.getElementById('color-picker').value;
                
                if (selectedShape === 'rectangle') {
                    ctx.fillRect(100, 100, 200, 150);
                } else if (selectedShape === 'circle') {
                    ctx.beginPath();
                    ctx.arc(300, 200, 80, 0, Math.PI * 2);
                    ctx.fill();
                } else if (selectedShape === 'line') {
                    ctx.beginPath();
                    ctx.moveTo(100, 300);
                    ctx.lineTo(500, 300);
                    ctx.strokeStyle = document.getElementById('color-picker').value;
                    ctx.lineWidth = 5;
                    ctx.stroke();
                }
                
                document.getElementById('shape-modal').style.display = 'none';
            });
            
            // Shape selection in modal
            document.querySelectorAll('.shape-option').forEach(option => {
                option.addEventListener('click', function() {
                    document.querySelectorAll('.shape-option').forEach(opt => {
                        opt.classList.remove('active');
                    });
                    this.classList.add('active');
                });
            });
            
            // Clear canvas
            document.getElementById('clear-btn').addEventListener('click', function() {
                if (confirm('Apakah Anda yakin ingin menghapus semua yang ada di kanvas?')) {
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    showNotification('Kanvas berhasil dibersihkan');
                }
            });
            
            // Save design
            document.getElementById('save-btn').addEventListener('click', function() {
                showNotification('Desain berhasil disimpan');
            });
            
            // Export design
            document.getElementById('export-btn').addEventListener('click', function() {
                showNotification('Desain berhasil diekspor');
            });
            
            // Color picker
            document.getElementById('color-picker').addEventListener('change', function() {
                ctx.fillStyle = this.value;
                ctx.strokeStyle = this.value;
            });
            
            // Zoom controls
            let zoomLevel = 1;
            document.getElementById('zoom-in-btn').addEventListener('click', function() {
                if (zoomLevel < 2) {
                    zoomLevel += 0.1;
                    updateZoom();
                }
            });
            
            document.getElementById('zoom-out-btn').addEventListener('click', function() {
                if (zoomLevel > 0.5) {
                    zoomLevel -= 0.1;
                    updateZoom();
                }
            });
            
            function updateZoom() {
                document.getElementById('zoom-level').textContent = Math.round(zoomLevel * 100) + '%';
                canvas.style.transform = `scale(${zoomLevel})`;
            }
            
            // Drawing functionality
            let isDrawing = false;
            let lastX = 0;
            let lastY = 0;
            
            canvas.addEventListener('mousedown', startDrawing);
            canvas.addEventListener('mousemove', draw);
            canvas.addEventListener('mouseup', stopDrawing);
            canvas.addEventListener('mouseout', stopDrawing);
            
            function startDrawing(e) {
                isDrawing = true;
                [lastX, lastY] = [e.offsetX, e.offsetY];
            }
            
            function draw(e) {
                if (!isDrawing) return;
                
                const tool = document.querySelector('.tool-btn[data-tool].active').getAttribute('data-tool');
                
                ctx.beginPath();
                ctx.moveTo(lastX, lastY);
                ctx.lineTo(e.offsetX, e.offsetY);
                ctx.strokeStyle = document.getElementById('color-picker').value;
                
                if (tool === 'pencil') {
                    ctx.lineWidth = 2;
                    ctx.lineCap = 'round';
                } else if (tool === 'brush') {
                    ctx.lineWidth = 10;
                    ctx.lineCap = 'round';
                } else if (tool === 'eraser') {
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 20;
                }
                
                ctx.stroke();
                [lastX, lastY] = [e.offsetX, e.offsetY];
            }
            
            function stopDrawing() {
                isDrawing = false;
            }
            
            // Notification function
            function showNotification(message, type = 'success') {
                const notification = document.getElementById('notification');
                const notificationText = document.getElementById('notification-text');
                
                notificationText.textContent = message;
                
                if (type === 'error') {
                    notification.classList.remove('bg-green-500');
                    notification.classList.add('bg-red-500');
                } else {
                    notification.classList.remove('bg-red-500');
                    notification.classList.add('bg-green-500');
                }
                
                notification.classList.remove('translate-x-full');
                
                setTimeout(() => {
                    notification.classList.add('translate-x-full');
                }, 3000);
            }
        