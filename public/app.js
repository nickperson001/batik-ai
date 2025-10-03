// app.js - Full Version dengan Mobile & Download Fix
document.addEventListener("DOMContentLoaded", () => {
    const btnGenerate = document.getElementById("btn-generate");
    const promptInput = document.getElementById("prompt-input");
    const previewContainer = document.getElementById("preview-container");
    const previewImg = document.getElementById("preview-img");
    const downloadImg = document.getElementById("download-img");
    const loading = document.getElementById("loading");
    const btnCanvas = document.getElementById("btn-canvas");

    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const API_URL = isDevelopment ? 'http://localhost:5000/api/generate' : '/api/generate';

    let selectedTemplate = null;

    // Template selection
    document.querySelectorAll('.select-template').forEach(button => {
        button.addEventListener('click', (e) => {
            document.querySelectorAll('.select-template').forEach(btn => {
                btn.classList.remove('bg-green-600', 'text-white');
                btn.classList.add('btn-gold');
            });
            
            e.target.classList.remove('btn-gold');
            e.target.classList.add('bg-green-600', 'text-white');
            
            selectedTemplate = e.target.dataset.template.toLowerCase().replace(' ', '');
            const templateName = e.target.dataset.template;
            promptInput.value = `Batik ${templateName} dengan desain modern`;
            promptInput.focus();
            
            showNotification(`Template ${templateName} dipilih! Silakan klik Generate.`);
        });
    });

    btnGenerate.addEventListener("click", async () => {
        const prompt = promptInput.value.trim();
        if (!prompt) {
            alert("Silakan isi prompt dulu! Atau pilih template dari bagian Template.");
            return;
        }

        loading.classList.remove("hidden");
        previewContainer.classList.add("hidden");

        try {
            const payload = { prompt };
            if (selectedTemplate) payload.template = selectedTemplate;

            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();

            if (data.image) {
                previewImg.src = data.image;
                downloadImg.href = data.image;
                
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const patternName = selectedTemplate || 'batik';
                downloadImg.download = `batik-${patternName}-${timestamp}.svg`;
                
                previewContainer.classList.remove("hidden");
                
                // Smooth animation
                previewImg.style.opacity = '0';
                previewImg.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    previewImg.style.transition = 'all 0.5s ease';
                    previewImg.style.opacity = '1';
                    previewImg.style.transform = 'scale(1)';
                }, 100);
                
                showNotification('Batik berhasil digenerate! Silakan download hasilnya.');
            } else {
                throw new Error(data.error || 'Unknown error');
            }
        } catch (err) {
            console.error('Generate error:', err);
            showNotification('Error generating image. Coba lagi.', 'error');
        } finally {
            loading.classList.add("hidden");
        }
    });

    // Fix download background issue
    downloadImg.addEventListener('click', function(e) {
        // Ensure white background for downloaded image
        const tempImg = new Image();
        tempImg.crossOrigin = 'anonymous';
        tempImg.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = tempImg.width;
            canvas.height = tempImg.height;
            
            // Fill with white background
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw the batik image
            ctx.drawImage(tempImg, 0, 0);
            
            // Create new download link with white background
            const newDataUrl = canvas.toDataURL('image/png');
            const tempLink = document.createElement('a');
            tempLink.download = downloadImg.download.replace('.svg', '.png');
            tempLink.href = newDataUrl;
            tempLink.click();
        };
        tempImg.src = previewImg.src;
        
        e.preventDefault();
    });

    // Enter key support
    promptInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") btnGenerate.click();
    });

    // Editor canvas button
    if (btnCanvas) {
        btnCanvas.addEventListener("click", () => {
            window.location.href = "editor.html";
        });
    }

    // Mobile menu
    const mobileMenuButton = document.getElementById("mobile-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener("click", () => {
            const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
            mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Template card hover effects
    document.querySelectorAll('.template-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });

    // Notification system
    function showNotification(message, type = 'success') {
        const existingNotification = document.querySelector('.batik-notification');
        if (existingNotification) existingNotification.remove();

        const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';
        const notification = document.createElement('div');
        notification.className = `batik-notification fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 3000);
    }

    // Auto-focus and placeholder
    promptInput.placeholder = "Contoh: Batik Parang merah emas tradisional";
    promptInput.focus();

    // Mobile detection and adjustments
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
        document.body.classList.add('mobile-device');
        // Additional mobile adjustments can go here
    }

    console.log('Batik AI Generator initialized successfully!');
});