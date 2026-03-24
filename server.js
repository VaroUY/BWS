

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
        TurnoJugador: 0,
        cartaJugada: false,
        cartaActual: null
    },
    // Tabla de Jugadores (4 puestos fijos)
    jugadores: [
        { id: 1, nombre: "Sin Asignar", cash: 0, h: 1, n: 1, g: 1, m: 1, socketId: null, c1: true, c2: true, c3: true, c4: true },
        { id: 2, nombre: "Sin Asignar", cash: 0, h: 1, n: 1, g: 1, m: 1, socketId: null, c1: true, c2: true, c3: true, c4: true },
        { id: 3, nombre: "Sin Asignar", cash: 0, h: 1, n: 1, g: 1, m: 1, socketId: null, c1: true, c2: true, c3: true, c4: true },
        { id: 4, nombre: "Sin Asignar", cash: 0, h: 1, n: 1, g: 1, m: 1, socketId: null, c1: true, c2: true, c3: true, c4: true }
    ],
    // Mazo de Cartas (68 cartas ya entreverado)
    masoCartas: cartasMaestroServer,

    // Estado de votación para cartas iniciales
    votacion: {
        activa: false,
        opciones: [null, null, null, null], // null = no votó, 1=me quedo, 2=todo pasa, 3=cambiar
        timeoutId: null
    },

    historial: [],

    logEmpresas: {
        heineken:  [1000],
        gatorade:  [1000],
        nike:      [1000],
        mcdonalds: [1000],
        labels:    ["0"]
    },

    logJugadores: {
        j1: [4000],
        j2: [4000],
        j3: [4000],
        j4: [4000]
    }
};

// ----------------------------------------------------------------------------------- //
// ---------------------------------- FUNCIONES DEL SERVIDOR ------------------------- //
// ----------------------------------------------------------------------------------- //


// Función para iniciar la fase de votación de cartas iniciales
function iniciarFaseVotacion() {
    console.log("Iniciando fase de votación de cartas...");

    // 1. Activar estado de votación
    estadoJuego.votacion.activa = true;
    estadoJuego.votacion.opciones = [null, null, null, null];
    if (estadoJuego.votacion.timeoutId) clearTimeout(estadoJuego.votacion.timeoutId);

    // 2. Obtener los índices de los jugadores activos (con nombre != "Sin Asignar")
    const jugadoresActivos = estadoJuego.jugadores.filter(j => j.nombre !== "Sin Asignar");
    const indicesActivos = [];
    estadoJuego.jugadores.forEach((j, idx) => {
        if (j.nombre !== "Sin Asignar") indicesActivos.push(idx);
    });

    // 3. Tomar las primeras 16 cartas del mazo (asignadas a cada jugador según su orden)
    const cartasIniciales = estadoJuego.masoCartas.slice(0, 16);
    for (let i = 0; i < indicesActivos.length; i++) {
        const jugadorIdx = indicesActivos[i];
        const offset = i * 4;
        const cartasDelJugador = cartasIniciales.slice(offset, offset + 4);
        estadoJuego.jugadores[jugadorIdx].cartasTemporales = cartasDelJugador;
    }

    // 4. Enviar a cada jugador su mano privada mediante evento personalizado
    for (let i = 0; i < indicesActivos.length; i++) {
        const jugadorIdx = indicesActivos[i];
        const socketId = estadoJuego.jugadores[jugadorIdx].socketId;
        if (socketId) {
            const cartas = estadoJuego.jugadores[jugadorIdx].cartasTemporales;
            io.to(socketId).emit('solicitarOpcionCartas', {
                cartas: cartas,
                tiempoLimite: 120 // segundos
            });
        }
    }

    // 5. Configurar timeout de 2 minutos para forzar opción "Me quedo" a los que no votaron
    estadoJuego.votacion.timeoutId = setTimeout(() => {
        console.log("Tiempo de votación agotado. Asignando 'Me quedo' a los que no votaron.");
        // Forzar voto para los que aún no eligieron
        for (let i = 0; i < indicesActivos.length; i++) {
            const jugadorIdx = indicesActivos[i];
            if (estadoJuego.votacion.opciones[jugadorIdx] === null) {
                // Asignar opción 1 = "Me quedo"
                estadoJuego.votacion.opciones[jugadorIdx] = 1;
            }
        }
        // Procesar los votos
        procesarVotos();
    }, 120000);
}

