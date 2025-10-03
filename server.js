// server.js (ESM) - Full Version for Vercel
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve folder public
app.use(express.static(path.join(__dirname, "public")));

// Enhanced Batik Pattern Generator dengan design realistis
class BatikPatternGenerator {
    constructor() {
        this.patterns = {
            parang: this.generateParangPattern.bind(this),
            kawung: this.generateKawungPattern.bind(this),
            megamendung: this.generateMegaMendungPattern.bind(this),
            keraton: this.generateKeratonPattern.bind(this),
            paksinagaliman: this.generatePaksiNagaLimanPattern.bind(this),
            patrankeris: this.generatePatranKerisPattern.bind(this),
            singabarong: this.generateSingaBarongPattern.bind(this),
            sekarjagad: this.generateSekarJagadPattern.bind(this),
            wadasan: this.generateWadasanPattern.bind(this),
            tamanarum: this.generateTamanArumPattern.bind(this),
            truntum: this.generateTruntumPattern.bind(this),
            geometric: this.generateGeometricPattern.bind(this),
            floral: this.generateFloralPattern.bind(this)
        };
    }

    generateFromPrompt(prompt, template = null) {
        const colors = this.extractColorsFromPrompt(prompt);
        const patternType = template || this.detectPatternType(prompt);
        
        console.log(`🎨 Generating ${patternType} pattern with colors:`, colors);
        
        // Pastikan pattern ada, jika tidak gunakan geometric
        const patternMethod = this.patterns[patternType] || this.patterns.geometric;
        
        return patternMethod(colors);
    }

    // ===== REALISTIC PATTERN GENERATORS =====
    
    generateParangPattern(colors) {
        const width = 512;
        const height = 512;
        let elements = '';
        const spacing = 35;
        
        // Background texture
        elements += `<rect width="100%" height="100%" fill="${colors.background}" opacity="0.9"/>`;
        
        // Main diagonal lines
        for (let i = -height; i < width + height; i += spacing) {
            elements += `
                <line x1="${i}" y1="0" x2="${i + height}" y2="${height}" 
                      stroke="${colors.primary}" stroke-width="6" stroke-linecap="round"/>
            `;
        }
        
        // Ornament details
        for (let i = -height + spacing/2; i < width + height; i += spacing * 2) {
            for (let j = 80; j < height; j += 120) {
                const x = i + j;
                const y = j;
                if (x >= 50 && x < width - 50 && y >= 50 && y < height - 50) {
                    elements += `
                        <ellipse cx="${x}" cy="${y}" rx="8" ry="4" fill="${colors.secondary}" opacity="0.7"/>
                    `;
                }
            }
        }
        
        const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
            ${elements}
            <text x="50%" y="95%" text-anchor="middle" font-family="Arial" font-size="20" fill="${colors.primary}" font-weight="bold">
                Batik Parang
            </text>
        </svg>`;
        
        return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
    }

    generateKawungPattern(colors) {
        const width = 512;
        const height = 512;
        let elements = '';
        const gridSize = 70;
        
        // Background
        elements += `<rect width="100%" height="100%" fill="${colors.background}"/>`;
        
        // Main oval grid
        for (let x = gridSize/2; x < width; x += gridSize) {
            for (let y = gridSize/2; y < height; y += gridSize) {
                const variation = 0.8 + Math.random() * 0.4;
                
                elements += `
                    <ellipse cx="${x}" cy="${y}" rx="${20*variation}" ry="${15*variation}" 
                             fill="${colors.primary}"/>
                    <ellipse cx="${x}" cy="${y}" rx="${8*variation}" ry="${6*variation}" 
                             fill="${colors.secondary}"/>
                    <line x1="${x-10*variation}" y1="${y}" x2="${x+10*variation}" y2="${y}" 
                          stroke="${colors.accent}" stroke-width="${2*variation}" opacity="0.8"/>
                    <line x1="${x}" y1="${y-8*variation}" x2="${x}" y2="${y+8*variation}" 
                          stroke="${colors.accent}" stroke-width="${2*variation}" opacity="0.8"/>
                `;
            }
        }
        
        const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
            ${elements}
            <text x="50%" y="95%" text-anchor="middle" font-family="Arial" font-size="20" fill="${colors.primary}" font-weight="bold">
                Batik Kawung
            </text>
        </svg>`;
        
        return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
    }

