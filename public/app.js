 // Inisialisasi Feather Icons
        document.addEventListener('DOMContentLoaded', function() {
            feather.replace();
            
            // Mobile menu toggle
            document.getElementById('mobile-menu-button').addEventListener('click', function() {
                const menu = document.getElementById('mobile-menu');
                menu.classList.toggle('hidden');
                const expanded = this.getAttribute('aria-expanded') === 'true' || false;
                this.setAttribute('aria-expanded', !expanded);
            });
            
            // Template selection
            document.querySelectorAll('.select-template').forEach(button => {
                button.addEventListener('click', function() {
                    const template = this.getAttribute('data-template');
                    document.getElementById('template-select').value = template;
                    showNotification(`Template "${template}" dipilih`);
                });
            });
            
            // Color selection
            document.querySelectorAll('.color-option').forEach(option => {
                option.addEventListener('click', function() {
                    document.querySelectorAll('.color-option').forEach(opt => {
                        opt.classList.remove('active');
                    });
                    this.classList.add('active');
                });
            });
            
            const processButton = document.getElementById("process-button");

        // hapus listener lama kalau ada, lalu tambahkan baru
        processButton.replaceWith(processButton.cloneNode(true));
        const newButton = document.getElementById("process-button");
        

            // // Process with AI
            // document.getElementById('process-button').addEventListener('click', function() {
            //     const template = document.getElementById('template-select').value;
            //     if (!template) {
            //         showNotification('Silakan pilih template terlebih dahulu', 'error');
            //         return;
            //     }
                
            //     const selectedColor = document.querySelector('.color-option.active').getAttribute('data-color');
            //     const instruction = document.getElementById('color-instruction').value;
                
            //     // Show loading state
            //     this.disabled = true;
            //     this.innerHTML = '<i data-feather="loader" class="animate-spin mr-2"></i><span>Memproses...</span>';
            //     feather.replace();
                
                // Process with AI
newButton.addEventListener('click', async function() {
    event.preventDefault();
    console.log("Proses AI Dipanggil...");
    const template = document.getElementById('template-select').value;
    if (!template) {
        showNotification('Silakan pilih template terlebih dahulu', 'error');
        return;
    }

    const selectedColor = document.querySelector('.color-option.active').getAttribute('data-color');
    const instruction = document.getElementById('color-instruction').value;

    // Show loading state
    this.disabled = true;
    this.innerHTML = '<i data-feather="loader" class="animate-spin mr-2"></i><span>Memproses...</span>';
    feather.replace();

    try {
    const res = await fetch("http://localhost:3000/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template, color: selectedColor, instruction })
    });
    const data = await res.json();

    if (data.imageBase64) {
      document.getElementById('preview-container').innerHTML = `
        <img src="data:image/png;base64,${data.imageBase64}" 
             alt="Generated Design" class="w-full h-full object-cover rounded-lg">
      `;
      document.getElementById('color-palette').classList.remove('hidden');
      document.getElementById('download-button').disabled = false;
      showNotification('Desain berhasil dibuat!');
    } else {
      showNotification('Gagal membuat desain', 'error');
    }
  } catch (err) {
    console.error(err);
    showNotification('Terjadi error server', 'error');
  }

    this.disabled = false;
    this.innerHTML = '<i data-feather="wand" class="mr-2"></i><span>Proses dengan AI</span>';
    feather.replace();
});

                    
                    // Show color palette
                    document.getElementById('color-palette').classList.remove('hidden');
                    
                    // Enable download button
                    document.getElementById('download-button').disabled = false;
                    
                    // Reset button
                    this.disabled = false;
                    this.innerHTML = '<i data-feather="wand" class="mr-2"></i><span>Proses dengan AI</span>';
                    feather.replace();
                    
                    showNotification('Desain berhasil dibuat!');
                }, 2000);
            
            
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
        