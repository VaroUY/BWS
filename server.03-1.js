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
console.log(`* > Timestamp : ${new Date().toISOString()}`);
console.log(`* > PID       : ${process.pid}`);
console.log(`* > Node.js   : ${process.version}`);
console.log('**************************************************');

// ============================================================
// MANEJADORES GLOBALES — detectan crashes, señales y sleep
// ============================================================

// Error no capturado — evita que el proceso muera y deja miga
process.on('uncaughtException', (err) => {
    console.error(`🔴 [FATAL] ${new Date().toISOString()} | ERROR NO CAPTURADO: ${err.message}`);
    console.error(`🔴 [FATAL] Stack: ${err.stack}`);
    console.error(`🔴 [FATAL] Estado: juegoEnCurso=${juegoEnCurso} partidaIniciada=${partidaIniciada} conectados=${Object.keys(usuariosConectados).length} indice=${estadoJuego.entorno.IndiceJuego}`);
});

process.on('unhandledRejection', (reason) => {
    console.error(`🟠 [ERROR] ${new Date().toISOString()} | PROMESA RECHAZADA: ${reason}`);
});

// SIGTERM = Render durmiendo el proceso, reinicio de infraestructura, o nuevo deploy
process.on('SIGTERM', () => {
    const jugadores = estadoJuego.jugadores.filter(j => j.socketId !== null).map(j => j.nombre).join(', ') || 'ninguno';
    console.warn(`⚠️  [SIGTERM] ${new Date().toISOString()} | Render está terminando el proceso`);
    console.warn(`⚠️  [SIGTERM] juegoEnCurso=${juegoEnCurso} | conectados=${Object.keys(usuariosConectados).length} | indice=${estadoJuego.entorno.IndiceJuego} | jugadores=[${jugadores}]`);
    setTimeout(() => process.exit(0), 500);
});