    generateMegaMendungPattern(colors) {
        const width = 512;
        const height = 512;
        let elements = '';
        
        // Sky gradient background
        elements += `
            <defs>
                <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#87CEEB"/>
                    <stop offset="100%" stop-color="#E6F3FF"/>
                </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#sky)"/>
        `;
        
        // Cloud layers
        const clouds = [
            { x: 100, y: 120, size: 100 },
            { x: 250, y: 80, size: 120 },
            { x: 380, y: 150, size: 90 },
            { x: 150, y: 220, size: 110 },
            { x: 320, y: 250, size: 95 }
        ];
        
        clouds.forEach(cloud => {
            const cloudColor = colors.primary;
            elements += this.createCloud(cloud.x, cloud.y, cloud.size, cloudColor);
        });
        
        const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
            ${elements}
            <text x="50%" y="95%" text-anchor="middle" font-family="Arial" font-size="20" fill="${colors.primary}" font-weight="bold">
                Batik Mega Mendung
            </text>
        </svg>`;
        
        return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
    }

    createCloud(x, y, size, color) {
        return `
            <ellipse cx="${x}" cy="${y}" rx="${size*0.8}" ry="${size*0.5}" fill="${color}" opacity="0.7"/>
            <ellipse cx="${x-size*0.3}" cy="${y}" rx="${size*0.4}" ry="${size*0.3}" fill="${color}" opacity="0.8"/>
            <ellipse cx="${x+size*0.3}" cy="${y}" rx="${size*0.4}" ry="${size*0.3}" fill="${color}" opacity="0.8"/>
        `;
    }

    generateKeratonPattern(colors) {
        const width = 512;
        const height = 512;
        let elements = '';
        
        // Background
        elements += `<rect width="100%" height="100%" fill="${colors.background}"/>`;
        
        // Ornate border
        elements += `
            <rect x="30" y="30" width="${width-60}" height="${height-60}" 
                  fill="none" stroke="${colors.primary}" stroke-width="8" stroke-linejoin="round"/>
            
            <!-- Corner decorations -->
            <rect x="30" y="30" width="60" height="60" fill="${colors.secondary}" opacity="0.8"/>
            <rect x="${width-90}" y="30" width="60" height="60" fill="${colors.secondary}" opacity="0.8"/>
            <rect x="30" y="${height-90}" width="60" height="60" fill="${colors.secondary}" opacity="0.8"/>
            <rect x="${width-90}" y="${height-90}" width="60" height="60" fill="${colors.secondary}" opacity="0.8"/>
        `;
        
        // Central royal emblem
        elements += `
            <circle cx="${width/2}" cy="${height/2}" r="80" fill="${colors.primary}" opacity="0.8"/>
            <circle cx="${width/2}" cy="${height/2}" r="50" fill="${colors.secondary}" opacity="0.9"/>
            <circle cx="${width/2}" cy="${height/2}" r="20" fill="${colors.accent}" opacity="0.7"/>
        `;
        
        const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
            ${elements}
            <text x="50%" y="95%" text-anchor="middle" font-family="Arial" font-size="20" fill="${colors.primary}" font-weight="bold">
                Batik Keraton
            </text>
        </svg>`;
        
        return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
    }