// Función para procesar los votos después de que todos hayan votado o por timeout
function procesarVotos() {
    if (estadoJuego.votacion.timeoutId) clearTimeout(estadoJuego.votacion.timeoutId);
    estadoJuego.votacion.activa = false;

    // Obtener los índices de jugadores activos
    const jugadoresActivos = estadoJuego.jugadores.filter(j => j.nombre !== "Sin Asignar");
    const indicesActivos = [];
    estadoJuego.jugadores.forEach((j, idx) => {
        if (j.nombre !== "Sin Asignar") indicesActivos.push(idx);
    });

    // Verificar si algún jugador eligió "Me quedo" (opción 1)
    const algunMeQuedo = indicesActivos.some(idx => estadoJuego.votacion.opciones[idx] === 1);

    if (algunMeQuedo) {
        console.log("Algún jugador eligió 'Me quedo'. Iniciando partida con manos actuales.");
        // Iniciar la partida normal con las manos ya repartidas
        io.emit('partidaListaParaEmpezar', estadoJuego);
    } else {
        console.log("Nadie eligió 'Me quedo'. Reordenando el mazo y repartiendo nuevas cartas.");
        // Mezclar el mazo actual nuevamente (reordenar)
        estadoJuego.masoCartas = entreverarMazo(estadoJuego.masoCartas);
        // Repartir las primeras 16 cartas como nuevas manos
        const nuevasCartas = estadoJuego.masoCartas.slice(0, 16);
        for (let i = 0; i < indicesActivos.length; i++) {
            const jugadorIdx = indicesActivos[i];
            const offset = i * 4;
            const cartasJugador = nuevasCartas.slice(offset, offset + 4);
            estadoJuego.jugadores[jugadorIdx].cartasTemporales = cartasJugador;
        }
        // Ahora iniciar la partida con las nuevas manos
        io.emit('partidaListaParaEmpezar', estadoJuego);
    }

    // Limpiar datos temporales de cartas en los jugadores (opcional)
    for (let i = 0; i < indicesActivos.length; i++) {
        delete estadoJuego.jugadores[indicesActivos[i]].cartasTemporales;
    }
}
// ----------------------------------------------------------------------------------- //
// ---------------------------------- EVENTOS  (Socket ID -> Datos básicos)----------------------//
// ----------------------------------------------------------------------------------- //

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
        estadoJuego.jugadores[i].socketId = null;
        estadoJuego.jugadores[i].cash = 0;
        estadoJuego.jugadores[i].h = 1;
        estadoJuego.jugadores[i].n = 1;
        estadoJuego.jugadores[i].g = 1;
        estadoJuego.jugadores[i].m = 1;
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

    // Liberamos cualquier asiento anterior que tenga este mismo socket
    estadoJuego.jugadores.forEach((j, i) => {
        if (j.socketId === socket.id && i !== indice) {
            console.log(`Liberando asiento anterior ${i} del socket ${socket.id}`);
            j.socketId = null;
        }
    });

    // Asignamos el nuevo asiento
    if (estadoJuego.jugadores[indice]) {
        estadoJuego.jugadores[indice].socketId = socket.id;
        console.log(`Asiento ${indice} ocupado por: ${estadoJuego.jugadores[indice].nombre} (ID: ${socket.id})`);
    }

    const jugadoresActivos = estadoJuego.jugadores.filter(j => j.nombre !== "Sin Asignar");
    const todosListos = jugadoresActivos.every(j => j.socketId !== null);

    if (todosListos && jugadoresActivos.length > 0) {
        if (estadoJuego.entorno.IndiceJuego > 0 || estadoJuego.entorno.TurnoJugador > 0 || estadoJuego.entorno.cartaJugada === true) {
            // Es una reconexión — mandamos estado actual solo a este jugador
            console.log("Reconexión detectada. Enviando estado actual al jugador...");
            socket.emit('reconectarJugador', {
                estadoJuego: estadoJuego,
                miIndice: indice
            });
        } else {
            // Todos listos — iniciamos la fase de votación de cartas
            console.log("Todos listos. Iniciando fase de votación...");
            iniciarFaseVotacion();
        }
    } else {
        // No están todos listos — actualizamos el modal de selección a todos
        io.emit('abrirSeleccionPersonaje', estadoJuego.jugadores);
    }
});