// Monitor de salud cada 5 minutos
setInterval(() => {
    const mem = process.memoryUsage();
    const jugadores = estadoJuego.jugadores.filter(j => j.socketId !== null).map(j => j.nombre).join(',') || 'ninguno';
    console.log(`📊 [MONITOR] ${new Date().toISOString()} | RAM:${Math.round(mem.rss/1024/1024)}MB | conectados:${Object.keys(usuariosConectados).length} | enCurso:${juegoEnCurso} | indice:${estadoJuego.entorno.IndiceJuego} | jugadores:[${jugadores}]`);
}, 300000);


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

    // Última dirección de cambio por empresa (1=subió, -1=bajó, 0=sin cambio)
    ultimaDireccion: {
        heineken: 0,
        gatorade: 0,
        nike: 0,
        mcdonalds: 0
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

// ==================== FUNCIÓN PARA OBTENER COPIA SEGURA (SIN REFERENCIAS CIRCULARES) ====================
function obtenerEstadoParaCliente() {
    // Copia superficial de las partes que no contienen objetos circulares
    const estadoCopia = {
        precios: { ...estadoJuego.precios },
        entorno: { ...estadoJuego.entorno },
        jugadores: estadoJuego.jugadores.map(j => ({
            id: j.id,
            nombre: j.nombre,
            cash: j.cash,
            h: j.h,
            n: j.n,
            g: j.g,
            m: j.m,
            socketId: j.socketId,
            c1: j.c1,
            c2: j.c2,
            c3: j.c3,
            c4: j.c4
        })),
        masoCartas: estadoJuego.masoCartas,
        ultimaDireccion: { ...estadoJuego.ultimaDireccion },
        historial: estadoJuego.historial,
        logEmpresas: {
            heineken: [...estadoJuego.logEmpresas.heineken],
            gatorade: [...estadoJuego.logEmpresas.gatorade],
            nike: [...estadoJuego.logEmpresas.nike],
            mcdonalds: [...estadoJuego.logEmpresas.mcdonalds],
            labels: [...estadoJuego.logEmpresas.labels]
        },
        logJugadores: {
            j1: [...estadoJuego.logJugadores.j1],
            j2: [...estadoJuego.logJugadores.j2],
            j3: [...estadoJuego.logJugadores.j3],
            j4: [...estadoJuego.logJugadores.j4]
        },
        votacion: {
            activa: estadoJuego.votacion.activa,
            opciones: [...estadoJuego.votacion.opciones]
            // NO incluimos timeoutId
        }
    };
    // Si hay cartasTemporales en algún jugador, copiarlas (son arrays de cartas, serializables)
    estadoJuego.jugadores.forEach((j, idx) => {
        if (j.cartasTemporales) {
            estadoCopia.jugadores[idx].cartasTemporales = j.cartasTemporales.map(c => [...c]); // copia de cada carta
        }
    });
    return estadoCopia;
}
// =========================================================================================================

// ----------------------------------------------------------------------------------- //
// ---------------------------------- FUNCIONES DEL SERVIDOR ------------------------- //
// ----------------------------------------------------------------------------------- //


// Función para iniciar la fase de votación de cartas iniciales
function iniciarFaseVotacion() {
    // Evita ejecutar si la partida ya ha comenzado
    if (estadoJuego.entorno.IndiceJuego > 0 || estadoJuego.entorno.TurnoJugador > 0 || estadoJuego.entorno.cartaJugada === true) {
        console.log("Partida ya en curso, no se inicia votación.");
        return;
    }

    console.log("Iniciando fase de votación de cartas...");

    // 1. Activar estado de votación
    estadoJuego.votacion.activa = true;
    estadoJuego.votacion.opciones = [null, null, null, null];
    if (estadoJuego.votacion.timeoutId) clearTimeout(estadoJuego.votacion.timeoutId);

    // 2. Obtener los índices de los jugadores activos (con nombre != "Sin Asignar")
    const indicesActivos = [];
    estadoJuego.jugadores.forEach((j, idx) => {
        if (j.nombre !== "Sin Asignar") indicesActivos.push(idx);
    });

    // 2b. REORDENAMIENTO ALEATORIO — se hace ANTES de repartir cartas
    // Solo si el host NO marcó "Forzar el orden actual"
    if (!estadoJuego.forzarOrden) {
        console.log("Reordenando jugadores aleatoriamente antes de repartir cartas...");
        const jugadoresActivos = indicesActivos.map(idx => estadoJuego.jugadores[idx]);
        for (let i = jugadoresActivos.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [jugadoresActivos[i], jugadoresActivos[j]] = [jugadoresActivos[j], jugadoresActivos[i]];
        }
        for (let i = 0; i < indicesActivos.length; i++) {
            estadoJuego.jugadores[indicesActivos[i]] = jugadoresActivos[i];
        }
        console.log("Nuevo orden:", indicesActivos.map(idx => estadoJuego.jugadores[idx].nombre));
    } else {
        console.log("Orden forzado por el host. No se reordena.");
    }

    // 3. Tomar las primeras 16 cartas del mazo (asignadas a cada jugador según su orden ya definitivo)
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
                tiempoLimite: 120
            });
        }
    }

    // 5. Configurar timeout de 2 minutos para forzar opción "Me quedo" a los que no votaron
    estadoJuego.votacion.timeoutId = setTimeout(() => {
        console.log("Tiempo de votación agotado. Asignando 'Me quedo' a los que no votaron.");
        for (let i = 0; i < indicesActivos.length; i++) {
            const jugadorIdx = indicesActivos[i];
            if (estadoJuego.votacion.opciones[jugadorIdx] === null) {
                estadoJuego.votacion.opciones[jugadorIdx] = 1;
            }
        }
        procesarVotos();
    }, 120000);
}