    generatePaksiNagaLimanPattern(colors) {
        const width = 512;
        const height = 512;
        let elements = '';
        
        elements += `<rect width="100%" height="100%" fill="${colors.background}"/>`;
        
        // Mythological creature elements
        elements += `
            <!-- Bird (Paksi) -->
            <ellipse cx="150" cy="200" rx="40" ry="25" fill="${colors.primary}"/>
            <ellipse cx="130" cy="190" rx="20" ry="12" fill="${colors.secondary}"/>
            
            <!-- Dragon (Naga) -->
            <ellipse cx="350" cy="200" rx="45" ry="30" fill="${colors.secondary}"/>
            <ellipse cx="380" cy="190" rx="25" ry="15" fill="${colors.primary}"/>
            
            <!-- Elephant (Liman) -->
            <ellipse cx="250" cy="350" rx="50" ry="35" fill="${colors.accent}"/>
            <ellipse cx="270" cy="340" rx="30" ry="20" fill="${colors.primary}"/>
        `;
        
        const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
            ${elements}
            <text x="50%" y="95%" text-anchor="middle" font-family="Arial" font-size="18" fill="${colors.primary}" font-weight="bold">
                Paksi Naga Liman
            </text>
        </svg>`;
        
        return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
    }

    generatePatranKerisPattern(colors) {
        const width = 512;
        const height = 512;
        let elements = '';
        
        elements += `<rect width="100%" height="100%" fill="${colors.background}"/>`;
        
        // Keris and leaf patterns
        elements += `
            <!-- Keris shapes -->
            <rect x="150" y="100" width="8" height="120" fill="${colors.primary}"/>
            <rect x="350" y="100" width="8" height="120" fill="${colors.primary}"/>
            <rect x="150" y="300" width="8" height="120" fill="${colors.primary}"/>
            <rect x="350" y="300" width="8" height="120" fill="${colors.primary}"/>
            
            <!-- Leaf shapes -->
            <ellipse cx="150" cy="250" rx="25" ry="12" fill="${colors.secondary}"/>
            <ellipse cx="350" cy="250" rx="25" ry="12" fill="${colors.secondary}"/>
            <ellipse cx="150" cy="450" rx="25" ry="12" fill="${colors.secondary}"/>
            <ellipse cx="350" cy="450" rx="25" ry="12" fill="${colors.secondary}"/>
        `;
        
        const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
            ${elements}
            <text x="50%" y="95%" text-anchor="middle" font-family="Arial" font-size="18" fill="${colors.primary}" font-weight="bold">
                Patran Keris
            </text>
        </svg>`;
        
        return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
    }

    generateSingaBarongPattern(colors) {
        const width = 512;
        const height = 512;
        let elements = '';
        
        elements += `<rect width="100%" height="100%" fill="${colors.background}"/>`;
        
        // Singa Barong design
        elements += `
            <!-- Lion body -->
            <ellipse cx="256" cy="280" rx="100" ry="60" fill="${colors.primary}"/>
            
            <!-- Head -->
            <circle cx="320" cy="220" r="50" fill="${colors.primary}"/>
            
            <!-- Crown -->
            <rect x="240" y="160" width="15" height="40" fill="${colors.secondary}"/>
            <rect x="265" y="160" width="15" height="40" fill="${colors.secondary}"/>
            <rect x="290" y="160" width="15" height="40" fill="${colors.secondary}"/>
            <rect x="315" y="160" width="15" height="40" fill="${colors.secondary}"/>
            <rect x="340" y="160" width="15" height="40" fill="${colors.secondary}"/>
        `;
        
        const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
            ${elements}
            <text x="50%" y="95%" text-anchor="middle" font-family="Arial" font-size="18" fill="${colors.primary}" font-weight="bold">
                Singa Barong
            </text>
        </svg>`;
        
        return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
    }

    generateSekarJagadPattern(colors) {
        const width = 512;
        const height = 512;
        let elements = '';
        
        elements += `<rect width="100%" height="100%" fill="${this.lightenColor(colors.background, 15)}"/>`;
        
        // World map pattern dengan flowers
        elements += `
            <!-- Continent shapes -->
            <ellipse cx="150" cy="200" rx="80" ry="50" fill="${colors.primary}" opacity="0.6"/>
            <ellipse cx="350" cy="300" rx="70" ry="45" fill="${colors.primary}" opacity="0.6"/>
            
            <!-- Flowers -->
            <circle cx="100" cy="100" r="30" fill="${colors.secondary}"/>
            <circle cx="400" cy="100" r="25" fill="${colors.secondary}"/>
            <circle cx="100" cy="400" r="28" fill="${colors.secondary}"/>
            <circle cx="400" cy="400" r="32" fill="${colors.secondary}"/>
            <circle cx="250" cy="250" r="35" fill="${colors.primary}"/>
        `;
        
        const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
            ${elements}
            <text x="50%" y="95%" text-anchor="middle" font-family="Arial" font-size="18" fill="${colors.primary}" font-weight="bold">
                Sekar Jagad
            </text>
        </svg>`;
        
        return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
    }

