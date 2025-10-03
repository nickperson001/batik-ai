// server.js (ESM) - Full Clean Version
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
app.use(express.static(path.join(__dirname, "public")));

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
        const patternMethod = this.patterns[patternType] || this.patterns.parang;
        
        return patternMethod(colors);
    }

    generateParangPattern(colors) {
        const width = 512, height = 512;
        let elements = '';
        const spacing = 35;
        
        for (let i = -height; i < width + height; i += spacing) {
            elements += `<line x1="${i}" y1="0" x2="${i + height}" y2="${height}" stroke="${colors.primary}" stroke-width="6"/>`;
        }
        
        const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="${colors.background}"/>
            ${elements}
            <text x="50%" y="95%" text-anchor="middle" font-family="Arial" font-size="20" fill="${colors.primary}">Batik Parang</text>
        </svg>`;
        
        return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
    }

    generateKawungPattern(colors) {
        const width = 512, height = 512;
        let elements = '';
        const gridSize = 70;
        
        for (let x = gridSize/2; x < width; x += gridSize) {
            for (let y = gridSize/2; y < height; y += gridSize) {
                elements += `<ellipse cx="${x}" cy="${y}" rx="20" ry="15" fill="${colors.primary}"/>`;
            }
        }
        
        const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="${colors.background}"/>
            ${elements}
            <text x="50%" y="95%" text-anchor="middle" font-family="Arial" font-size="20" fill="${colors.primary}">Batik Kawung</text>
        </svg>`;
        
        return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
    }

    generateMegaMendungPattern(colors) {
        const width = 512, height = 512;
        const elements = `
            <ellipse cx="150" cy="150" rx="80" ry="60" fill="${colors.primary}" opacity="0.8"/>
            <ellipse cx="300" cy="100" rx="70" ry="50" fill="${colors.primary}" opacity="0.7"/>
            <ellipse cx="400" cy="180" rx="60" ry="40" fill="${colors.primary}" opacity="0.6"/>
        `;
        
        const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#87CEEB"/>
            ${elements}
            <text x="50%" y="95%" text-anchor="middle" font-family="Arial" font-size="20" fill="${colors.primary}">Batik Mega Mendung</text>
        </svg>`;
        
        return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
    }

    generateKeratonPattern(colors) {
        const width = 512, height = 512;
        let elements = '';
        
        elements += `<rect x="30" y="30" width="${width-60}" height="${height-60}" fill="none" stroke="${colors.primary}" stroke-width="8"/>`;
        elements += `<circle cx="${width/2}" cy="${height/2}" r="60" fill="${colors.secondary}"/>`;
        
        const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="${colors.background}"/>
            ${elements}
            <text x="50%" y="95%" text-anchor="middle" font-family="Arial" font-size="20" fill="${colors.primary}">Batik Keraton</text>
        </svg>`;
        
        return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
    }

    generatePaksiNagaLimanPattern(colors) {
        const width = 512, height = 512;
        const elements = `
            <ellipse cx="150" cy="200" rx="40" ry="25" fill="${colors.primary}"/>
            <ellipse cx="350" cy="200" rx="35" ry="20" fill="${colors.secondary}"/>
            <ellipse cx="250" cy="350" rx="45" ry="30" fill="${colors.accent}"/>
        `;
        
        const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="${colors.background}"/>
            ${elements}
            <text x="50%" y="95%" text-anchor="middle" font-family="Arial" font-size="18" fill="${colors.primary}">Paksi Naga Liman</text>
        </svg>`;
        
        return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
    }

    generatePatranKerisPattern(colors) {
        const width = 512, height = 512;
        const elements = `
            <rect x="150" y="100" width="8" height="120" fill="${colors.primary}"/>
            <rect x="350" y="100" width="8" height="120" fill="${colors.primary}"/>
            <ellipse cx="150" cy="250" rx="25" ry="12" fill="${colors.secondary}"/>
            <ellipse cx="350" cy="250" rx="25" ry="12" fill="${colors.secondary}"/>
        `;
        
        const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="${colors.background}"/>
            ${elements}
            <text x="50%" y="95%" text-anchor="middle" font-family="Arial" font-size="18" fill="${colors.primary}">Patran Keris</text>
        </svg>`;
        
        return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
    }

    generateSingaBarongPattern(colors) {
        const width = 512, height = 512;
        const elements = `
            <ellipse cx="256" cy="280" rx="100" ry="60" fill="${colors.primary}"/>
            <circle cx="320" cy="220" r="40" fill="${colors.primary}"/>
        `;
        
        const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="${colors.background}"/>
            ${elements}
            <text x="50%" y="95%" text-anchor="middle" font-family="Arial" font-size="18" fill="${colors.primary}">Singa Barong</text>
        </svg>`;
        
        return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
    }

    generateSekarJagadPattern(colors) {
        const width = 512, height = 512;
        const elements = `
            <ellipse cx="150" cy="200" rx="80" ry="50" fill="${colors.primary}" opacity="0.6"/>
            <ellipse cx="350" cy="300" rx="70" ry="45" fill="${colors.primary}" opacity="0.6"/>
            <circle cx="250" cy="250" r="35" fill="${colors.secondary}"/>
        `;
        
        const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="${this.lightenColor(colors.background, 15)}"/>
            ${elements}
            <text x="50%" y="95%" text-anchor="middle" font-family="Arial" font-size="18" fill="${colors.primary}">Sekar Jagad</text>
        </svg>`;
        
        return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
    }

    generateWadasanPattern(colors) {
        const width = 512, height = 512;
        const elements = `
            <circle cx="150" cy="150" r="50" fill="${colors.primary}"/>
            <circle cx="350" cy="200" r="45" fill="${colors.primary}"/>
            <circle cx="250" cy="350" r="55" fill="${colors.primary}"/>
        `;
        
        const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="${colors.background}"/>
            ${elements}
            <text x="50%" y="95%" text-anchor="middle" font-family="Arial" font-size="18" fill="${colors.primary}">Wadasan</text>
        </svg>`;
        
        return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
    }

    generateTamanArumPattern(colors) {
        const width = 512, height = 512;
        const elements = `
            <circle cx="150" cy="150" r="30" fill="${colors.primary}"/>
            <circle cx="350" cy="200" r="25" fill="${colors.primary}"/>
            <circle cx="250" cy="350" r="35" fill="${colors.primary}"/>
        `;
        
        const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#e8f5e8"/>
            ${elements}
            <text x="50%" y="95%" text-anchor="middle" font-family="Arial" font-size="18" fill="${colors.primary}">Taman Arum</text>
        </svg>`;
        
        return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
    }

    generateTruntumPattern(colors) {
        const width = 512, height = 512;
        let elements = '';
        
        for (let i = 0; i < 20; i++) {
            const x = 50 + Math.random() * (width - 100);
            const y = 50 + Math.random() * (height - 100);
            const size = 8 + Math.random() * 12;
            elements += `<circle cx="${x}" cy="${y}" r="${size}" fill="${colors.primary}"/>`;
        }
        
        const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="${colors.background}"/>
            ${elements}
            <text x="50%" y="95%" text-anchor="middle" font-family="Arial" font-size="18" fill="${colors.primary}">Truntum</text>
        </svg>`;
        
        return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
    }

    generateGeometricPattern(colors) {
        const width = 512, height = 512;
        let elements = '';
        const size = 50;
        
        for (let x = 0; x < width; x += size) {
            for (let y = 0; y < height; y += size) {
                if (Math.random() > 0.4) {
                    elements += `<rect x="${x+5}" y="${y+5}" width="${size-10}" height="${size-10}" fill="${colors.primary}"/>`;
                }
            }
        }
        
        const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="${colors.background}"/>
            ${elements}
            <text x="50%" y="95%" text-anchor="middle" font-family="Arial" font-size="18" fill="${colors.primary}">Geometric Pattern</text>
        </svg>`;
        
        return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
    }

    generateFloralPattern(colors) {
        const width = 512, height = 512;
        let elements = '';
        const spacing = 80;
        
        for (let x = spacing/2; x < width; x += spacing) {
            for (let y = spacing/2; y < height; y += spacing) {
                elements += `<circle cx="${x}" cy="${y}" r="20" fill="${colors.primary}"/>`;
            }
        }
        
        const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="${colors.background}"/>
            ${elements}
            <text x="50%" y="95%" text-anchor="middle" font-family="Arial" font-size="18" fill="${colors.primary}">Floral Pattern</text>
        </svg>`;
        
        return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
    }

    extractColorsFromPrompt(prompt) {
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

        if (colors.primary === '#000000') colors.background = '#ffffff';
        if (colors.primary === '#ffffff') colors.background = '#2c3e50';

        return colors;
    }

    detectPatternType(prompt) {
        const promptLower = prompt.toLowerCase();
        const patternKeywords = {
            'parang': 'parang', 'kawung': 'kawung', 'mega mendung': 'megamendung',
            'keraton': 'keraton', 'paksi naga liman': 'paksinagaliman',
            'patran keris': 'patrankeris', 'singa barong': 'singabarong',
            'sekar jagad': 'sekarjagad', 'wadasan': 'wadasan',
            'taman arum': 'tamanarum', 'truntum': 'truntum',
            'bunga': 'floral', 'modern': 'geometric'
        };

        for (const [keyword, pattern] of Object.entries(patternKeywords)) {
            if (promptLower.includes(keyword)) return pattern;
        }
        
        return 'parang';
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

app.post("/api/generate", async (req, res) => {
    try {
        const { prompt, template } = req.body;
        if (!prompt || prompt.trim() === "") {
            return res.status(400).json({ error: "Prompt tidak boleh kosong" });
        }

        const generator = new BatikPatternGenerator();
        const imageData = generator.generateFromPrompt(prompt, template);

        res.json({ image: imageData });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/health", (req, res) => {
    res.json({ status: "OK", message: "Batik AI Generator API is running" });
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
    });
}

export default app;