// Función para procesar los votos después de que todos hayan votado o por timeout
// Coloca esto después de la función iniciarFaseVotacion y antes de io.on('connection', ...)
//
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

        const estadoParaEnviar = obtenerEstadoParaCliente();
        estadoParaEnviar.manos = {};
        for (let i = 0; i < indicesActivos.length; i++) {
            const jugadorIdx = indicesActivos[i];
            estadoParaEnviar.manos[jugadorIdx] = estadoJuego.jugadores[jugadorIdx].cartasTemporales;
        }
        for (let i = 0; i < indicesActivos.length; i++) {
            delete estadoJuego.jugadores[indicesActivos[i]].cartasTemporales;
        }
        juegoEnCurso = true;
        console.log(`🎮 [PARTIDA] ${new Date().toISOString()} | Partida iniciada. Jugadores: ${indicesActivos.map(idx => estadoJuego.jugadores[idx].nombre).join(', ')}`);
        io.emit('partidaListaParaEmpezar', estadoParaEnviar);
    } else {
        console.log("Nadie eligió 'Me quedo'. Reordenando mazo y repartiendo nuevas manos.");
        estadoJuego.masoCartas = entreverarMazo(estadoJuego.masoCartas);
        const nuevasCartas = estadoJuego.masoCartas.slice(0, 16);
        for (let i = 0; i < indicesActivos.length; i++) {
            const jugadorIdx = indicesActivos[i];
            const offset = i * 4;
            const cartasJugador = nuevasCartas.slice(offset, offset + 4);
            estadoJuego.jugadores[jugadorIdx].cartasTemporales = cartasJugador;
        }
        iniciarFaseVotacion();
    }
}
// ----------------------------------------------------------------------------------- //
// ---------------------------------- EVENTOS  (Socket ID -> Datos básicos)----------------------//
// ----------------------------------------------------------------------------------- //

let usuariosConectados = {};
// NUEVA variable para saber si el Host ya arrancó el juego
let partidaIniciada = false;
let juegoEnCurso = false;