    generateWadasanPattern(colors) {
        const width = 512;
        const height = 512;
        let elements = '';
        
        elements += `<rect width="100%" height="100%" fill="${colors.background}"/>`;
        
        // Rock formations
        elements += `
            <circle cx="150" cy="150" r="60" fill="${colors.primary}"/>
            <circle cx="350" cy="200" r="55" fill="${colors.primary}"/>
            <circle cx="250" cy="350" r="65" fill="${colors.primary}"/>
            <circle cx="400" cy="350" r="50" fill="${colors.primary}"/>
            <circle cx="180" cy="280" r="45" fill="${colors.secondary}"/>
        `;
        
        const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
            ${elements}
            <text x="50%" y="95%" text-anchor="middle" font-family="Arial" font-size="18" fill="${colors.primary}" font-weight="bold">
                Wadasan
            </text>
        </svg>`;
        
        return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
    }

    generateTamanArumPattern(colors) {
        const width = 512;
        const height = 512;
        let elements = '';
        
        elements += `<rect width="100%" height="100%" fill="#e8f5e8"/>`;
        
        // Garden dengan berbagai bunga
        elements += `
            <!-- Flowers -->
            <circle cx="150" cy="150" r="35" fill="${colors.primary}"/>
            <circle cx="350" cy="200" r="30" fill="${colors.primary}"/>
            <circle cx="250" cy="350" r="40" fill="${colors.primary}"/>
            <circle cx="400" cy="300" r="25" fill="${colors.primary}"/>
            <circle cx="180" cy="280" r="30" fill="${colors.secondary}"/>
            
            <!-- Flower centers -->
            <circle cx="150" cy="150" r="12" fill="${colors.secondary}"/>
            <circle cx="350" cy="200" r="10" fill="${colors.secondary}"/>
            <circle cx="250" cy="350" r="15" fill="${colors.secondary}"/>
            <circle cx="400" cy="300" r="8" fill="${colors.secondary}"/>
            <circle cx="180" cy="280" r="10" fill="${colors.primary}"/>
        `;
        
        const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
            ${elements}
            <text x="50%" y="95%" text-anchor="middle" font-family="Arial" font-size="18" fill="${colors.primary}" font-weight="bold">
                Taman Arum
            </text>
        </svg>`;
        
        return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
    }

    generateTruntumPattern(colors) {
        const width = 512;
        const height = 512;
        let elements = '';
        
        elements += `<rect width="100%" height="100%" fill="${colors.background}"/>`;
        
        // Scattered stars
        for (let i = 0; i < 25; i++) {
            const x = 50 + Math.random() * (width - 100);
            const y = 50 + Math.random() * (height - 100);
            const size = 8 + Math.random() * 15;
            
            elements += `
                <circle cx="${x}" cy="${y}" r="${size}" fill="${colors.primary}"/>
                <circle cx="${x}" cy="${y}" r="${size/2}" fill="${colors.secondary}"/>
            `;
        }
        
        const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
            ${elements}
            <text x="50%" y="95%" text-anchor="middle" font-family="Arial" font-size="18" fill="${colors.primary}" font-weight="bold">
                Truntum
            </text>
        </svg>`;
        
        return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
    }

    generateGeometricPattern(colors) {
        const width = 512;
        const height = 512;
        let elements = '';
        
        elements += `<rect width="100%" height="100%" fill="${colors.background}"/>`;
        
        // Complex geometric pattern
        const size = 50;
        for (let x = 0; x < width; x += size) {
            for (let y = 0; y < height; y += size) {
                if (Math.random() > 0.4) {
                    elements += `
                        <rect x="${x+5}" y="${y+5}" width="${size-10}" height="${size-10}" 
                              fill="${colors.primary}"/>
                    `;
                }
            }
        }
        
        const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
            ${elements}
            <text x="50%" y="95%" text-anchor="middle" font-family="Arial" font-size="18" fill="${colors.primary}" font-weight="bold">
                Geometric Pattern
            </text>
        </svg>`;
        
        return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
    }