// Función para iniciar la fase de votación de cartas iniciales
function iniciarFaseVotacion() {
    console.log("Iniciando fase de votación de cartas...");

    // 1. Activar estado de votación
    estadoJuego.votacion.activa = true;
    estadoJuego.votacion.opciones = [null, null, null, null];
    if (estadoJuego.votacion.timeoutId) clearTimeout(estadoJuego.votacion.timeoutId);

    // 2. Obtener los índices de los jugadores activos (con nombre != "Sin Asignar")
    const jugadoresActivos = estadoJuego.jugadores.filter(j => j.nombre !== "Sin Asignar");
    const indicesActivos = [];
    estadoJuego.jugadores.forEach((j, idx) => {
        if (j.nombre !== "Sin Asignar") indicesActivos.push(idx);
    });

    // 3. Tomar las primeras 16 cartas del mazo (asignadas a cada jugador según su orden)
    //    Nota: en tu lógica original, las cartas de mano se asignan con índices fijos basados en el asiento.
    //    Por simplicidad, enviaremos a cada jugador sus 4 cartas según la posición en el mazo.
    //    La función `mostrarCartasJugador` en el cliente usa cartasMaestro y los índices calculados en base a miAsientoLocal.
    //    Para que el cliente muestre las cartas correctas, debemos enviarle las URLs de sus cartas.
    //    Guardamos las cartas en estadoJuego.jugadores para que luego se puedan mostrar.

    // Calcular las primeras 16 posiciones del mazo (índices 0 a 15)
    const cartasIniciales = estadoJuego.masoCartas.slice(0, 16);
    // Distribuir a los jugadores: cada jugador recibe 4 cartas consecutivas según orden de índice
    for (let i = 0; i < indicesActivos.length; i++) {
        const jugadorIdx = indicesActivos[i];
        const offset = i * 4;
        // Asignamos las cartas en el array _jugadores del cliente más adelante,
        // pero aquí solo necesitamos enviarlas.
        const cartasDelJugador = cartasIniciales.slice(offset, offset + 4);
        // Guardamos temporalmente en el objeto jugador (opcional)
        estadoJuego.jugadores[jugadorIdx].cartasTemporales = cartasDelJugador;
    }

    // 4. Enviar a cada jugador su mano privada mediante evento personalizado
    for (let i = 0; i < indicesActivos.length; i++) {
        const jugadorIdx = indicesActivos[i];
        const socketId = estadoJuego.jugadores[jugadorIdx].socketId;
        if (socketId) {
            const cartas = estadoJuego.jugadores[jugadorIdx].cartasTemporales;
            io.to(socketId).emit('solicitarOpcionCartas', {
                cartas: cartas,
                tiempoLimite: 120 // segundos
            });
        }
    }

    // 5. Configurar timeout de 2 minutos (120000 ms) para forzar opción "Todo pasa" a los que no votaron
    estadoJuego.votacion.timeoutId = setTimeout(() => {
        console.log("Tiempo de votación agotado. Asignando 'Todo pasa' a los que no votaron.");
        // Forzar voto para los que aún no eligieron
        for (let i = 0; i < indicesActivos.length; i++) {
            const jugadorIdx = indicesActivos[i];
            if (estadoJuego.votacion.opciones[jugadorIdx] === null) {
                // Asignar opción 2 = "Todo pasa"
                estadoJuego.votacion.opciones[jugadorIdx] = 2;
            }
        }
        // Procesar los votos
        procesarVotos();
    }, 120000);
}

