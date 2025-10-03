// app.js - Full Version for Batik AI Generator
document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const btnGenerate = document.getElementById("btn-generate");
  const promptInput = document.getElementById("prompt-input");
  const previewContainer = document.getElementById("preview-container");
  const previewImg = document.getElementById("preview-img");
  const downloadImg = document.getElementById("download-img");
  const loading = document.getElementById("loading");
  const btnCanvas = document.getElementById("btn-canvas");

  // Auto-detect environment untuk API URL
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const API_URL = isDevelopment 
    ? 'http://localhost:5000/api/generate' 
    : '/api/generate';

  console.log('Environment:', isDevelopment ? 'Development' : 'Production');
  console.log('API URL:', API_URL);

  // State management
  let selectedTemplate = null;
  
  // Initialize Feather Icons
  if (typeof feather !== 'undefined') {
    feather.replace();
  }

  // ===== TEMPLATE SELECTION FUNCTIONALITY =====
  
  // Handle template selection
  document.querySelectorAll('.select-template').forEach(button => {
    button.addEventListener('click', (e) => {
      // Remove active class from all buttons
      document.querySelectorAll('.select-template').forEach(btn => {
        btn.classList.remove('bg-green-600', 'text-white');
        btn.classList.add('btn-gold');
      });
      
      // Add active class to clicked button
      e.target.classList.remove('btn-gold');
      e.target.classList.add('bg-green-600', 'text-white');
      
      selectedTemplate = e.target.dataset.template.toLowerCase().replace(' ', '');
      
      const templateName = e.target.dataset.template;
      promptInput.value = `Batik ${templateName} dengan desain modern`;
      promptInput.focus();
      
      showNotification(`Template ${templateName} dipilih! Silakan klik Generate.`);
    });
  });

  // ===== MAIN GENERATE FUNCTIONALITY =====

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
      
      if (selectedTemplate) {
        payload.template = selectedTemplate;
      }

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

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
      
      // Fallback ke client-side generation
      showNotification('Menggunakan generator fallback...');
      const imageData = generateClientSideBatik(prompt, selectedTemplate);
      previewImg.src = imageData;
      downloadImg.href = imageData;
      previewContainer.classList.remove("hidden");
    } finally {
      loading.classList.add("hidden");
    }
  });

  // ===== CLIENT-SIDE FALLBACK GENERATOR =====

  function generateClientSideBatik(prompt, template) {
    const colors = extractColorsFromPrompt(prompt);
    const patternType = template || detectPatternType(prompt);
    
    const width = 512;
    const height = 512;
    
    // Simple SVG generation sebagai fallback
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${colors.background}"/>
        <circle cx="256" cy="256" r="120" fill="${colors.primary}" opacity="0.8"/>
        <circle cx="256" cy="256" r="80" fill="${colors.secondary}" opacity="0.9"/>
        <circle cx="256" cy="256" r="40" fill="${colors.accent || '#000000'}" opacity="0.7"/>
        <text x="50%" y="90%" text-anchor="middle" font-family="Arial" font-size="16" fill="${colors.primary}">
          Batik ${patternType} (Client-side)
        </text>
      </svg>
    `;
    
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
  }

  function extractColorsFromPrompt(prompt) {
    const promptLower = prompt.toLowerCase();
    const colors = { 
      background: '#f5f5dc',
      primary: '#8b4513',
      secondary: '#daa520',
      accent: '#000000'
    };

    const colorKeywords = {
      'merah': '#c02e2e', 'biru': '#6f7bb5', 'emas': '#d4af37',
      'hijau': '#2e8b57', 'kuning': '#ffd700', 'ungu': '#9370db',
      'hitam': '#000000', 'putih': '#ffffff', 'coklat': '#8b4513'
    };

    for (const [keyword, hex] of Object.entries(colorKeywords)) {
      if (promptLower.includes(keyword)) {
        colors.primary = hex;
        break;
      }
    }

    // Auto-adjust background for contrast
    if (colors.primary === '#000000') colors.background = '#ffffff';
    if (colors.primary === '#ffffff') colors.background = '#2c3e50';

    return colors;
  }

  function detectPatternType(prompt) {
    const promptLower = prompt.toLowerCase();
    
    const patternKeywords = {
      'parang': 'Parang',
      'kawung': 'Kawung', 
      'mega mendung': 'Mega Mendung',
      'keraton': 'Keraton',
      'paksi naga liman': 'Paksi Naga Liman',
      'patran keris': 'Patran Keris',
      'singa barong': 'Singa Barong',
      'sekar jagad': 'Sekar Jagad',
      'wadasan': 'Wadasan',
      'taman arum': 'Taman Arum',
      'truntum': 'Truntum',
      'bunga': 'Floral',
      'modern': 'Geometric'
    };

    for (const [keyword, pattern] of Object.entries(patternKeywords)) {
      if (promptLower.includes(keyword)) return pattern;
    }
    
    return 'Modern';
  }

  // ===== UI ENHANCEMENTS =====

  // Enter key support
  promptInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      btnGenerate.click();
    }
  });

  // Auto-focus on input
  promptInput.focus();

  // Example prompts for placeholder
  const promptExamples = [
    "Batik Parang merah emas tradisional",
    "Batik Mega Mendung biru putih modern", 
    "Batik Kawung coklat emas klasik",
    "Batik Keraton hitam emas mewah",
    "Batik Sekar Jagad warna earth tone",
    "Batik floral modern dengan warna pastel"
  ];

  // Set random example placeholder
  promptInput.placeholder = promptExamples[Math.floor(Math.random() * promptExamples.length)];

  // Handle editor canvas button
  if (btnCanvas) {
    btnCanvas.addEventListener("click", () => {
      window.location.href = "editor.html";
    });
  }

  // Mobile menu functionality
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
      const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
      mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('hidden');
      
      // Update icon
      const icon = mobileMenuButton.querySelector('i');
      if (icon) {
        icon.setAttribute('data-feather', mobileMenu.classList.contains('hidden') ? 'menu' : 'x');
        feather.replace();
      }
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add interactive effects to template cards
  document.querySelectorAll('.template-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-8px)';
      card.style.transition = 'all 0.3s ease';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });

  // ===== NOTIFICATION SYSTEM =====

  function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.batik-notification');
    if (existingNotification) {
      existingNotification.remove();
    }

    const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';
    
    const notification = document.createElement('div');
    notification.className = `batik-notification fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-sm`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // ===== LOADING STATE MANAGEMENT =====

  function setLoadingState(isLoading) {
    if (isLoading) {
      loading.classList.remove("hidden");
      btnGenerate.disabled = true;
      btnGenerate.innerHTML = '<i data-feather="loader" class="animate-spin mr-2"></i> Generating...';
    } else {
      loading.classList.add("hidden");
      btnGenerate.disabled = false;
      btnGenerate.innerHTML = '<i data-feather="sparkles" class="mr-2"></i> Generate';
    }
    feather.replace();
  }

  // Initialize
  console.log('Batik AI Generator initialized successfully!');
});