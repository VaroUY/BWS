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
    ],
    // Mazo de Cartas (68 cartas)
    masoCartas: [
        ['x2','H',"_imagenes/_cartas/HeinekenX2.png"],
        ['x2','H',"_imagenes/_cartas/HeinekenX2.png"],
        ['x2','H',"_imagenes/_cartas/HeinekenX2.png"],
        ['/2','H',"_imagenes/_cartas/HeinekenDIV2.png"],
        ['/2','H',"_imagenes/_cartas/HeinekenDIV2.png"],
        ['/2','H',"_imagenes/_cartas/HeinekenDIV2.png"],
        ['600','H',"_imagenes/_cartas/Heineken600.png"],
        ['600','H',"_imagenes/_cartas/Heineken600.png"],
        ['600','H',"_imagenes/_cartas/Heineken600.png"],
        ['600','H',"_imagenes/_cartas/Heineken600.png"],
        ['500','H',"_imagenes/_cartas/Heineken500.png"],
        ['500','H',"_imagenes/_cartas/Heineken500.png"],
        ['500','H',"_imagenes/_cartas/Heineken500.png"],
        ['500','H',"_imagenes/_cartas/Heineken500.png"],
        ['1000','H',"_imagenes/_cartas/Heineken1000.png"],
        ['1000','H',"_imagenes/_cartas/Heineken1000.png"],
        ['1000','H',"_imagenes/_cartas/Heineken1000.png"],
        ['x2','G',"_imagenes/_cartas/GatoradeX2.png"],
        ['x2','G',"_imagenes/_cartas/GatoradeX2.png"],
        ['x2','G',"_imagenes/_cartas/GatoradeX2.png"],
        ['/2','G',"_imagenes/_cartas/GatoradeDIV2.png"],
        ['/2','G',"_imagenes/_cartas/GatoradeDIV2.png"],
        ['/2','G',"_imagenes/_cartas/GatoradeDIV2.png"],
        ['600','G',"_imagenes/_cartas/Gatorade600.png"],
        ['600','G',"_imagenes/_cartas/Gatorade600.png"],
        ['600','G',"_imagenes/_cartas/Gatorade600.png"],
        ['600','G',"_imagenes/_cartas/Gatorade600.png"],
        ['500','G',"_imagenes/_cartas/Gatorade500.png"],
        ['500','G',"_imagenes/_cartas/Gatorade500.png"],
        ['500','G',"_imagenes/_cartas/Gatorade500.png"],
        ['500','G',"_imagenes/_cartas/Gatorade500.png"],
        ['1000','G',"_imagenes/_cartas/Gatorade1000.png"],
        ['1000','G',"_imagenes/_cartas/Gatorade1000.png"],
        ['1000','G',"_imagenes/_cartas/Gatorade1000.png"],
        ['x2','M',"_imagenes/_cartas/McDonaldsX2.png"],
        ['x2','M',"_imagenes/_cartas/McDonaldsX2.png"],
        ['x2','M',"_imagenes/_cartas/McDonaldsX2.png"],
        ['/2','M',"_imagenes/_cartas/McDonaldsDIV2.png"],
        ['/2','M',"_imagenes/_cartas/McDonaldsDIV2.png"],
        ['/2','M',"_imagenes/_cartas/McDonaldsDIV2.png"],
        ['600','M',"_imagenes/_cartas/McDonalds600.png"],
        ['600','M',"_imagenes/_cartas/McDonalds600.png"],
        ['600','M',"_imagenes/_cartas/McDonalds600.png"],
        ['600','M',"_imagenes/_cartas/McDonalds600.png"],
        ['500','M',"_imagenes/_cartas/McDonalds500.png"],
        ['500','M',"_imagenes/_cartas/McDonalds500.png"],
        ['500','M',"_imagenes/_cartas/McDonalds500.png"],
        ['500','M',"_imagenes/_cartas/McDonalds500.png"],
        ['1000','M',"_imagenes/_cartas/McDonalds1000.png"],
        ['1000','M',"_imagenes/_cartas/McDonalds1000.png"],
        ['1000','M',"_imagenes/_cartas/McDonalds1000.png"],
        ['x2','N',"_imagenes/_cartas/NikeX2.png"],
        ['x2','N',"_imagenes/_cartas/NikeX2.png"],
        ['x2','N',"_imagenes/_cartas/NikeX2.png"],
        ['/2','N',"_imagenes/_cartas/NikeDIV2.png"],
        ['/2','N',"_imagenes/_cartas/NikeDIV2.png"],
        ['/2','N',"_imagenes/_cartas/NikeDIV2.png"],
        ['600','N',"_imagenes/_cartas/Nike600.png"],
        ['600','N',"_imagenes/_cartas/Nike600.png"],
        ['600','N',"_imagenes/_cartas/Nike600.png"],
        ['600','N',"_imagenes/_cartas/Nike600.png"],
        ['500','N',"_imagenes/_cartas/Nike500.png"],
        ['500','N',"_imagenes/_cartas/Nike500.png"],
        ['500','N',"_imagenes/_cartas/Nike500.png"],
        ['500','N',"_imagenes/_cartas/Nike500.png"],
        ['1000','N',"_imagenes/_cartas/Nike1000.png"],
        ['1000','N',"_imagenes/_cartas/Nike1000.png"],
        ['1000','N',"_imagenes/_cartas/Nike1000.png"]
    ]
};

// --- 2. FUNCIÓN PARA ENTREVERAR EL MAZO ---
function entreverarMazo(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Ejecutamos el entrevero de cartas ni bien se inicia el servidor
entreverarMazo(estadoJuego.masoCartas);
console.log('**************************************************');
console.log('* INICIO SERVIDOR NODE : BWS by Varo             *');
console.log('* Inicializando maso de cartas y entreverando ...*');
console.log('**************************************************');
console.log("* > Mazo 68 cartas creado y entreverado: Done    *");
console.log('**************************************************');


let usuariosConectados = {};

io.on('connection', (socket) => {
    
    // Registramos al usuario en la lista técnica
    usuariosConectados[socket.id] = {
        socketId: socket.id,
        fechaConexion: new Date()
    };
 
   // A. LOG DE CONEXIÓN
    console.log('==> Nuevo usuario conectado. ID Socket: ' + socket.id + " " + usuariosConectados[socket.id].fechaConexion);
    
    // B. ENVIAR ESTADO INICIAL
    // Apenas entra, le damos la "foto" actual del juego para que no empiece en cero
    socket.emit('actualizarCliente', estadoJuego);

    // C. RECIBIR JUGADA DESDE UN CLIENTE
    socket.on('enviarJugadaAlServidor', (datosRecibidos) => {
        console.log('--- Recibiendo actualización de datos del juego ---');
        
        // 1. Actualizamos la base de datos del servidor
        // Solo copiamos precios y jugadores para no sobreescribir el mazo del servidor
        estadoJuego.precios = datosRecibidos.precios;
        estadoJuego.jugadores = datosRecibidos.jugadores;

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
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('* BWS LISTO PARA JUGAR EN PUERTO 3000            *');
    console.log('* Esperando jugadores...                         *');
    console.log('**************************************************');
    console.log('                                                  ');

});