// Función para procesar los votos después de que todos hayan votado o por timeout
function procesarVotos() {
    if (estadoJuego.votacion.timeoutId) clearTimeout(estadoJuego.votacion.timeoutId);
    estadoJuego.votacion.activa = false;

    const jugadoresActivos = estadoJuego.jugadores.filter(j => j.nombre !== "Sin Asignar");
    const indicesActivos = [];
    estadoJuego.jugadores.forEach((j, idx) => {
        if (j.nombre !== "Sin Asignar") indicesActivos.push(idx);
    });

    const algunMeQuedo = indicesActivos.some(idx => estadoJuego.votacion.opciones[idx] === 1);

    if (algunMeQuedo) {
        console.log("Algún jugador eligió 'Me quedo'. Iniciando partida con manos actuales.");
        // Preparar el objeto con las manos para enviar a los clientes
        const estadoParaEnviar = { ...estadoJuego };
        estadoParaEnviar.manos = {};
        for (let i = 0; i < indicesActivos.length; i++) {
            const jugadorIdx = indicesActivos[i];
            estadoParaEnviar.manos[jugadorIdx] = estadoJuego.jugadores[jugadorIdx].cartasTemporales;
        }
        // Limpiar datos temporales
        for (let i = 0; i < indicesActivos.length; i++) {
            delete estadoJuego.jugadores[indicesActivos[i]].cartasTemporales;
        }
        io.emit('partidaListaParaEmpezar', estadoParaEnviar);
    } else {
        console.log("Nadie eligió 'Me quedo'. Reordenando mazo y repartiendo nuevas manos.");
        // Mezclar el mazo actual nuevamente
        estadoJuego.masoCartas = entreverarMazo(estadoJuego.masoCartas);
        // Repartir nuevas 16 cartas
        const nuevasCartas = estadoJuego.masoCartas.slice(0, 16);
        for (let i = 0; i < indicesActivos.length; i++) {
            const jugadorIdx = indicesActivos[i];
            const offset = i * 4;
            const cartasJugador = nuevasCartas.slice(offset, offset + 4);
            estadoJuego.jugadores[jugadorIdx].cartasTemporales = cartasJugador;
        }
        // Reiniciar la votación
        iniciarFaseVotacion();
    }
}

// --------------------------------------


    // B. ENVIAR ESTADO INICIAL
    // Apenas entra, le damos la "foto" actual del juego para que no empiece en cero
    socket.emit('actualizarCliente', estadoJuego);

// ----------------------------------------
// C. RECIBIR JUGADA DESDE UN CLIENTE

socket.on('enviarJugadaAlServidor', (datosRecibidos) => {
    console.log('--- Recibiendo actualización de datos del juego ---');
    estadoJuego.precios = datosRecibidos.precios;
    estadoJuego.entorno.IndiceJuego = datosRecibidos.entorno.IndiceJuego;
    estadoJuego.entorno.TurnoJugador = datosRecibidos.entorno.TurnoJugador;
    estadoJuego.entorno.cartaJugada = datosRecibidos.entorno.cartaJugada;
    datosRecibidos.jugadores.forEach((jugCliente, index) => {
        if (estadoJuego.jugadores[index]) {
            estadoJuego.jugadores[index].nombre = jugCliente.nombre;
            if (jugCliente.cash !== undefined) estadoJuego.jugadores[index].cash = jugCliente.cash;
            if (jugCliente.h !== undefined) estadoJuego.jugadores[index].h = jugCliente.h;
            if (jugCliente.n !== undefined) estadoJuego.jugadores[index].n = jugCliente.n;
            if (jugCliente.g !== undefined) estadoJuego.jugadores[index].g = jugCliente.g;
            if (jugCliente.m !== undefined) estadoJuego.jugadores[index].m = jugCliente.m;
            if (jugCliente.c1 !== undefined) estadoJuego.jugadores[index].c1 = jugCliente.c1;
            if (jugCliente.c2 !== undefined) estadoJuego.jugadores[index].c2 = jugCliente.c2;
            if (jugCliente.c3 !== undefined) estadoJuego.jugadores[index].c3 = jugCliente.c3;
            if (jugCliente.c4 !== undefined) estadoJuego.jugadores[index].c4 = jugCliente.c4;
        }
    });
    // Actualizamos logs de graficas si vienen
    if (datosRecibidos.logEmpresas) {
        estadoJuego.logEmpresas = datosRecibidos.logEmpresas;
    }
    if (datosRecibidos.logJugadores) {
        estadoJuego.logJugadores = datosRecibidos.logJugadores;
    }
    io.emit('actualizarCliente', estadoJuego);
});

