

//----------------------------------------------------------------------------------------------------------------//
//---------------------------------------- server para BWS by Varo -----------------------------------------------//
//----------------------------------------------------------------------------------------------------------------//

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// ------- 1. DEFINICIÓN Y MEZCLA DEL MAZO (Se ejecuta una sola vez al arrancar)

// Cartas del juego 

let cartasMaestroServer = [
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
    ];

// Función Fisher-Yates para entreverar el mazo

function entreverarMazo(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Mezclamos el mazo oficial del servidor
cartasMaestroServer = entreverarMazo(cartasMaestroServer);
console.log('**************************************************');
console.log('* INICIO SERVIDOR NODE : BWS by Varo             *');
console.log('* Inicializando maso de cartas y entreverando ...*');
console.log('**************************************************');
console.log("* > Mazo 68 cartas creado y entreverado: Done    *");
console.log('**************************************************');


// ------------------- Servimos los archivos de la carpeta actual (html, css, js, imagenes) -----------------------//

app.use(express.static(__dirname));

//------------------------------------------------------------------------------------------------------------------//
//---------------------------------- 1. BASE DE DATOS DEL JUEGO (Memoria del Servidor) -----------------------------//
//------------------------------------------------------------------------------------------------------------------//


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
        { id: 1, nombre: "Sin Asignar", cash: 0, h: 0, n: 0, g: 0, m: 0, socketId:null },
        { id: 2, nombre: "Sin Asignar", cash: 0, h: 0, n: 0, g: 0, m: 0, socketId:null },
        { id: 3, nombre: "Sin Asignar", cash: 0, h: 0, n: 0, g: 0, m: 0, socketId:null },
        { id: 4, nombre: "Sin Asignar", cash: 0, h: 0, n: 0, g: 0, m: 0, socketId:null }
    ],
    // Mazo de Cartas (68 cartas ya entreverado)
    masoCartas: cartasMaestroServer

};


// ---------------------------------- Lista de conexiones técnicas (Socket ID -> Datos básicos)----------------------//

let usuariosConectados = {};
// NUEVA variable para saber si el Host ya arrancó el juego
let partidaIniciada = false;