io.on('connection', (socket) => {
    
 
    // LOG DE CONEXIÓN

    // Registramos al usuario en la lista técnica
    
    console.log(`\n🟢 [CONEXION] ${new Date().toISOString()} | socket:${socket.id} | ip:${socket.handshake.address} | total:${Object.keys(usuariosConectados).length+1} | enCurso:${juegoEnCurso} | iniciada:${partidaIniciada}`);

    usuariosConectados[socket.id] = {
        socketId: socket.id,
        fechaConexion: new Date()
    };
    
    let cantidadConectados = Object.keys(usuariosConectados).length;

    // --- NUEVA LÓGICA DE ASIGNACIÓN DE ROLES Y RECONEXIÓN ---
    
    if (partidaIniciada) {
        // CASO A: La partida ya está en curso (Reconexión o entrada tardía)
        console.log('Usuario entra con partida en curso. Enviando selector de personajes.');
        
        // 1. Le enviamos el estado actual para que su tablero tenga los datos técnicos (copia segura)
        socket.emit('actualizarCliente', obtenerEstadoParaCliente());
        
        // 2. Le abrimos el modal de selección para que elija su nombre (asiento con socketId: null)
        const jugadoresCopia = JSON.parse(JSON.stringify(estadoJuego.jugadores));
        socket.emit('abrirSeleccionPersonaje', jugadoresCopia);

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
socket.on('configurarNombresPartida', (datosRecibidos) => {
    // Compatibilidad: acepta tanto array plano como objeto {nombres, forzarOrden}
    let nombresRecibidos, forzarOrden;
    if (Array.isArray(datosRecibidos)) {
        nombresRecibidos = datosRecibidos;
        forzarOrden = false;
    } else {
        nombresRecibidos = datosRecibidos.nombres;
        forzarOrden = datosRecibidos.forzarOrden || false;
    }
    console.log("Nombres recibidos del Host:", nombresRecibidos, "| Forzar orden:", forzarOrden);
    // Guardar el flag para usarlo en procesarVotos
    estadoJuego.forzarOrden = forzarOrden;
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
    // 4. Avisamos a TODOS enviando la tabla de OBJETOS para armar el modal (copia profunda)
    const jugadoresCopia = JSON.parse(JSON.stringify(estadoJuego.jugadores));
    io.emit('abrirSeleccionPersonaje', jugadoresCopia);
});

    // --- EL USUARIO ELIGIÓ SU NOMBRE Y si todos lo hicieron comienza  ---
socket.on('usuarioEligioNombre', (indice) => {
    // Liberar asiento anterior del mismo socket
    estadoJuego.jugadores.forEach((j, i) => {
        if (j.socketId === socket.id && i !== indice) {
            console.log(`Liberando asiento anterior ${i} del socket ${socket.id}`);
            j.socketId = null;
        }
    });

    if (estadoJuego.jugadores[indice]) {
        estadoJuego.jugadores[indice].socketId = socket.id;
        console.log(`Asiento ${indice} ocupado por: ${estadoJuego.jugadores[indice].nombre} (ID: ${socket.id})`);
    }

    const jugadoresActivos = estadoJuego.jugadores.filter(j => j.nombre !== "Sin Asignar");
    const todosListos = jugadoresActivos.every(j => j.socketId !== null);

    // ========== NUEVA LÓGICA PARA VOTACIÓN ==========
    // Si la votación está activa y el jugador que se conecta es parte de la partida
    if (estadoJuego.votacion.activa && estadoJuego.jugadores[indice].nombre !== "Sin Asignar") {
        // Reiniciar su voto (si había votado antes de desconectarse)
        estadoJuego.votacion.opciones[indice] = null;
        // Obtener sus cartas temporales (guardadas en cartasTemporales durante iniciarFaseVotacion)
        const cartas = estadoJuego.jugadores[indice].cartasTemporales;
        if (cartas && cartas.length === 4) {
            console.log(`Reenviando modal de votación al jugador ${indice} (reconexión en votación)`);
            socket.emit('solicitarOpcionCartas', {
                cartas: cartas,
                tiempoLimite: 120
            });
        } else {
            console.log(`No se encontraron cartas temporales para jugador ${indice} durante votación.`);
            // Si por algún motivo no tiene cartas, no hacemos nada (quizás ya terminó la votación)
        }
        // No hacemos nada más (no emitimos abrirSeleccionPersonaje, ni avanzamos votación)
        return;
    }
    // ==============================================

    if (juegoEnCurso) {
        console.log("Reconexión a partida en curso. Enviando estado actual al jugador...");
        const estadoCopia = obtenerEstadoParaCliente();
        socket.emit('reconectarJugador', {
            estadoJuego: estadoCopia,
            miIndice: indice
        });
    } else {
        if (todosListos && jugadoresActivos.length > 0) {
            console.log("Todos listos. Iniciando fase de votación...");
            iniciarFaseVotacion();
        } else {
            // Copia profunda del array de jugadores para evitar referencias circulares
            const jugadoresCopia = JSON.parse(JSON.stringify(estadoJuego.jugadores));
            io.emit('abrirSeleccionPersonaje', jugadoresCopia);
        }
    }
});


// Función para procesar los votos después de que todos hayan votado o por timeout

// --------------------------------------


    // B. ENVIAR ESTADO INICIAL
    // Apenas entra, le damos la "foto" actual del juego para que no empiece en cero (copia segura)
    socket.emit('actualizarCliente', obtenerEstadoParaCliente());

// ----------------------------------------
// C. RECIBIR JUGADA DESDE UN CLIENTE

socket.on('enviarJugadaAlServidor', (datosRecibidos) => {
    console.log('--- Recibiendo actualización de datos del juego ---');

    // Guardar precios anteriores para calcular cambios
    const preciosAnteriores = {
        heineken: estadoJuego.precios.heineken,
        gatorade: estadoJuego.precios.gatorade,
        nike: estadoJuego.precios.nike,
        mcdonalds: estadoJuego.precios.mcdonalds
    };

    // Actualizar precios con los nuevos
    estadoJuego.precios = datosRecibidos.precios;
    estadoJuego.entorno.IndiceJuego = datosRecibidos.entorno.IndiceJuego;
    estadoJuego.entorno.TurnoJugador = datosRecibidos.entorno.TurnoJugador;
    estadoJuego.entorno.cartaJugada = datosRecibidos.entorno.cartaJugada;

    // Calcular nueva dirección
    const nuevaDireccion = {
        heineken: Math.sign(estadoJuego.precios.heineken - preciosAnteriores.heineken),
        gatorade: Math.sign(estadoJuego.precios.gatorade - preciosAnteriores.gatorade),
        nike:     Math.sign(estadoJuego.precios.nike - preciosAnteriores.nike),
        mcdonalds: Math.sign(estadoJuego.precios.mcdonalds - preciosAnteriores.mcdonalds)
    };

    // Solo actualizar ultimaDireccion si hubo algún cambio real
    let huboCambio = false;
    for (let empresa in nuevaDireccion) {
        if (nuevaDireccion[empresa] !== 0) {
            huboCambio = true;
            break;
        }
    }
    if (huboCambio) {
        estadoJuego.ultimaDireccion = nuevaDireccion;
    }
    // Si no hubo cambio, se mantiene la dirección anterior (no se modifica)

    console.log('ultimaDireccion después de la actualización:', estadoJuego.ultimaDireccion); 

    // Actualizar jugadores
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

    // Actualizar logs
    if (datosRecibidos.logEmpresas) {
        estadoJuego.logEmpresas = datosRecibidos.logEmpresas;
    }
    if (datosRecibidos.logJugadores) {
        estadoJuego.logJugadores = datosRecibidos.logJugadores;
    }

    // Enviar a todos los clientes (incluye ultimaDireccion) - copia segura
    io.emit('actualizarCliente', obtenerEstadoParaCliente());
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
    io.emit('actualizarCliente', obtenerEstadoParaCliente());
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
    io.emit('actualizarCliente', obtenerEstadoParaCliente());
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

// --- GAME OVER (broadcast a todos)
socket.on('gameOver', (data) => {
    console.log(`🏁 [GAME_OVER] ${new Date().toISOString()} | tipo:${data.type} | datos:${JSON.stringify(data)}`);
    io.emit('gameOver', data);
});

// --- REINICIO DEL JUEGO (NEXT GAME)
socket.on('resetGame', () => {
    console.log(`🔄 [RESET_GAME] ${new Date().toISOString()} | Reinicio solicitado por cliente socket:${socket.id}`);
    
    // Resetear todo el estado del juego a valores iniciales
    estadoJuego = {
        precios: { heineken: 1000, nike: 1000, gatorade: 1000, mcdonalds: 1000 },
        entorno: {
            IndiceJuego: 0,
            TurnoJugador: 0,
            cartaJugada: false,
            cartaActual: null
        },
        jugadores: [
            { id: 1, nombre: "Sin Asignar", cash: 0, h: 1, n: 1, g: 1, m: 1, socketId: null, c1: true, c2: true, c3: true, c4: true },
            { id: 2, nombre: "Sin Asignar", cash: 0, h: 1, n: 1, g: 1, m: 1, socketId: null, c1: true, c2: true, c3: true, c4: true },
            { id: 3, nombre: "Sin Asignar", cash: 0, h: 1, n: 1, g: 1, m: 1, socketId: null, c1: true, c2: true, c3: true, c4: true },
            { id: 4, nombre: "Sin Asignar", cash: 0, h: 1, n: 1, g: 1, m: 1, socketId: null, c1: true, c2: true, c3: true, c4: true }
        ],
        // ** Se mezcla el mazo actual para obtener un orden diferente en cada reinicio **
        masoCartas: entreverarMazo([...cartasMaestroServer]),
        votacion: {
            activa: false,
            opciones: [null, null, null, null],
            timeoutId: null
        },
        // ** Añadido: dirección de cambio reiniciada a 0 para todas las empresas **
        ultimaDireccion: {
            heineken: 0,
            gatorade: 0,
            nike: 0,
            mcdonalds: 0
        },
        historial: [],
        logEmpresas: {
            heineken: [1000],
            gatorade: [1000],
            nike: [1000],
            mcdonalds: [1000],
            labels: ["0"]
        },
        logJugadores: {
            j1: [4000],
            j2: [4000],
            j3: [4000],
            j4: [4000]
        },
        forzarOrden: false
    };

    // Resetear variable de partida iniciada
    partidaIniciada = false;
    juegoEnCurso = false;

    // Emitir a todos los clientes que reinicien la interfaz
    io.emit('resetCliente');
});
//-------------------------  D. DESCONEXIÓN

socket.on('disconnect', (reason) => {
    const jugadorNombre = estadoJuego.jugadores.find(j => j.socketId === socket.id)?.nombre || 'no-jugador';
    console.log(`\n🔴 [DESCONEXION] ${new Date().toISOString()} | socket:${socket.id} | jugador:${jugadorNombre} | razon:${reason} | enCurso:${juegoEnCurso} | indice:${estadoJuego.entorno.IndiceJuego}`);
    // Alerta especial para razones que indican problema de red o reinicio
    if (reason === 'transport close' || reason === 'ping timeout' || reason === 'transport error') {
        console.warn(`⚠️  [DESCONEXION] Razón sospechosa: "${reason}" — posible caída de red o reinicio del servidor`);
    }

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

    // ---- PUNTO 3: Si no queda nadie conectado, reset completo del servidor ----
    const quedanConectados = Object.keys(usuariosConectados).length;
    if (quedanConectados === 0) {
        console.log(`🔄 [RESET] ${new Date().toISOString()} | Sin jugadores — reset completo del servidor`);
        estadoJuego = {
            precios: { heineken: 1000, nike: 1000, gatorade: 1000, mcdonalds: 1000 },
            entorno: { IndiceJuego: 0, TurnoJugador: 0, cartaJugada: false, cartaActual: null },
            jugadores: [
                { id: 1, nombre: "Sin Asignar", cash: 0, h: 1, n: 1, g: 1, m: 1, socketId: null, c1: true, c2: true, c3: true, c4: true },
                { id: 2, nombre: "Sin Asignar", cash: 0, h: 1, n: 1, g: 1, m: 1, socketId: null, c1: true, c2: true, c3: true, c4: true },
                { id: 3, nombre: "Sin Asignar", cash: 0, h: 1, n: 1, g: 1, m: 1, socketId: null, c1: true, c2: true, c3: true, c4: true },
                { id: 4, nombre: "Sin Asignar", cash: 0, h: 1, n: 1, g: 1, m: 1, socketId: null, c1: true, c2: true, c3: true, c4: true }
            ],
            masoCartas: entreverarMazo([...cartasMaestroServer]),
            votacion: { activa: false, opciones: [null, null, null, null], timeoutId: null },
            ultimaDireccion: { heineken: 0, gatorade: 0, nike: 0, mcdonalds: 0 },
            historial: [],
            logEmpresas: { heineken: [1000], gatorade: [1000], nike: [1000], mcdonalds: [1000], labels: ["0"] },
            logJugadores: { j1: [4000], j2: [4000], j3: [4000], j4: [4000] },
            forzarOrden: false
        };
        partidaIniciada = false;
        juegoEnCurso = false;
        console.log('Servidor reseteado. Listo para nueva partida.');
        return; // No hay nadie a quien notificar
    }

    // ---- PUNTO 2: Si la partida no llegó a estar en curso y quedó en limbo, liberar el rol host ----
    if (!juegoEnCurso && partidaIniciada) {
        // Verificar si todos los socketIds de jugadores activos son null
        const hayAlguienAsignado = estadoJuego.jugadores.some(j => j.nombre !== "Sin Asignar" && j.socketId !== null);
        if (!hayAlguienAsignado) {
            console.log('Partida iniciada pero sin jugadores conectados. Reseteando partidaIniciada.');
            partidaIniciada = false;
        }
    }

    // Si estaba en fase de votación y ya había votado, limpiamos su voto
    if (indiceDesconectado !== -1 && estadoJuego.votacion.activa) {
        if (estadoJuego.votacion.opciones[indiceDesconectado] !== null) {
            console.log(`Limpiando voto del jugador ${indiceDesconectado} (desconectado durante votación).`);
            estadoJuego.votacion.opciones[indiceDesconectado] = null;
        }
    }

    // Si era su turno Y ya había jugado carta → forzamos finalizar turno
    if (
        indiceDesconectado !== -1 &&
        indiceDesconectado === estadoJuego.entorno.TurnoJugador &&
        estadoJuego.entorno.cartaJugada === true
    ) {
        console.log(`Jugador ${estadoJuego.jugadores[indiceDesconectado].nombre} se desconectó tras jugar carta. Forzando fin de turno...`);

        estadoJuego.entorno.cartaJugada = false;

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
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log('**************************************************');
    console.log(' SERVIDOR BWS LISTO EN PUERTO ' + port + '              ');
    console.log(' Esperando jugadores...                         ');
    console.log('**************************************************');
});