// --- ACCIÓN Alguien tiró una carta del maso  ---
socket.on('seJugoCartaDelMaso', (indiceParametro) => {
    console.log('El jugador avisó que jugó la carta: ' + indiceParametro);
    console.log('Carta en servidor índice ' + indiceParametro + ':', estadoJuego.masoCartas[indiceParametro]);
    // Marcamos en el servidor que ya se jugó carta en este turno
    estadoJuego.entorno.cartaJugada = true;
    // Guardamos el índice de la carta jugada para que todos la vean
    estadoJuego.entorno.cartaActual = indiceParametro;
    // Avisamos a todos con el estado actualizado incluyendo la carta
    io.emit('actualizarCliente', estadoJuego);
    // Avisamos a los demás que ejecuten la carta visualmente
    socket.broadcast.emit('ejecutarMostrarCartaMaso', indiceParametro);
    // Mostramos modal de espera a los demas jugadores con la carta jugada
    socket.broadcast.emit('mostrarCartaEspera', indiceParametro);
});

socket.on('actualizarCartasMano', (datos) => {
    console.log('Actualizando cartas de la mano del jugador índice:', datos.indiceJugador);
    if (estadoJuego.jugadores[datos.indiceJugador]) {
        estadoJuego.jugadores[datos.indiceJugador].c1 = datos.c1;
        estadoJuego.jugadores[datos.indiceJugador].c2 = datos.c2;
        estadoJuego.jugadores[datos.indiceJugador].c3 = datos.c3;
        estadoJuego.jugadores[datos.indiceJugador].c4 = datos.c4;
    }
    // Guardamos el índice de la carta jugada para que todos la vean
    if (datos.indiceCarta !== undefined) {
        estadoJuego.entorno.cartaActual = datos.indiceCarta;
        estadoJuego.entorno.cartaJugada = true;
    }
    // Avisamos a todos para que actualicen los indicadores
    io.emit('actualizarCliente', estadoJuego);
});
// ------------------------- cerrar modal que muestra carta jugada

socket.on('mostrarCartaEspera', (indiceParametro) => {
    socket.broadcast.emit('mostrarCartaEspera', indiceParametro);
});

socket.on('cerrarCartaEspera', () => {
    socket.broadcast.emit('cerrarCartaEspera');
});

// --- ACCIÓN: Un jugador finalizó su turno ---

socket.on('finalizarTurno', (datos) => {
    console.log("Turno finalizado recibido. Índice actual:", datos.indiceActual);
    // 1. Actualizamos el índice del mazo en el servidor y si ya jugo o no 
    estadoJuego.entorno.IndiceJuego = datos.indiceActual;
    estadoJuego.entorno.cartaJugada = false;
    estadoJuego.entorno.cartaActual = null;
    // 2. Calculamos el próximo turno (saltando los "Sin Asignar")
    let proximoTurno = estadoJuego.entorno.TurnoJugador;
    let encontrado = false;
    while (!encontrado) {
        proximoTurno++;
        if (proximoTurno > 3) proximoTurno = 0;
        if (estadoJuego.jugadores[proximoTurno].nombre !== "Sin Asignar") {
            encontrado = true;
        }
    }
    // 3. Guardamos el nuevo turno en la memoria del servidor
    estadoJuego.entorno.TurnoJugador = proximoTurno;
    // 4. Emitimos el cambio a todos los clientes 
    io.emit('actualizarTurno', {
        turno: proximoTurno + 1,
        jugadores: estadoJuego.jugadores
    });
    console.log("El nuevo turno es del jugador índice:", proximoTurno);
});

// --- RECIBIR VOTO DEL JUGADOR EN LA FASE DE VOTACIÓN
socket.on('enviarOpcionVoto', (data) => {
    const { indice, opcion } = data;
    console.log(`Voto recibido: jugador índice ${indice}, opción ${opcion}`);

    if (estadoJuego.votacion.activa && estadoJuego.votacion.opciones[indice] === null) {
        estadoJuego.votacion.opciones[indice] = opcion;
        console.log(`Voto registrado para jugador ${indice}. Opciones actuales:`, estadoJuego.votacion.opciones);

        // Verificar si todos los jugadores activos ya votaron
        const jugadoresActivos = estadoJuego.jugadores.filter(j => j.nombre !== "Sin Asignar");
        const indicesActivos = [];
        estadoJuego.jugadores.forEach((j, idx) => {
            if (j.nombre !== "Sin Asignar") indicesActivos.push(idx);
        });

        const todosVotaron = indicesActivos.every(idx => estadoJuego.votacion.opciones[idx] !== null);

        if (todosVotaron) {
            console.log("Todos los jugadores votaron. Procesando resultados...");
            procesarVotos();
        }
    } else {
        console.log(`Voto ignorado: votación no activa o ya había votado para índice ${indice}`);
    }
});