io.on('connection', (socket) => {
    
 
    // LOG DE CONEXIÓN

    // Registramos al usuario en la lista técnica
    
    console.log('==> Nuevo usuario conectado. ID Socket: ' + socket.id);

    usuariosConectados[socket.id] = {
        socketId: socket.id,
        fechaConexion: new Date()
    };
    
    let cantidadConectados = Object.keys(usuariosConectados).length;

    // --- NUEVA LÓGICA DE ASIGNACIÓN DE ROLES Y RECONEXIÓN ---
    
    if (partidaIniciada) {
        // CASO A: La partida ya está en curso (Reconexión o entrada tardía)
        console.log('Usuario entra con partida en curso. Enviando selector de personajes.');
        
        // 1. Le enviamos el estado actual para que su tablero tenga los datos técnicos
        socket.emit('actualizarCliente', estadoJuego);
        
        // 2. Le abrimos el modal de selección para que elija su nombre (asiento con socketId: null)
        socket.emit('abrirSeleccionPersonaje', estadoJuego.jugadores);

    } else {
        // CASO B: La partida aún no ha comenzado (Fase de Lobby)
        
        if (cantidadConectados === 1) {
            console.log('Primer usuario. Se le asigna rol: HOST');
            socket.emit('rolInicial', { rol: 'host', partidaIniciada: false });
            
        } else {
            console.log('Usuario adicional. Se le asigna rol: ESPERA');
            socket.emit('rolInicial', { rol: 'espera', partidaIniciada: false });
        }
    }   

    // Cuando el creador de partida ( host )  pulsa el botón en su pantalla, el servidor recibe esto:
    
    socket.on('comenzarPartidaOficial', () => {
        console.log('¡El Host ha dado la orden! Iniciando partida para todos...');
        
        // Bloqueamos futuras conexiones como "Host"
        partidaIniciada = true;

        // Le gritamos a TODOS los navegadores que quiten sus modales
        io.emit('liberarTablero');
    });

    // RECEPCIÓN DE NOMBRES Y APERTURA DE SELECCIÓN para id vs jugdor ---
    socket.on('configurarNombresPartida', (nombresRecibidos) => {
        console.log("Nombres recibidos del Host:", nombresRecibidos);

        // 1. Reseteamos la tabla de jugadores del servidor asegurando la estructura original
        for (let i = 0; i < 4; i++) {
            estadoJuego.jugadores[i].nombre = "Sin Asignar";
            estadoJuego.jugadores[i].socketId = null; // <- Agregamos el control de asiento vacío
            estadoJuego.jugadores[i].cash = 0;
            estadoJuego.jugadores[i].h = 0;
            estadoJuego.jugadores[i].n = 0;
            estadoJuego.jugadores[i].g = 0;
            estadoJuego.jugadores[i].m = 0;
        }

        // 2. Asignamos los nombres que propuso el Host (pueden ser 2, 3 o 4)
        nombresRecibidos.forEach((nombre, index) => {
            if (index < 4) {
                estadoJuego.jugadores[index].nombre = nombre;
            }
        });

        // 3. Marcamos que la partida ya tiene configuración
        partidaIniciada = true;

        // 4. Avisamos a TODOS enviando la tabla de OBJETOS para armar el modal
        io.emit('abrirSeleccionPersonaje', estadoJuego.jugadores);
    });

    // --- EL USUARIO ELIGIÓ SU NOMBRE Y si todos lo hicieron comienza  ---

    socket.on('usuarioEligioNombre', (indice) => {
        // 1. Asignamos el ID de este socket al jugador elegido
        if (estadoJuego.jugadores[indice]) {
            estadoJuego.jugadores[indice].socketId = socket.id;
            console.log(`Asiento ${indice} ocupado por: ${estadoJuego.jugadores[indice].nombre} (ID: ${socket.id})`);
        }

        // 2. Avisamos a TODOS para que se actualicen los botones (se ponga en "OCUPADO")
        io.emit('abrirSeleccionPersonaje', estadoJuego.jugadores);

        // 3. VERIFICACIÓN DE ESCLUSA: ¿Están todos los jugadores asignados?
        // Contamos cuántos jugadores configuró el Host (los que no son "Sin Asignar")
        const jugadoresActivos = estadoJuego.jugadores.filter(j => j.nombre !== "Sin Asignar");
        
        // Verificamos si todos esos jugadores activos ya tienen un socketId
        const todosListos = jugadoresActivos.every(j => j.socketId !== null);

        if (todosListos && jugadoresActivos.length > 0) {
            console.log("¡Todos los jugadores han seleccionado su nombre! Iniciando partida...");
            
            // Liberamos la partida para todos enviando el estado inicial completo
            io.emit('partidaListaParaEmpezar', estadoJuego);
        }
    });        

    // B. ENVIAR ESTADO INICIAL
    // Apenas entra, le damos la "foto" actual del juego para que no empiece en cero
    socket.emit('actualizarCliente', estadoJuego);


    // C. RECIBIR JUGADA DESDE UN CLIENTE
    socket.on('enviarJugadaAlServidor', (datosRecibidos) => {
        console.log('--- Recibiendo actualización de datos del juego ---');

        // 1. Actualizamos SOLO los datos dinámicos, protegiendo el mazo original 
        estadoJuego.precios = datosRecibidos.precios;
        estadoJuego.entorno = datosRecibidos.entorno;

        // estadoJuego.jugadores = datosRecibidos.jugadores;

        // En lugar de hacer estadoJuego.jugadores = datosRecibidos.jugadores,
        // actualizamos uno por uno los valores económicos.
        datosRecibidos.jugadores.forEach((jugCliente, index) => {
            if (estadoJuego.jugadores[index]) {
                estadoJuego.jugadores[index].nombre = jugCliente.nombre;
                estadoJuego.jugadores[index].cash = jugCliente.cash;
                estadoJuego.jugadores[index].h = jugCliente.h;
                estadoJuego.jugadores[index].n = jugCliente.n;
                estadoJuego.jugadores[index].g = jugCliente.g;
                estadoJuego.jugadores[index].m = jugCliente.m;

                // NOTA: No tocamos estadoJuego.jugadores[index].socketId
                // Así el servidor nunca olvida quién está conectado en ese asiento.
            }
        });

        // 2. Reenviamos la nueva información a TODOS los conectados (incluido el que la mandó)
        io.emit('actualizarCliente', estadoJuego);
    });

    // --- ACCIÓN Alguien tiró una carta del maso  ---

    socket.on('seJugoCartaDelMaso',(indiceParametro) => {
        console.log('El jugador avisó que jugó la carta: ' + indiceParametro);
        // El servidor le grita a TODOS los demás que ejecuten la función de mostrar carta
        socket.broadcast.emit('ejecutarMostrarCartaMaso', indiceParametro);
    });    

    // D. DESCONEXIÓN
    socket.on('disconnect', () => {
        console.log('<== Usuario desconectado: ' + socket.id);
        
        // Solo buscamos quién era y liberamos su socketId en el servidor
        estadoJuego.jugadores.forEach(j => {
            if (j.socketId === socket.id) {
                console.log(`Asiento de ${j.nombre} liberado (esperando reconexión).`);
                j.socketId = null; 
            }
        });

        delete usuariosConectados[socket.id];
    });
});

// INICIO DEL SERVIDOR
server.listen(3000, () => {
    console.log('**************************************************');
    console.log('* SERVIDOR BWS LISTO EN PUERTO 3000              *');
    console.log('* Esperando jugadores...                         *');
    console.log('**************************************************');
});