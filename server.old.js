

// server para BWS by Varo.
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Servimos los archivos de la carpeta actual (html, css, js, imagenes)
app.use(express.static(__dirname));

// --- 1. BASE DE DATOS DEL JUEGO (Memoria del Servidor) ---
let estadoJuego = {

    // Precios Globales
    precios: { 
        heineken: 1000, 
        nike: 1000, 
        gatorade: 1000, 
        mcdonalds: 1000 
    },
    // Variables de entorno
    entorno: {
        IndiceJuego: 0,
        TurnoJugador : 0,
    },
    // Tabla de Jugadores (4 puestos fijos)
    jugadores: [
        { id: 1, nombre: "Sin Asignar", cash: 0, h: 0, n: 0, g: 0, m: 0 },
        { id: 2, nombre: "Sin Asignar", cash: 0, h: 0, n: 0, g: 0, m: 0 },
        { id: 3, nombre: "Sin Asignar", cash: 0, h: 0, n: 0, g: 0, m: 0 },
        { id: 4, nombre: "Sin Asignar", cash: 0, h: 0, n: 0, g: 0, m: 0 }
    ]
};

// Lista de conexiones técnicas (Socket ID -> Datos básicos)
let usuariosConectados = {};

io.on('connection', (socket) => {
    
    // Registramos al usuario en la lista técnica
    usuariosConectados[socket.id] = {
        socketId: socket.id,
        fechaConexion: new Date()
    };
 
   // A. LOG DE CONEXIÓN
    console.log('==> Nuevo usuario conectado. ID Socket: ' + socket.id);
    
 
    // B. ENVIAR ESTADO INICIAL
    // Apenas entra, le damos la "foto" actual del juego para que no empiece en cero
    socket.emit('actualizarCliente', estadoJuego);

    // C. RECIBIR JUGADA DESDE UN CLIENTE
    socket.on('enviarJugadaAlServidor', (datosRecibidos) => {
        console.log('--- Recibiendo actualización de datos del juego ---');
        
        // 1. Actualizamos la base de datos del servidor
        estadoJuego = datosRecibidos;

        // 2. Reenviamos la nueva información a TODOS los conectados (incluido el que la mandó)
        io.emit('actualizarCliente', estadoJuego);
    });

    // D. DESCONEXIÓN
    socket.on('disconnect', () => {
        console.log('<== Usuario desconectado: ' + socket.id);
        delete usuariosConectados[socket.id];
    });
});

// INICIO DEL SERVIDOR
server.listen(3000, () => {
    console.log('**************************************************');
    console.log('* SERVIDOR BWS LISTO EN PUERTO 3000             *');
    console.log('* Esperando jugadores...  a                      *');
    console.log('**************************************************');
});