    generateFloralPattern(colors) {
        const width = 512;
        const height = 512;
        let elements = '';
        
        elements += `<rect width="100%" height="100%" fill="${colors.background}"/>`;
        
        // Various flower types
        const flowerSpacing = 80;
        for (let x = flowerSpacing/2; x < width; x += flowerSpacing) {
            for (let y = flowerSpacing/2; y < height; y += flowerSpacing) {
                // Flower center
                elements += `<circle cx="${x}" cy="${y}" r="12" fill="${colors.primary}"/>`;
                
                // Petals
                for (let i = 0; i < 6; i++) {
                    const angle = (i * Math.PI * 2) / 6;
                    const px = x + Math.cos(angle) * 25;
                    const py = y + Math.sin(angle) * 25;
                    elements += `<ellipse cx="${px}" cy="${py}" rx="15" ry="8" fill="${colors.secondary}"/>`;
                }
            }
        }
        
        const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
            ${elements}
            <text x="50%" y="95%" text-anchor="middle" font-family="Arial" font-size="18" fill="${colors.primary}" font-weight="bold">
                Floral Pattern
            </text>
        </svg>`;
        
        return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
    }

    // ===== HELPER METHODS =====

    extractColorsFromPrompt(prompt) {
        const promptLower = prompt.toLowerCase();
        const colors = { 
            background: '#f5f5dc',
            primary: '#8b4513',
            secondary: '#daa520',
            accent: '#000000'
        };

        const colorKeywords = {
            'merah': '#c02e2e', 'red': '#c02e2e',
            'biru': '#6f7bb5', 'blue': '#6f7bb5',
            'emas': '#d4af37', 'gold': '#d4af37',
            'hijau': '#2e8b57', 'green': '#2e8b57',
            'kuning': '#ffd700', 'yellow': '#ffd700',
            'ungu': '#9370db', 'purple': '#9370db',
            'hitam': '#000000', 'black': '#000000',
            'putih': '#ffffff', 'white': '#ffffff',
            'coklat': '#8b4513', 'brown': '#8b4513'
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
        if (colors.primary === '#ffd700' || colors.primary === '#daa520') {
            colors.background = '#2c1810';
        }

        return colors;
    }

    detectPatternType(prompt) {
        const promptLower = prompt.toLowerCase();
        
        const patternKeywords = {
            'parang': 'parang',
            'kawung': 'kawung',
            'mega mendung': 'megamendung', 'megamendung': 'megamendung',
            'keraton': 'keraton', 'keratonan': 'keraton',
            'paksi naga liman': 'paksinagaliman', 'paksinagaliman': 'paksinagaliman',
            'patran keris': 'patrankeris', 'patrankeris': 'patrankeris',
            'singa barong': 'singabarong', 'singabarong': 'singabarong',
            'sekar jagad': 'sekarjagad', 'sekarjagad': 'sekarjagad',
            'wadasan': 'wadasan',
            'taman arum': 'tamanarum', 'tamanarum': 'tamanarum',
            'truntum': 'truntum',
            'bunga': 'floral', 'floral': 'floral',
            'modern': 'geometric'
        };

        for (const [keyword, pattern] of Object.entries(patternKeywords)) {
            if (promptLower.includes(keyword)) return pattern;
        }
        
        return 'geometric';
    }

    lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return "#" + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
    }
}

// API Routes
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt, template } = req.body;
    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ error: "Prompt tidak boleh kosong" });
    }

    console.log("🎨 Generate batik dengan:", { prompt, template });

    const generator = new BatikPatternGenerator();
    const imageData = generator.generateFromPrompt(prompt, template);

    console.log("✅ Gambar berhasil di-generate");

    res.json({ image: imageData });
  } catch (err) {
    console.error("❌ Generate Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Health check endpoint untuk Vercel
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Batik AI Generator API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// Handle SPA routing - serve index.html for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server hanya jika tidak di Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`🌐 Akses utama: http://localhost:${PORT}`);
    console.log(`🌐 Akses editor: http://localhost:${PORT}/editor.html`);
    console.log(`🎨 Batik Generator siap! (11 patterns available)`);
  });
}

export default app;