// forzado por SALTEAR bottom

socket.on('forzarFinalizarTurno', (datos) => {
    console.log("Salteo forzado por otro jugador. Índice actual:", datos.indiceActual);
    // 1. Avanzamos el índice del mazo y reseteamos carta jugada
    estadoJuego.entorno.IndiceJuego = estadoJuego.entorno.IndiceJuego + 1;
    estadoJuego.entorno.cartaJugada = false;
    // 2. Calculamos el próximo turno
    let proximoTurno = estadoJuego.entorno.TurnoJugador;
    let encontrado = false;
    while (!encontrado) {
        proximoTurno++;
        if (proximoTurno > 3) proximoTurno = 0;
        if (estadoJuego.jugadores[proximoTurno].nombre !== "Sin Asignar") {
            encontrado = true;
        }
    }
    // 3. Guardamos el nuevo turno
    estadoJuego.entorno.TurnoJugador = proximoTurno;
    // 4. Emitimos el cambio a todos
    io.emit('actualizarTurno', {
        turno: proximoTurno + 1,
        jugadores: estadoJuego.jugadores
    });
    console.log("Turno forzado al jugador índice:", proximoTurno);
});

//---------------------- historial log 

socket.on('registrarTransaccion', (transaccion) => {
    console.log('Transacción registrada:', transaccion);
    
    // Si cambió el jugador respecto a la última transacción, agregamos separador
    if (estadoJuego.historial.length > 0) {
        const ultimaTransaccion = estadoJuego.historial[estadoJuego.historial.length - 1];
        if (ultimaTransaccion.jugador !== transaccion.jugador && ultimaTransaccion.tipo !== 'separador') {
            estadoJuego.historial.push({ tipo: 'separador' });
        }
    }

    estadoJuego.historial.push(transaccion);
    io.emit('actualizarHistorial', estadoJuego.historial);
});

//-------------------------  D. DESCONEXIÓN

socket.on('disconnect', () => {
    console.log('<== Usuario desconectado: ' + socket.id);

    // Buscamos qué jugador era el que se desconectó
    let indiceDesconectado = -1;
    estadoJuego.jugadores.forEach((j, index) => {
        if (j.socketId === socket.id) {
            console.log(`Asiento de ${j.nombre} liberado (esperando reconexión).`);
            j.socketId = null;
            indiceDesconectado = index;
        }
    });

    delete usuariosConectados[socket.id];

    // Si era su turno Y ya había jugado carta → forzamos finalizar turno
    if (
        indiceDesconectado !== -1 &&
        indiceDesconectado === estadoJuego.entorno.TurnoJugador &&
        estadoJuego.entorno.cartaJugada === true
    ) {
        console.log(`Jugador ${estadoJuego.jugadores[indiceDesconectado].nombre} se desconectó tras jugar carta. Forzando fin de turno...`);

        // Reseteamos carta jugada
        estadoJuego.entorno.cartaJugada = false;

        // Calculamos próximo turno saltando Sin Asignar
        let proximoTurno = estadoJuego.entorno.TurnoJugador;
        let encontrado = false;
        while (!encontrado) {
            proximoTurno++;
            if (proximoTurno > 3) proximoTurno = 0;
            if (estadoJuego.jugadores[proximoTurno].nombre !== "Sin Asignar") {
                encontrado = true;
            }
        }

        estadoJuego.entorno.TurnoJugador = proximoTurno;
        estadoJuego.entorno.IndiceJuego = estadoJuego.entorno.IndiceJuego + 1;

        console.log("Turno forzado al jugador índice:", proximoTurno);

        io.emit('actualizarTurno', {
            turno: proximoTurno + 1,
            jugadores: estadoJuego.jugadores
        });
    }
});
});

// INICIO DEL SERVIDOR
//server.listen(3000, () => {
//    console.log('**************************************************');
//    console.log('* SERVIDOR BWS LISTO EN PUERTO 3000              *');
//    console.log('* Esperando jugadores...                         *');
//    console.log('**************************************************');
//});

// INICIO DEL SERVIDOR
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log('**************************************************');
    console.log(' SERVIDOR BWS LISTO EN PUERTO ' + port + '              ');
    console.log(' Esperando jugadores...                         ');
    console.log('**************************************************');
});