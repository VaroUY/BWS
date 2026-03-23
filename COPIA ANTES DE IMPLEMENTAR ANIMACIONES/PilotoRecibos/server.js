import express from 'express';
import multer from 'multer';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// CONFIGURACIÓN CRUCIAL: Servir archivos estáticos (imágenes, logos, etc.)
// Esto permite que index.html cargue los archivos de la misma carpeta
app.use(express.static(__dirname));

// Inicialización de la IA con tu API KEY
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(express.json());

app.post('/analizar', upload.single('imageFile'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).send({ error: 'No se recibió imagen.' });

        console.log(`📸 Procesando: ${req.file.originalname}`);

        // Usamos gemini-flash-latest que es el que te funcionó por cuota
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const imageData = {
            inlineData: {
                data: req.file.buffer.toString("base64"),
                mimeType: req.file.mimetype,
            },
        };

        const prompt = "Actúa como un OCR experto. 1- Transcribe TODO el texto de la imagen de forma literal. 2- Extrae estos campos: Establecimiento, Identificacion_Fiscal, Fecha_Hora y Total. Responde ÚNICAMENTE en JSON: { \"texto_completo\": \"...\", \"datos_clave\": { \"Establecimiento\": \"\", \"Identificacion_Fiscal\": \"\", \"Fecha_Hora\": \"\", \"Total\": \"\" } }";

        const result = await model.generateContent([prompt, imageData]);
        const response = await result.response;
        let text = response.text();

        // Limpieza de formato JSON
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}') + 1;
        const jsonString = text.substring(start, end);
        
        res.json(JSON.parse(jsonString));

    } catch (error) {
        console.error("❌ Error:", error.message);
        
        if (error.message.includes('429')) {
            return res.status(429).json({ error: 'Cuota excedida. Espera 60 segundos.' });
        }
        
        res.status(500).json({ error: 'Error interno: ' + error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`\n🚀 Servidor EJECUTIVO listo en http://localhost:${PORT}`);
    console.log(`📡 Sirviendo archivos estáticos desde: ${__dirname}`);
});