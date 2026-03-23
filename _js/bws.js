// JavaScript BWS 

// --------------------------------------------------------------------------------------------------------------------//
// ------- Inicio SOCKET SERVER 
// --------------------------------------------------------------------------------------------------------------------//

// Iniciamos la conexión con el servidor
const socket = io();

// --------------------------------------------------------------------------------------------------------------------//
// ------- VARIABLES GLOBALES 
// --------------------------------------------------------------------------------------------------------------------//

// Variables de la funcion que dibuja las graficas y deben estar declaras antes 

let estadoPrevioBarras = { Heineken: 0, Gatorade: 0, Nike: 0, McDonalds: 0 };
let animacionBarrasReq = null;
var miAsientoLocal = 0; // 0 significa que aún no tengo asiento o soy espectador
var timerTurno; // Para el control del tiempo local
var _partidaYaInicializada = false;
var _cartaJugadaServidor = false;
var _historialTransacciones = [];
var cartasMaestro = [];
var _lineChartInstance = null;
var _actualizarGrafica = false;

// ---------------------------------------------------------------------------------------------//

var _jugadores = [["Sin Asignar",true,true,true,true],["Sin Asignar",true,true,true,true],["Sin Asignar",true,true,true,true],["Sin Asignar",true,true,true,true]]

// _valorIndice es quien define el numero de jugada 

var _valorIndice = 0;   // Numero de jugada, indice de las cartas 
var _turnoJugador = 0;  // turno
var _jugarCartas = true; // para validar que si ya jugo carta no haga click en otra carta ( maso o mano )
var _jugoDeLaMano = false; // flag para saber si el jugador jugo de la mano ... ( defecto false )
var _valorIndiceGraficas = 0; // Numero de jugada para las graficas ( )
var _jugadorSeleccionado = 0; // para identificar de que monitor es 

// valores de las acciones 

var _valorHeineken = 1000;
var _valorNike = 1000;
var _valorMcDonalds = 1000;
var _valorGatorade = 1000;

// arrays con log de las jugadas y los valores de cada empresa 

var _logHeineken = new Array();
var _logGatorade = new Array();
var _logNike = new Array();
var _logMcDonalds = new Array();
var _logLabels = new Array();

_logHeineken[_valorIndice]=1000;
_logGatorade[0]=1000;
_logNike[0]=1000;
_logMcDonalds[0]=1000;
_logLabels[0]="0";

// arrays con log de los totales por compañia ( jugador ) 

var _logJugador_1 = new Array();
var _logJugador_2 = new Array();
var _logJugador_3 = new Array();
var _logJugador_4 = new Array();

_logJugador_1[_valorIndice]=4000;
_logJugador_2[_valorIndice]=4000;
_logJugador_3[_valorIndice]=4000;
_logJugador_4[_valorIndice]=4000;


// Canvas de graficas de linea empresas 

var _graficaLineaEmpresasCanvas = document.getElementById("popChart");
var _queGraficaVa = "A";

// ============================================================
// NUEVAS FUNCIONES DE PRELOADER Y PRECARGA
// ============================================================
function actualizarPreloader(mensaje, progreso) {
    const texto = document.getElementById('preloaderText');
    const barra = document.getElementById('preloaderBar');
    if (texto) texto.innerText = mensaje;
    if (barra && progreso !== undefined) {
        barra.style.width = progreso + '%';
    }
}

function ocultarPreloader() {
    const preloader = document.getElementById('preloader');
    const contenedor = document.getElementById('ContenedorGeneral');
    if (preloader) preloader.style.display = 'none';
    if (contenedor) {
        contenedor.style.display = 'block';
        redimensionarJuego();
    }
}

function precargarImagenesDeCartas(mazo, callback) {
    if (!mazo || mazo.length === 0) {
        if (callback) callback();
        return;
    }
    const total = mazo.length;
    let cargadas = 0;
    actualizarPreloader(`Cargando cartas (0/${total})`, 0);
    mazo.forEach(carta => {
        const img = new Image();
        img.onload = () => {
            cargadas++;
            const porcentaje = (cargadas / total) * 100;
            actualizarPreloader(`Cargando cartas (${cargadas}/${total})`, porcentaje);
            if (cargadas === total && callback) callback();
        };
        img.onerror = () => {
            cargadas++;
            const porcentaje = (cargadas / total) * 100;
            actualizarPreloader(`Cargando cartas (${cargadas}/${total})`, porcentaje);
            if (cargadas === total && callback) callback();
        };
        img.src = carta[2];
    });
}

// ============================================================
// BWS ANIMACIONES — animarCotizacion
// Actualiza el valor de cotización con:
//   · Counter animado (rueda de viejo a nuevo en ~600ms)
//   · Pop + glow verde si sube
//   · Shake + glow rojo si baja
//   · Sin animación si no cambió
// ============================================================
function animarCotizacion(idElemento, nuevoValor, valorAnterior) {
    var el = document.getElementById(idElemento);
    if (!el) return;

    // Valores numéricos limpios
    var desde = Number(valorAnterior) || 0;
    var hasta  = Number(nuevoValor)   || 0;

    // 1. Quitar clases previas de animación para poder reasignarlas
    el.classList.remove('bws-anim-up', 'bws-anim-down');

    // 2. Forzar reflow para que la animación siempre reinicie aunque el valor cambie varias veces seguidas
    void el.offsetWidth;

    // 3. Counter animado — rodamos el número de "desde" a "hasta" en 600ms
    var duracion  = 600;
    var inicio    = performance.now();
    var easeOut   = function(t) { return 1 - Math.pow(1 - t, 3); };

    function tick(ahora) {
        var progreso = Math.min((ahora - inicio) / duracion, 1);
        var valorActual = Math.round(desde + (hasta - desde) * easeOut(progreso));
        el.textContent = valorActual;
        if (progreso < 1) {
            requestAnimationFrame(tick);
        } else {
            el.textContent = hasta; // Valor final exacto
        }
    }
    requestAnimationFrame(tick);

    // 4. Clase de animación CSS según dirección
    if (hasta > desde) {
        el.classList.add('bws-anim-up');
    } else if (hasta < desde) {
        el.classList.add('bws-anim-down');
    }
    // Si es igual, no animamos (reconexión / sin cambio)
}

// Tabla de valores anteriores para calcular la dirección del cambio
var _prevCotizaciones = {
    ValorHeineken:  1000,
    ValorGatorade:  1000,
    ValorNike:      1000,
    ValorMcDonalds: 1000
};

// Wrapper que setea, anima y actualiza el previo
function setCotizacion(idElemento, nuevoValor) {
    var prev = _prevCotizaciones[idElemento] !== undefined
        ? _prevCotizaciones[idElemento]
        : nuevoValor;
    animarCotizacion(idElemento, nuevoValor, prev);
    _prevCotizaciones[idElemento] = nuevoValor;
}
// ============================================================


// --------------------------------------------------------------------------------------------------------------------//
// ------- EVENTOS SOCKET SERVER 
// --------------------------------------------------------------------------------------------------------------------//


// Esto es para que tú veas en TU navegador que conectó
socket.on('connect', () => {
    console.log("Conectado al servidor");
    actualizarPreloader("Conectado al servidor", 20);
});
// --- LOGICA DE ROLES INICIALES ---

socket.on('rolInicial', (data) => {
    console.log("Rol asignado: " + data.rol);
    window._rolRecibido = data.rol;
    // Los modales se mostrarán después de que la interfaz esté cargada
});

// --- LOGICA DE LIBERACIÓN (Para usuarios en espera ) ---
socket.on('liberarTablero', () => {
    console.log("Recibida orden de inicio: Liberando tablero.");

    // Ocultamos el modal de espera para los invitados
    const modalEspera = document.getElementById('ModalEspera');
    if (modalEspera) modalEspera.style.display = 'none';

    // Ocultamos el modal de backend para el host (si seguía abierto)
    const modalBackend = document.getElementById('ModalBackend');
    if (modalBackend) modalBackend.style.display = 'none';

});

// --- ELEGIR CON QUE JUGADOR DISPONIBLE SE JUEGA  ---

socket.on('abrirSeleccionPersonaje', (jugadoresServer) => {
    console.log("Abriendo selector de personaje...");

    document.getElementById('ModalBackend').style.display = 'none';
    document.getElementById('ModalEspera').style.display = 'none';

    const modal = document.getElementById('ModalSeleccionNombre');
    const contenedor = document.getElementById('ContenedorBotonesSeleccion');
    modal.style.display = 'flex';
    contenedor.innerHTML = ""; 

    jugadoresServer.forEach((jug, index) => {
        if (jug.nombre !== "Sin Asignar") {
            let btn = document.createElement('button');
            
            const ocupado = jug.socketId !== null;

            btn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style="margin-right:12px; flex-shrink:0;"><circle cx="12" cy="8" r="4" fill="#ffc107"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#ffc107" stroke-width="2" stroke-linecap="round"/></svg>
                <span class="nombre-jugador" style="flex-grow:1; text-align:left; font-family:'Rajdhani',sans-serif; font-size:13px; font-weight:700; letter-spacing:1px; color:${ocupado ? '#555' : '#ffffff'} !important;">
                    ${jug.nombre}${ocupado ? ' — OCUPADO' : ''}
                </span>
            `;

            btn.style.display = "flex";
            btn.style.alignItems = "center";
            btn.style.width = "100%";
            btn.style.padding = "8px 12px";
            btn.style.fontFamily = "'Rajdhani', sans-serif";
            btn.style.fontWeight = "700";
            btn.style.border = "1px solid " + (ocupado ? "#333" : "#1e3a5f");
            btn.style.borderRadius = "8px";
            btn.style.transition = "all 0.2s ease";
            btn.style.background = ocupado ? "#111" : "#0d1929";
            btn.style.marginBottom = "6px";

            if (ocupado) {
                btn.style.cursor = "not-allowed";
                btn.disabled = true;
            } else {
                btn.style.cursor = "pointer";
                btn.onmouseover = () => {
                    btn.style.background = "#89152b";
                    btn.style.borderColor = "#89152b";
                };
                btn.onmouseout = () => {
                    btn.style.background = "#0d1929";
                    btn.style.borderColor = "#1e3a5f";
                };
                btn.onclick = () => elegirMiJugador(index);
            }

            contenedor.appendChild(btn);
        }
    });
});

//--- ** DEEPSEEK: Función para precargar todas las imágenes del mazo con modal de progreso
function precargarImagenesDeCartas(mazo, callback) {
    if (!mazo || mazo.length === 0) {
        if (callback) callback();
        return;
    }
    // Mostrar modal
    const modalCarga = document.getElementById('ModalCargaCartas');
    if (modalCarga) modalCarga.style.display = 'flex';
    
    const barra = document.getElementById('BarraCargaCartas');
    const texto = document.getElementById('TextoProgresoCarga');
    const total = mazo.length;
    let cargadas = 0;
    
    texto.innerText = `0 / ${total}`;
    
    function actualizarProgreso() {
        const porcentaje = (cargadas / total) * 100;
        if (barra) barra.style.width = porcentaje + '%';
        if (texto) texto.innerText = `${cargadas} / ${total}`;
        if (cargadas === total) {
            // Carga completa, esperar un momento para que se vea el 100% y luego ocultar modal
            setTimeout(() => {
                if (modalCarga) modalCarga.style.display = 'none';
                if (callback) callback();
            }, 300);
        }
    }
    
    mazo.forEach(carta => {
        const img = new Image();
        img.onload = () => {
            cargadas++;
            actualizarProgreso();
        };
        img.onerror = () => {
            cargadas++;
            actualizarProgreso();
        };
        img.src = carta[2];
    });
}

// --- LA PARTIDA COMIENZA PARA TODOS ---

socket.on('partidaListaParaEmpezar', (estadoRecibido) => {
    console.log("¡Partida lista! Sincronizando tablero...");
    if (_partidaYaInicializada) {
        console.log("Partida ya iniciada, ignorando reset.");
        return;
    }
    _partidaYaInicializada = true;
    document.getElementById('ModalSeleccionNombre').style.display = 'none';
    let miPosicionEnArray = estadoRecibido.jugadores.findIndex(j => j.socketId === socket.id);
    miAsientoLocal = miPosicionEnArray + 1;
    _jugadorSeleccionado = 1;
    _turnoJugador = 0;
    const jugadoresActivos = estadoRecibido.jugadores.filter(j => j.nombre !== "Sin Asignar").length;
    _valorIndice = jugadoresActivos * 4;
    console.log("Confirmado: Soy el Jugador " + miAsientoLocal + " — Mazo empieza en índice: " + _valorIndice);

    if (estadoRecibido.masoCartas) {
        cartasMaestro = estadoRecibido.masoCartas;
    }

    // Precargar imágenes y luego mostrar la interfaz
    precargarImagenesDeCartas(cartasMaestro, () => {
        // Inicializar visualmente todo (igual que antes)
        estadoRecibido.jugadores.forEach((jugServ, index) => {
            let num = index + 1;
            if (jugServ.nombre !== "Sin Asignar") {
                document.getElementById("Jugador" + num + "_Nombre").innerHTML = jugServ.nombre;
                document.getElementById("Jugador" + num + "_V_Nombre").innerHTML = jugServ.nombre;
                document.getElementById("Jugador" + num + "_Total").innerHTML = num2Format(4000);
                document.getElementById("Jugador" + num + "_Cash").innerHTML = "0";
                _jugadores[index][0] = jugServ.nombre;
                document.getElementById("Jugador" + num + "_Heineken").innerHTML = "1";
                document.getElementById("Jugador" + num + "_Gatorade").innerHTML = "1";
                document.getElementById("Jugador" + num + "_Nike").innerHTML = "1";
                document.getElementById("Jugador" + num + "_McDonalds").innerHTML = "1";
            } else {
                document.getElementById("Jugador" + num + "_Total").innerHTML = "";
                document.getElementById("Jugador" + num + "_Cash").innerHTML = "";
                document.getElementById("Jugador" + num + "_Heineken").innerHTML = "";
                document.getElementById("Jugador" + num + "_Gatorade").innerHTML = "";
                document.getElementById("Jugador" + num + "_Nike").innerHTML = "";
                document.getElementById("Jugador" + num + "_McDonalds").innerHTML = "";
            }
        });
        document.getElementById('TurnoJugador').innerHTML = _jugadores[0][0];
        document.getElementById('MInteractivoTituloMaso').innerHTML = "Movimientos : " + _valorIndice + "/68";
        gestionarBloqueoPantalla(1, estadoRecibido.jugadores);
        document.getElementById("Jugador1_Linea").style = "border-style: solid; border-color: red; border-width: 2px;";
        document.getElementById("Jugador1_V_Linea").style = "border-style: solid; border-color: red; border-width: 2px;";
        dibujoGraficaBarras(_valorHeineken, _valorGatorade, _valorNike, _valorMcDonalds);
        grafcaLineal();
        mostrarCartasJugador();
        iniciarTimerTurno();

        // Ocultar preloader y mostrar el juego
        ocultarPreloader();

        // Mostrar el modal correspondiente según el rol guardado
        if (window._rolRecibido === 'host') {
            document.getElementById('ModalBackend').style.display = 'flex';
        } else if (window._rolRecibido === 'espera') {
            document.getElementById('ModalEspera').style.display = 'flex';
        }
    });
});

//--------------------------------

socket.on('reconectarJugador', (data) => {
    console.log("Reconectando jugador al índice: " + data.miIndice);
    const estadoRecibido = data.estadoJuego;
    _partidaYaInicializada = true;
    document.getElementById('ModalSeleccionNombre').style.display = 'none';
    miAsientoLocal = data.miIndice + 1;
    console.log("Reconectado como Jugador " + miAsientoLocal);
    _valorHeineken  = estadoRecibido.precios.heineken;
    _valorGatorade  = estadoRecibido.precios.gatorade;
    _valorNike      = estadoRecibido.precios.nike;
    _valorMcDonalds = estadoRecibido.precios.mcdonalds;
    _valorIndice    = estadoRecibido.entorno.IndiceJuego;
    _turnoJugador   = estadoRecibido.entorno.TurnoJugador;
    if (estadoRecibido.entorno.cartaJugada) {
        _jugarCartas = false;
        document.getElementById("Finalizar").style = "background-color: red;";
        document.getElementById("Finalizar").disabled = false;
        document.getElementById('CartaMaso').style.cursor = 'not-allowed';
        document.getElementById('CartaMaso').onclick = null;
    } else {
        _jugarCartas = true;
        document.getElementById("Finalizar").style = "background-color: grey;";
        document.getElementById("Finalizar").disabled = true;
        document.getElementById('CartaMaso').style.cursor = 'pointer';
        document.getElementById('CartaMaso').onclick = function() { jugadaCartaDelMaso(); };
    }
    if (estadoRecibido.masoCartas) {
        cartasMaestro = estadoRecibido.masoCartas;
    }

    //--- ** DEEPSEEK: Precargar imágenes antes de continuar
    precargarImagenesDeCartas(cartasMaestro, () => {
        estadoRecibido.jugadores.forEach((jugServ, index) => {
            let num = index + 1;
            if (jugServ.nombre !== "Sin Asignar") {
                _jugadores[index][0] = jugServ.nombre;
                _jugadores[index][1] = jugServ.c1 !== undefined ? jugServ.c1 : true;
                _jugadores[index][2] = jugServ.c2 !== undefined ? jugServ.c2 : true;
                _jugadores[index][3] = jugServ.c3 !== undefined ? jugServ.c3 : true;
                _jugadores[index][4] = jugServ.c4 !== undefined ? jugServ.c4 : true;
                document.getElementById("Jugador" + num + "_Nombre").innerHTML = jugServ.nombre;
                document.getElementById("Jugador" + num + "_V_Nombre").innerHTML = jugServ.nombre;
                document.getElementById("Jugador" + num + "_Cash").innerHTML = num2Format(jugServ.cash);
                document.getElementById("Jugador" + num + "_Heineken").innerHTML = num2Format(jugServ.h);
                document.getElementById("Jugador" + num + "_Gatorade").innerHTML = num2Format(jugServ.g);
                document.getElementById("Jugador" + num + "_Nike").innerHTML = num2Format(jugServ.n);
                document.getElementById("Jugador" + num + "_McDonalds").innerHTML = num2Format(jugServ.m);
            }else{ 
                document.getElementById("Jugador" + num + "_Cash").innerHTML = "";
                document.getElementById("Jugador" + num + "_Heineken").innerHTML = "";
                document.getElementById("Jugador" + num + "_Gatorade").innerHTML = "";
                document.getElementById("Jugador" + num + "_Nike").innerHTML = "";            
                document.getElementById("Jugador" + num + "_McDonalds").innerHTML = "";            
            }
        });
        setCotizacion('ValorHeineken',  _valorHeineken);
        setCotizacion('ValorGatorade',  _valorGatorade);
        setCotizacion('ValorNike',      _valorNike);
        setCotizacion('ValorMcDonalds', _valorMcDonalds);
        document.getElementById('MInteractivoTituloMaso').innerHTML = "Movimientos : " + _valorIndice + "/68";
        const turnoActual = estadoRecibido.entorno.TurnoJugador + 1;
        gestionarBloqueoPantalla(turnoActual, estadoRecibido.jugadores);
        dibujoGraficaBarras(_valorHeineken, _valorGatorade, _valorNike, _valorMcDonalds);
        calcularTotalJugadores();
        mostrarCartasJugador();
        actualizarIndicadoresCartas();
        iniciarTimerTurno();

        ocultarPreloader();

        if (window._rolRecibido === 'host') {
            document.getElementById('ModalBackend').style.display = 'flex';
        } else if (window._rolRecibido === 'espera') {
            document.getElementById('ModalEspera').style.display = 'flex';
        }
        console.log("Reconexión completada. Turno actual: " + turnoActual);

    });
});
// --------------------------------- manejo de turnos en el socket ------------------------

socket.on('actualizarTurno', (data) => {
    console.log("Cambio de turno recibido. Turno del jugador: " + data.turno);
    // 1. Actualizamos la variable de turno global
    _turnoJugador = data.turno - 1;
    // 2. Reseteamos el flag de carta y el botón finalizar
    _jugarCartas = true;
    document.getElementById("Finalizar").style = "background-color : grey;";
    document.getElementById("Finalizar").disabled = true;
    // 3. Gestión de bloqueo y desconexión
    gestionarBloqueoPantalla(data.turno, data.jugadores);
    // 4. Sincronizamos la variable de control de transacciones
    _jugadorSeleccionado = data.turno;
    // 5. Asignación del botón Saltear
    document.getElementById('BtnSaltearTurno').onclick = function() {
        ejecutarSalteoPorDesconexion();
    };
    // 6. UI: Nombre del jugador actual (Monitor Central)
    document.getElementById('TurnoJugador').innerHTML = _jugadores[data.turno - 1][0];
    // 7. UI: Bordes de jugadores
    for (let i = 1; i <= 4; i++) {
        document.getElementById("Jugador" + i + "_Linea").style = "border-style: none; border-color: #ccc; border-width: 0.5px;";
        document.getElementById("Jugador" + i + "_V_Linea").style = "border-style: none; border-color: #ccc; border-width: 0.5px;";
    }
    document.getElementById("Jugador" + data.turno + "_Linea").style = "border-style: solid; border-color: red; border-width: 2px;";
    document.getElementById("Jugador" + data.turno + "_V_Linea").style = "border-style: solid; border-color: red; border-width: 2px;";
    // 8. INICIAR TEMPORIZADOR
    iniciarTimerTurno();
});

// ---------------------- OIDOS : Todos los valores del juego -------------------------------------------------------//
socket.on('actualizarCliente', (estadoJuegoServidor) => {
    
    console.log("Sincronizando tablero completo con el servidor...", estadoJuegoServidor);
    console.log("cartaActual recibido:", estadoJuegoServidor.entorno.cartaActual);
    console.log("jugadores desde servidor:", JSON.stringify(estadoJuegoServidor.jugadores));

    _valorHeineken   = estadoJuegoServidor.precios.heineken;
    _valorGatorade   = estadoJuegoServidor.precios.gatorade;
    _valorNike       = estadoJuegoServidor.precios.nike;
    _valorMcDonalds  = estadoJuegoServidor.precios.mcdonalds;
    _valorIndice = estadoJuegoServidor.entorno.IndiceJuego;
    _turnoJugador = estadoJuegoServidor.entorno.TurnoJugador;
    _cartaJugadaServidor = estadoJuegoServidor.entorno.cartaJugada;

    if (estadoJuegoServidor.masoCartas) {
        cartasMaestro = estadoJuegoServidor.masoCartas;
    }

    // Guardamos el largo ANTES de actualizar
    var _largoAnterior = _logLabels ? _logLabels.length : 0;

    if (estadoJuegoServidor.logEmpresas) {
        _logHeineken  = estadoJuegoServidor.logEmpresas.heineken;
        _logGatorade  = estadoJuegoServidor.logEmpresas.gatorade;
        _logNike      = estadoJuegoServidor.logEmpresas.nike;
        _logMcDonalds = estadoJuegoServidor.logEmpresas.mcdonalds;
        _logLabels    = estadoJuegoServidor.logEmpresas.labels;
        _valorIndiceGraficas = _logHeineken.length - 1;
    }
    if (estadoJuegoServidor.logJugadores) {
        _logJugador_1 = estadoJuegoServidor.logJugadores.j1;
        _logJugador_2 = estadoJuegoServidor.logJugadores.j2;
        _logJugador_3 = estadoJuegoServidor.logJugadores.j3;
        _logJugador_4 = estadoJuegoServidor.logJugadores.j4;
    }

    if (estadoJuegoServidor.entorno.cartaActual !== null && 
        estadoJuegoServidor.entorno.cartaActual !== undefined &&
        cartasMaestro && cartasMaestro[estadoJuegoServidor.entorno.cartaActual]) {
        document.getElementById('CartaJugada').src = cartasMaestro[estadoJuegoServidor.entorno.cartaActual][2];
    }

    setCotizacion('ValorHeineken',  _valorHeineken);
    setCotizacion('ValorGatorade',  _valorGatorade);
    setCotizacion('ValorMcDonalds', _valorMcDonalds);
    setCotizacion('ValorNike',      _valorNike);

    estadoJuegoServidor.jugadores.forEach((jugadorServer, index) => {
        if (jugadorServer.nombre !== "Sin Asignar") {
            let i = index + 1;
            _jugadores[index][0] = jugadorServer.nombre;
            if (index !== miAsientoLocal - 1) {
                _jugadores[index][1] = jugadorServer.c1 !== undefined ? jugadorServer.c1 : true;
                _jugadores[index][2] = jugadorServer.c2 !== undefined ? jugadorServer.c2 : true;
                _jugadores[index][3] = jugadorServer.c3 !== undefined ? jugadorServer.c3 : true;
                _jugadores[index][4] = jugadorServer.c4 !== undefined ? jugadorServer.c4 : true;
            }
            document.getElementById("Jugador"+i+"_Nombre").innerHTML   = jugadorServer.nombre;
            document.getElementById("Jugador"+i+"_V_Nombre").innerHTML = jugadorServer.nombre;
            document.getElementById("Jugador"+i+"_Cash").innerHTML      = num2Format(jugadorServer.cash);
            document.getElementById("Jugador"+i+"_Heineken").innerHTML  = num2Format(jugadorServer.h);
            document.getElementById("Jugador"+i+"_Gatorade").innerHTML  = num2Format(jugadorServer.g);
            document.getElementById("Jugador"+i+"_Nike").innerHTML      = num2Format(jugadorServer.n);
            document.getElementById("Jugador"+i+"_McDonalds").innerHTML = num2Format(jugadorServer.m);
        }
    });

    if (typeof dibujoGraficaBarras === "function") {
        dibujoGraficaBarras(_valorHeineken, _valorGatorade, _valorNike, _valorMcDonalds);
    }

    // Redibujamos solo si el largo de labels cambió o si el jugador local finalizó
    if (typeof grafcaLineal === "function") {
        if (_actualizarGrafica || _logLabels.length !== _largoAnterior) {
            grafcaLineal();
            _actualizarGrafica = false;
        }
    }

    if (typeof calcularTotalJugadores === "function") {
        calcularTotalJugadores();
    }
    if (_valorIndice > 67) {    
        document.getElementById('CartaMaso').src = "_imagenes/MasoVacio.png";
    }
    document.getElementById('MInteractivoTituloMaso').innerHTML = "Movimientos : " + String(_valorIndice) + "/68";
    document.getElementById('TurnoJugador').innerHTML = _jugadores[_turnoJugador][0];
    document.getElementById("Jugador1_Linea").style= "border-style:none;" ;
    document.getElementById("Jugador1_V_Linea").style= "border-style:none;" ;
    document.getElementById("Jugador2_Linea").style= "border-style:none;" ;
    document.getElementById("Jugador2_V_Linea").style= "border-style:none;" ;
    document.getElementById("Jugador3_Linea").style= "border-style:none;" ;
    document.getElementById("Jugador3_V_Linea").style= "border-style:none;" ;
    document.getElementById("Jugador4_Linea").style= "border-style:none;" ;
    document.getElementById("Jugador4_V_Linea").style= "border-style:none;" ;
    document.getElementById("Jugador"+String(_turnoJugador+1)+"_Linea").style= "border-style: solid; border-color: red; border-width: 2px;" ;
    document.getElementById("Jugador"+String(_turnoJugador+1)+"_V_Linea").style= "border-style: solid; border-color: red; border-width: 2px;" ;
    actualizarIndicadoresCartas();
});
// ---------------------- OIDOS : Cuando alguien juega del maso -------------------------------------------------------//


socket.on('ejecutarMostrarCartaMaso', dataParam => {
    console.log("Se ha tirado la carta " + dataParam);
    // muestro la carta elegida en el cliente cuando otro jugo una carta 
    if (cartasMaestro && cartasMaestro[dataParam]) {
        document.getElementById('CartaJugada').src = cartasMaestro[dataParam][2];
    }
});

// -------------------------- historial 

socket.on('actualizarHistorial', (historial) => {
    _historialTransacciones = historial;
});

// ------------------------------ mostar la carta que salio a los demas

socket.on('mostrarCartaEspera', (indiceParametro) => {
    document.getElementById('ModalCartaEspera').style.display = 'flex';
    if (cartasMaestro && cartasMaestro[indiceParametro]) {
        document.getElementById('ImagenCartaEspera').src = cartasMaestro[indiceParametro][2];
    }
    var interior = document.getElementById('ModalCartaEsperaInterior');
    if (interior) {
        interior.classList.remove('bws-modal-down');
        void interior.offsetWidth;
        interior.classList.add('bws-modal-down');
    }
});

socket.on('cerrarCartaEspera', () => {
    document.getElementById('ModalCartaEspera').style.display = 'none';
});

// ---------------------------- FUNCIÓN PARA ENVIAR DATOS AL SERVIDOR -----------------------------------//

function sincronizarMiPantallaAlServidor() {

    var datosParaEnviar = {

        precios: {

            heineken:  _valorHeineken,
            gatorade:  _valorGatorade,
            nike:      _valorNike,
            mcdonalds: _valorMcDonalds

        },

        entorno: {

            IndiceJuego:   _valorIndice,
            TurnoJugador:  _turnoJugador,
            cartaJugada:   !_jugarCartas

        },

        jugadores: []
    };

    for (var i = 0; i < 4; i++) {
        // Solo enviamos los datos si el asiento tiene un jugador asignado
        if (_jugadores[i][0] !== "Sin Asignar") {
            datosParaEnviar.jugadores.push({
                nombre: _jugadores[i][0],
                cash:   Number(format2Num(document.getElementById("Jugador"+String(i+1)+"_Cash").innerHTML)),
                h:      Number(format2Num(document.getElementById("Jugador"+String(i+1)+"_Heineken").innerHTML)),
                g:      Number(format2Num(document.getElementById("Jugador"+String(i+1)+"_Gatorade").innerHTML)),
                n:      Number(format2Num(document.getElementById("Jugador"+String(i+1)+"_Nike").innerHTML)),
                m:      Number(format2Num(document.getElementById("Jugador"+String(i+1)+"_McDonalds").innerHTML)),
                c1:     _jugadores[i][1],
                c2:     _jugadores[i][2],
                c3:     _jugadores[i][3],
                c4:     _jugadores[i][4]
            });
        }
    }
    socket.emit('enviarJugadaAlServidor', datosParaEnviar);
    console.log("Datos sincronizados al servidor:", datosParaEnviar);
}

// ------------ funcion para el modal de seleccion de jugador

function elegirMiJugador(indice) {
    console.log("Has elegido ser el jugador índice: " + indice);
    
    // Bloqueamos los botones para que no haga mil clics
    const botones = document.querySelectorAll('#ContenedorBotonesSeleccion button');
    botones.forEach(b => b.disabled = true);
    
    document.getElementById('MensajeEsperaSeleccion').style.display = 'block';

    // Le avisamos al servidor nuestra elección
    socket.emit('usuarioEligioNombre', indice);
}
// --------------------------------------------------------------------------------------------------------//
// ------------------------------------ INICIO BWS WEB ----------------------------------------------------//
// --------------------------------------------------------------------------------------------------------//

// ------------------------------------- cartas en el tablero de valores 

function actualizarIndicadoresCartas() {
    for (var i = 0; i < 4; i++) {
        var num = i + 1;
        for (var c = 1; c <= 4; c++) {
            var elemento = document.getElementById('J' + num + '_C' + c);
            if (elemento) {
                elemento.style.background = _jugadores[i][c] ? '#89152b' : '#444';
            }
        }
    }
}
//-------------------------------- ALMACENAMIENTO EN LOCAL STORAGE ---------------------------------------------//

function saveDataLocalStorage () {

//	ANTES de guardar la data de la memoria al disco, hago una copia de lo que hay en el disco mismo
// 	y asi poder ir a la mano anterior ante cualquier problema. 

	saveAnteriorDataLocalStorage();

// 	Guardo los datos de la memoria al disco luego de la copia anterior

	localStorage.setItem('jugadores',JSON.stringify(_jugadores));
	localStorage.setItem('cartas',JSON.stringify(cartasMaestro));

	localStorage.setItem('logHeineken',JSON.stringify(_logHeineken));
	localStorage.setItem('logGatorade',JSON.stringify(_logGatorade));
	localStorage.setItem('logNike',JSON.stringify(_logNike));
	localStorage.setItem('logMcDonalds',JSON.stringify(_logMcDonalds));
	localStorage.setItem('logLabels',JSON.stringify(_logLabels));

	localStorage.setItem('logJugador_1',JSON.stringify(_logJugador_1));
	localStorage.setItem('logJugador_2',JSON.stringify(_logJugador_2));
	localStorage.setItem('logJugador_3',JSON.stringify(_logJugador_3));
	localStorage.setItem('logJugador_4',JSON.stringify(_logJugador_4));

	localStorage.setItem('valorIndice',_valorIndice);
	localStorage.setItem('valorIndiceGraficas',_valorIndiceGraficas);
	localStorage.setItem('turnoJugador',_turnoJugador);
//	localStorage.setItem('jugarCartasMaso',_jugarCartas);

	localStorage.setItem('valorHeineken',_valorHeineken);
	localStorage.setItem('valorGatorade',_valorGatorade);
	localStorage.setItem('valorNike',_valorNike);
	localStorage.setItem('valorMcDonalds',_valorMcDonalds);


	for ( var i=0;i<_jugadores.length; i++) {

		if (_jugadores[i][0]!="Sin Asignar" ) {

			localStorage.setItem("Jugador"+String(i+1)+"_Cash",Number(format2Num(document.getElementById("Jugador"+String(i+1)+"_Cash").innerHTML)));
			localStorage.setItem("Jugador"+String(i+1)+"_Heineken",Number(format2Num(document.getElementById("Jugador"+String(i+1)+"_Heineken").innerHTML)));
			localStorage.setItem("Jugador"+String(i+1)+"_McDonalds",Number(format2Num(document.getElementById("Jugador"+String(i+1)+"_McDonalds").innerHTML)));
			localStorage.setItem("Jugador"+String(i+1)+"_Gatorade",Number(format2Num(document.getElementById("Jugador"+String(i+1)+"_Gatorade").innerHTML)));
			localStorage.setItem("Jugador"+String(i+1)+"_Nike",Number(format2Num(document.getElementById("Jugador"+String(i+1)+"_Nike").innerHTML)));
			

		}else{

			localStorage.setItem("Jugador"+String(i+1)+"_Cash",".");
			localStorage.setItem("Jugador"+String(i+1)+"_Heineken",".");
			localStorage.setItem("Jugador"+String(i+1)+"_McDonalds",".");
			localStorage.setItem("Jugador"+String(i+1)+"_Gatorade",".");
			localStorage.setItem("Jugador"+String(i+1)+"_Nike",".");


		}

	}
}

//----------------------------------------- RESTORE DATA LOCAL STORAGE ------------------------------------//

function restoreDataLocalStorage () {

	_jugadores = JSON.parse(localStorage.getItem('jugadores'));
	cartasMaestro = JSON.parse(localStorage.getItem('cartas'));

	_logHeineken = JSON.parse(localStorage.getItem('logHeineken'));
	_logGatorade = JSON.parse(localStorage.getItem('logGatorade'));
	_logNike = JSON.parse(localStorage.getItem('logNike'));
	_logMcDonalds = JSON.parse(localStorage.getItem('logMcDonalds'));
	_logLabels = JSON.parse(localStorage.getItem('logLabels'));

	_logJugador_1 = JSON.parse(localStorage.getItem('logJugador_1'));
	_logJugador_2 = JSON.parse(localStorage.getItem('logJugador_2'));
	_logJugador_3 = JSON.parse(localStorage.getItem('logJugador_3'));
	_logJugador_4 = JSON.parse(localStorage.getItem('logJugador_4'));

	_valorIndice = Number(localStorage.getItem('valorIndice'));
	_valorIndiceGraficas = Number(localStorage.getItem('valorIndiceGraficas'));

	_turnoJugador = Number(localStorage.getItem('turnoJugador'));
//	_jugarCartas = Number(localStorage.getItem('jugarCartasMaso'));
	_jugarCartas = true;

	_valorHeineken = Number(localStorage.getItem('valorHeineken'));
	_valorGatorade = Number(localStorage.getItem('valorGatorade'));
	_valorNike = Number(localStorage.getItem('valorNike'));
	_valorMcDonalds = Number(localStorage.getItem('valorMcDonalds'));

	for ( var i=0;i<_jugadores.length; i++) {

		if (_jugadores[i][0]!="Sin Asignar" ) {


			document.getElementById("Jugador"+String(i+1)+"_Nombre").innerHTML = _jugadores[i][0];
			document.getElementById("Jugador"+String(i+1)+"_V_Nombre").innerHTML = _jugadores[i][0];
			document.getElementById("Jugador"+String(i+1)+"_Cash").innerHTML = num2Format(Number(localStorage.getItem("Jugador"+String(i+1)+"_Cash")));
			document.getElementById("Jugador"+String(i+1)+"_Heineken").innerHTML = num2Format(Number(localStorage.getItem("Jugador"+String(i+1)+"_Heineken")));
			document.getElementById("Jugador"+String(i+1)+"_Gatorade").innerHTML = num2Format(Number(localStorage.getItem("Jugador"+String(i+1)+"_Gatorade")));
			document.getElementById("Jugador"+String(i+1)+"_Nike").innerHTML = num2Format(Number(localStorage.getItem("Jugador"+String(i+1)+"_Nike")));			
			document.getElementById("Jugador"+String(i+1)+"_McDonalds").innerHTML = num2Format(Number(localStorage.getItem("Jugador"+String(i+1)+"_McDonalds")));

		}else{

			document.getElementById("Jugador"+String(i+1)+"_Cash").innerHTML = ".";
			document.getElementById("Jugador"+String(i+1)+"_Heineken").innerHTML = ".";
			document.getElementById("Jugador"+String(i+1)+"_Gatorade").innerHTML = ".";
			document.getElementById("Jugador"+String(i+1)+"_Nike").innerHTML = ".";			
			document.getElementById("Jugador"+String(i+1)+"_McDonalds").innerHTML = ".";


		}

	}

	document.getElementById('TurnoJugador').innerHTML = _jugadores[_turnoJugador][0];
	setCotizacion('ValorHeineken',  _valorHeineken);
	setCotizacion('ValorGatorade',  _valorGatorade);
	setCotizacion('ValorMcDonalds', _valorMcDonalds);
	setCotizacion('ValorNike',      _valorNike);
	document.getElementById('MInteractivoTituloMaso').innerHTML = "Movimientos : " + String(_valorIndice) + "/68";
	document.getElementById('CartaJugada').src = cartasMaestro[_valorIndice-1][2];
	

	document.getElementById("Jugador"+String(_turnoJugador+1)+"_Linea").style= "border-color: red; border-width: 2px;" ;
	document.getElementById("Jugador"+String(_turnoJugador+1)+"_V_Linea").style= "border-color: red; border-width: 2px;" ;

	document.getElementById("Finalizar").style = "background-color : grey;";
	document.getElementById("Finalizar").disabled = true;

	dibujoGraficaBarras(_valorHeineken,_valorGatorade,_valorNike,_valorMcDonalds);
	grafcaLineal();
	calcularTotalJugadores();
	mostrarCartasJugador();
}
function sacarNan() {
alert("cambiando valores");
document.getElementById("Jugador1_Total").innerHTML = "0";
document.getElementById("Jugador1_Cash").innerHTML = "0";

}
// ------------------------------------ SAVE ANTERIOR DATA LOCAL STORAGE ------------------------------------//

function saveAnteriorDataLocalStorage () {


	localStorage.setItem('_a_jugadores',JSON.stringify(JSON.parse(localStorage.getItem('jugadores'))));
	localStorage.setItem('_a_cartas',JSON.stringify(JSON.parse(localStorage.getItem('cartas'))));

	localStorage.setItem('_a_logHeineken',JSON.stringify(JSON.parse(localStorage.getItem('logHeineken'))));
	localStorage.setItem('_a_logGatorade',JSON.stringify(JSON.parse(localStorage.getItem('logGatorade'))));
	localStorage.setItem('_a_logNike',JSON.stringify(JSON.parse(localStorage.getItem('logNike'))));
	localStorage.setItem('_a_logMcDonalds',JSON.stringify(JSON.parse(localStorage.getItem('logMcDonalds'))));
	localStorage.setItem('_a_logLabels',JSON.stringify(JSON.parse(localStorage.getItem('logLabels'))));

	localStorage.setItem('_a_logJugador_1',JSON.stringify(JSON.parse(localStorage.getItem('logJugador_1'))));
	localStorage.setItem('_a_logJugador_2',JSON.stringify(JSON.parse(localStorage.getItem('logJugador_2'))));
	localStorage.setItem('_a_logJugador_3',JSON.stringify(JSON.parse(localStorage.getItem('logJugador_3'))));
	localStorage.setItem('_a_logJugador_4',JSON.stringify(JSON.parse(localStorage.getItem('logJugador_4'))));

	localStorage.setItem('_a_valorIndice',Number(localStorage.getItem('valorIndice')));
	localStorage.setItem('_a_valorIndiceGraficas',Number(localStorage.getItem('valorIndiceGraficas')));
	localStorage.setItem('_a_turnoJugador',Number(localStorage.getItem('turnoJugador')));

	localStorage.setItem('_a_valorHeineken',Number(localStorage.getItem('valorHeineken')));
	localStorage.setItem('_a_valorGatorade',Number(localStorage.getItem('valorGatorade')));
	localStorage.setItem('_a_valorNike',Number(localStorage.getItem('valorNike')));
	localStorage.setItem('_a_valorMcDonalds',Number(localStorage.getItem('valorMcDonalds')));


	for ( var i=0;i<_jugadores.length; i++) {

		if (_jugadores[i][0]!="Sin Asignar" ) {

			localStorage.setItem("_a_Jugador"+String(i+1)+"_Cash",num2Format(Number(localStorage.getItem("Jugador"+String(i+1)+"_Cash"))));
			localStorage.setItem("_a_Jugador"+String(i+1)+"_Heineken",num2Format(Number(localStorage.getItem("Jugador"+String(i+1)+"_Heineken"))));
			localStorage.setItem("_a_Jugador"+String(i+1)+"_McDonalds",num2Format(Number(localStorage.getItem("Jugador"+String(i+1)+"_McDonalds"))));
			localStorage.setItem("_a_Jugador"+String(i+1)+"_Gatorade",num2Format(Number(localStorage.getItem("Jugador"+String(i+1)+"_Gatorade"))));
			localStorage.setItem("_a_Jugador"+String(i+1)+"_Nike",num2Format(Number(localStorage.getItem("Jugador"+String(i+1)+"_Nike"))));
			

		}else{

			localStorage.setItem("_a_Jugador"+String(i+1)+"_Cash",".");
			localStorage.setItem("_a_Jugador"+String(i+1)+"_Heineken",".");
			localStorage.setItem("_a_Jugador"+String(i+1)+"_McDonalds",".");
			localStorage.setItem("_a_Jugador"+String(i+1)+"_Gatorade",".");
			localStorage.setItem("_a_Jugador"+String(i+1)+"_Nike",".");


		}

	}
}

//----------------------------------------- RESTORE ANTERIOR DATA LOCAL STORAGE ------------------------------//

function restoreAnteriorDataLocalStorage () {

var txt;
var r = confirm("Seguro que desea ir a la mano anterior ? ");
if (r == true) {

	_jugadores = JSON.parse(localStorage.getItem('_a_jugadores'));
	cartasMaestro = JSON.parse(localStorage.getItem('_a_cartas'));

	_logHeineken = JSON.parse(localStorage.getItem('_a_logHeineken'));
	_logGatorade = JSON.parse(localStorage.getItem('_a_logGatorade'));
	_logNike = JSON.parse(localStorage.getItem('_a_logNike'));
	_logMcDonalds = JSON.parse(localStorage.getItem('_a_logMcDonalds'));
	_logLabels = JSON.parse(localStorage.getItem('_a_logLabels'));

	_logJugador_1 = JSON.parse(localStorage.getItem('_a_logJugador_1'));
	_logJugador_2 = JSON.parse(localStorage.getItem('_a_logJugador_2'));
	_logJugador_3 = JSON.parse(localStorage.getItem('_a_logJugador_3'));
	_logJugador_4 = JSON.parse(localStorage.getItem('_a_logJugador_4'));

	_valorIndice = Number(localStorage.getItem('_a_valorIndice'));
	_valorIndiceGraficas = Number(localStorage.getItem('_a_valorIndiceGraficas'));

	_turnoJugador = Number(localStorage.getItem('_a_turnoJugador'));
//	_jugarCartas = Number(localStorage.getItem('jugarCartasMaso'));
	_jugarCartas = true;

	_valorHeineken = Number(localStorage.getItem('_a_valorHeineken'));
	_valorGatorade = Number(localStorage.getItem('_a_valorGatorade'));
	_valorNike = Number(localStorage.getItem('_a_valorNike'));
	_valorMcDonalds = Number(localStorage.getItem('_a_valorMcDonalds'));

	for ( var i=0;i<_jugadores.length; i++) {

		if (_jugadores[i][0]!="Sin Asignar" ) {


			document.getElementById("Jugador"+String(i+1)+"_Nombre").innerHTML = _jugadores[i][0];
			document.getElementById("Jugador"+String(i+1)+"_V_Nombre").innerHTML = _jugadores[i][0];
			document.getElementById("Jugador"+String(i+1)+"_Cash").innerHTML = num2Format(Number(localStorage.getItem("_a_Jugador"+String(i+1)+"_Cash")));
			document.getElementById("Jugador"+String(i+1)+"_Heineken").innerHTML = num2Format(Number(localStorage.getItem("_a_Jugador"+String(i+1)+"_Heineken")));
			document.getElementById("Jugador"+String(i+1)+"_Gatorade").innerHTML = num2Format(Number(localStorage.getItem("_a_Jugador"+String(i+1)+"_Gatorade")));
			document.getElementById("Jugador"+String(i+1)+"_Nike").innerHTML = num2Format(Number(localStorage.getItem("_a_Jugador"+String(i+1)+"_Nike")));			
			document.getElementById("Jugador"+String(i+1)+"_McDonalds").innerHTML = num2Format(Number(localStorage.getItem("_a_Jugador"+String(i+1)+"_McDonalds")));

		}else{

			document.getElementById("Jugador"+String(i+1)+"_Cash").innerHTML = ".";
			document.getElementById("Jugador"+String(i+1)+"_Heineken").innerHTML = ".";
			document.getElementById("Jugador"+String(i+1)+"_Gatorade").innerHTML = ".";
			document.getElementById("Jugador"+String(i+1)+"_Nike").innerHTML = ".";			
			document.getElementById("Jugador"+String(i+1)+"_McDonalds").innerHTML = ".";


		}

	}

	document.getElementById('TurnoJugador').innerHTML = _jugadores[_turnoJugador][0];
	setCotizacion('ValorHeineken',  _valorHeineken);
	setCotizacion('ValorGatorade',  _valorGatorade);
	setCotizacion('ValorMcDonalds', _valorMcDonalds);
	setCotizacion('ValorNike',      _valorNike);
	document.getElementById('MInteractivoTituloMaso').innerHTML = "Movimientos : " + String(_valorIndice) + "/68";
	

	document.getElementById("Jugador"+String(_turnoJugador+1)+"_Linea").style= "border-color: red; border-width: 2px;" ;
	document.getElementById("Jugador"+String(_turnoJugador+1)+"_V_Linea").style= "border-color: red; border-width: 2px;" ;

	document.getElementById("Finalizar").style = "background-color : grey;";
	document.getElementById("Finalizar").disabled = true;
	document.getElementById('CartaJugada').src = cartasMaestro[_valorIndice-1][2];

	dibujoGraficaBarras(_valorHeineken,_valorGatorade,_valorNike,_valorMcDonalds);
	grafcaLineal();
	calcularTotalJugadores();
	mostrarCartasJugador();

} else {
  txt = "You pressed Cancel!";
}	

}

// -------------------------------------------------- FUNCIONES PARA FORMATO DE NUMERO --------------------------------------------//

function num2Format (_num) {

	var answer ;

	if (_num > 0) {

		var num2 = _num.toString().split('.');
		var thousands = num2[0].split('').reverse().join('').match(/.{1,3}/g).join(',');
		var decimals = (num2[1]) ? '.'+num2[1] : '';
		answer =  thousands.split('').reverse().join('')+decimals;  
	} 

	else 
		answer = _num.toString();

	{
	}
//	console.log(answer);
	return answer;
}

function format2Num (_numCon){

//	console.log("va numparam : ")
//	console.log((_numCon));
	return parseFloat(_numCon.replace(/,/g,''));       
}

// ================================================== DEBUGER -======================================================================//

function debugBws(_desdeDondeLlaman){

//	console.log("======== "+_desdeDondeLlaman+" ==========");
//	console.log("Valor del Inidice ( jugada ) : "+_valorIndice.toString()+" Carta : "+cartasMaestro[_valorIndice][1]+" - "+cartasMaestro[_valorIndice][0]);
//	console.log("Turno del jugador            : "+_turnoJugador.toString()+" Nombre : " + _jugadores[_turnoJugador],[0]);
//	console.log("Valor Heineken 			  : "+_valorHeineken.toString());
//	console.log("Valor NikeX2 				  : "+_valorNike.toString());
//	console.log("Valor McDondals 			  : "+_valorMcDonalds.toString());
//	console.log("Valor Gatorade 			  : "+_valorGatorade.toString());

}

// ------------------------------------------------------ JUGAR CARTAS COMPLETAR (MODAL) --------------------------------------------------//
function jugarCartasCompletar(_esDelMaso, _queCarta) {
    var _valorIndiceAUX = _esDelMaso ? _valorIndice : _queCarta;
    debugBws(" Completar Jugada desde el Maso/Mano - Apertura de Modal ");
    // Si la carta es 1000, se ejecuta y sale sin abrir el modal. 
    if (cartasMaestro[_valorIndiceAUX][0] == "1000") {
        terminarJugadaCartas("parametro no necesario, no chequea marca cuando es 1000", _valorIndiceAUX);
        // Registramos la carta 1000 en el historial
        var _origen1000 = _jugoDeLaMano ? 'mano' : 'mazo';
        socket.emit('registrarTransaccion', {
            jugador: _jugadores[_turnoJugador][0],
            tipo: 'carta',
            origen: _origen1000,
            carta: '1000',
            empresaPrincipal: cartasMaestro[_valorIndiceAUX][1],
            empresaElegida: null
        });
// salteamos finalizar jugada para que no muestre el modal de que tiene cash ya que no lo
// puede usar.
//        finalizarJugada();
        _ejecutarFinalizarJugada();
        return;
    }
    // 1. Identificamos los elementos del Modal en el HTML
    var modal = document.getElementById("ModalCartas");
    var tituloTexto = document.getElementById("ModalTituloTexto");
    var divImagenes = document.getElementById("ModalImagenesOpciones");
    var divRadios = document.getElementById("ModalFormulario");
    // 2. Definimos qué texto mostrar según el tipo de carta
    switch (cartasMaestro[_valorIndiceAUX][0]) {
        case "500": tituloTexto.innerHTML = "QUE EMPRESA SUBE 600 ?"; break;
        case "600": tituloTexto.innerHTML = "QUE EMPRESA BAJA 300 ?"; break;
        case "/2":  tituloTexto.innerHTML = "QUE EMPRESA DUPLICA ?"; break;
        case "x2":  tituloTexto.innerHTML = "QUE EMPRESA BAJA A LA MITAD ?"; break;
    }
    // 3. Preparamos las opciones de empresas (excluyendo la de la carta)
    var empresaCarta = cartasMaestro[_valorIndiceAUX][1];
    var htmlImagenes = "";
    var htmlRadios = "";
    function agregarOpcion(imagenPng, letraEmpresa) {
        htmlImagenes += `<img src="_imagenes/${imagenPng}" style="width: 60px;">`;
        htmlRadios += `<input type="radio" name="modalRadio" style="cursor: pointer; transform: scale(1.5);" onclick="ejecutarSeleccionModal('${letraEmpresa}', ${_valorIndiceAUX})">`;
    }
    if (empresaCarta === "N") {
        agregarOpcion("PopUpMcDonalds.png", "M");
        agregarOpcion("PopUpGatorade.png", "G");
        agregarOpcion("PopUpHeineken.png", "H");
    } else if (empresaCarta === "H") {
        agregarOpcion("PopUpMcDonalds.png", "M");
        agregarOpcion("PopUpGatorade.png", "G");
        agregarOpcion("PopUpNike.png", "N");
    } else if (empresaCarta === "G") {
        agregarOpcion("PopUpMcDonalds.png", "M");
        agregarOpcion("PopUpHeineken.png", "H");
        agregarOpcion("PopUpNike.png", "N");
    } else if (empresaCarta === "M") {
        agregarOpcion("PopUpHeineken.png", "H");
        agregarOpcion("PopUpGatorade.png", "G");
        agregarOpcion("PopUpNike.png", "N");
    }
    // 4. Inyectamos el contenido y hacemos visible el modal
    divImagenes.innerHTML = htmlImagenes;
    divRadios.innerHTML = htmlRadios;
    //--- ** DEEPSEEK: Usar directamente la URL de la carta en lugar de copiar el src de CartaJugada
    const cartaActualImg = document.getElementById('ModalCartaImagen');
    cartaActualImg.src = cartasMaestro[_valorIndiceAUX][2];
    // muestro la carta que salio en el modal antes de abrirlo
    // (ya no es necesario copiar de CartaJugada)
    modal.style.display = "flex"; 
    var cajaBlanca = document.getElementById("ModalCajaInterior");
    var mangoTitulo = document.getElementById("ModalHeader");
    cajaBlanca.style.top = "50%";
    cajaBlanca.style.left = "50%";
    cajaBlanca.style.transform = "translate(-50%, -50%)";
    cajaBlanca.classList.remove('bws-modal-center-down');
    void cajaBlanca.offsetWidth;
    cajaBlanca.classList.add('bws-modal-center-down');
    hacerDraggable(cajaBlanca, cajaBlanca);
}

// ------------------------------------------------------ FUNCION PARA CERRAR EL MODAL --------------------------------------------------//
// Esta función es llamada cuando el usuario hace clic en el Radio Button del Modal
function ejecutarSeleccionModal(empresaElegida, indiceCarta) {
    document.getElementById("ModalCartas").style.display = "none";
    terminarJugadaCartas(empresaElegida, indiceCarta);
    var _empresaPrincipal = cartasMaestro[indiceCarta][1];
    var _tipoCarta = cartasMaestro[indiceCarta][0];
    var _nombreJugador = _jugadores[_turnoJugador][0];
    var _origen = _jugoDeLaMano ? 'mano' : 'mazo';
    socket.emit('registrarTransaccion', {
        jugador: _nombreJugador,
        tipo: 'carta',
        origen: _origen,
        carta: _tipoCarta,
        empresaPrincipal: _empresaPrincipal,
        empresaElegida: empresaElegida
    });
    if (!_jugoDeLaMano) {
        console.log("Emitiendo seJugoCartaDelMaso desde modal con índice:", indiceCarta, "carta:", cartasMaestro[indiceCarta]);
        socket.emit('seJugoCartaDelMaso', indiceCarta);
    }
    if (_jugoDeLaMano) {
        var _miIndice = miAsientoLocal - 1;
        socket.emit('actualizarCartasMano', {
            indiceJugador: _miIndice,
            c1: _jugadores[_miIndice][1],
            c2: _jugadores[_miIndice][2],
            c3: _jugadores[_miIndice][3],
            c4: _jugadores[_miIndice][4]
        });
    }
    socket.emit('cerrarCartaEspera');
    document.getElementById('ModalCartaEspera').style.display = 'none';
    sincronizarMiPantallaAlServidor();
}
// --------------------------------- ASIGNACION DE JUGADORES -------------------------------//

function asignacionInicialJugadores() {
	var nombresParaPartida = [];
    var _auxLocal = 1;

    while (_auxLocal < 5) {
        var nombreCapturado = document.getElementById("altasJ" + String(_auxLocal)).value;
        // Filtramos que no sea el valor por defecto "..." ni esté vacío
        if (nombreCapturado !== "..." && nombreCapturado.trim() !== "") {
            nombresParaPartida.push(nombreCapturado);
        }
        _auxLocal++;
    }

    // VALIDACIÓN CORREGIDA:
    if (nombresParaPartida.length === 0) {
        alert("Debes ingresar al menos el nombre de un jugador para comenzar.");
        // Al hacer "return", la función se corta aquí y NO ejecuta lo que sigue
        return; 
    }

    // Si llegó aquí, es que hay nombres válidos:
    console.log("Enviando nombres al servidor:", nombresParaPartida);
    socket.emit('configurarNombresPartida', nombresParaPartida);

    // RECIÉN AQUÍ cerramos el modal
    document.getElementById('ModalBackend').style.display = 'none';
}

//---------------------------------- REDONDEOS ----------------------------------------------//


function redondeos(){

	if (_valorNike % 100 > 0) {_valorNike = _valorNike - 50;}
	if (_valorHeineken % 100 > 0) {_valorHeineken = _valorHeineken - 50;}
	if (_valorMcDonalds % 100 > 0) {_valorMcDonalds = _valorMcDonalds - 50;}
	if (_valorGatorade % 100 > 0) {_valorGatorade = _valorGatorade - 50;}

}

//---------------------------------- TOPES -------------------------------------------//

function topes() {

	console.log(" Calculo de TOPES ")	;


	var _valorReventada ;
	var	_auxUserCash ;
	var _auxUserAcciones ; 

	// aca se puede mejorar ya que hace ochocientas preguntas al pedo ... falta anidar los if ( else if )

	// revienta 

	if (_valorHeineken > 2500 ) {

		_valorReventada = _valorHeineken - 2500 ;
		_valorHeineken = 2500 ;		

		for (var i=0;i<4;i++) {

			if (_jugadores[i][0] != "Sin Asignar") {

				_auxUserCash = Number(format2Num(document.getElementById("Jugador"+String(i+1)+"_Cash").innerHTML));				
				_auxUserAcciones = Number(format2Num(document.getElementById("Jugador"+String(i+1)+"_Heineken").innerHTML)); 
				document.getElementById("Jugador"+String(i+1)+"_Cash").innerHTML = num2Format(_auxUserCash + (_auxUserAcciones * _valorReventada));
				console.log(">>>> revento Heineken ")

			}

		}
	}

	if (_valorGatorade > 2500 ) {

		_valorReventada = _valorGatorade - 2500 ;
		_valorGatorade = 2500 ;

		for (var i=0;i<4;i++) {

			if (_jugadores[i][0] != "Sin Asignar") {

				_auxUserCash = Number(format2Num(document.getElementById("Jugador"+String(i+1)+"_Cash").innerHTML));				
				_auxUserAcciones = Number(format2Num(document.getElementById("Jugador"+String(i+1)+"_Gatorade").innerHTML)); 		
				document.getElementById("Jugador"+String(i+1)+"_Cash").innerHTML = num2Format(_auxUserCash + (_auxUserAcciones * _valorReventada));
				console.log(">>>> revento Gatorade  ")
			}

		}

	}

	if (_valorMcDonalds > 2500 ) {

		_valorReventada = _valorMcDonalds - 2500 ;
		_valorMcDonalds = 2500 ;

		for (var i=0;i<4;i++) {

			if (_jugadores[i][0] != "Sin Asignar") {

				_auxUserCash = Number(format2Num(document.getElementById("Jugador"+String(i+1)+"_Cash").innerHTML));				
				_auxUserAcciones = Number(format2Num(document.getElementById("Jugador"+String(i+1)+"_McDonalds").innerHTML)); 
				document.getElementById("Jugador"+String(i+1)+"_Cash").innerHTML = num2Format(_auxUserCash + (_auxUserAcciones * _valorReventada));
				console.log(">>>> revento McDonals ")
			}

		}
	}

	if (_valorNike > 2500 ) {

		_valorReventada = _valorNike - 2500 ;
		_valorNike = 2500 ;

		for (var i=0;i<4;i++) {

			if (_jugadores[i][0] != "Sin Asignar") {

				_auxUserCash = Number(format2Num(document.getElementById("Jugador"+String(i+1)+"_Cash").innerHTML));				
				_auxUserAcciones = Number(format2Num(document.getElementById("Jugador"+String(i+1)+"_Nike").innerHTML)); 
				document.getElementById("Jugador"+String(i+1)+"_Cash").innerHTML = num2Format(_auxUserCash + (_auxUserAcciones * _valorReventada));
				console.log(">>>> revento Nike ")
			}

		}

	}

	// Quiebra 

	if (_valorHeineken < 100 ) {

		_valorHeineken = 100 ;

		for (var i=0;i<4;i++) {

			if (_jugadores[i][0] != "Sin Asignar") {

				document.getElementById("Jugador"+String(i+1)+"_Heineken").innerHTML = 0;
//				console.log(">>>> quebro Heineken ")
			}

		}


	}

	if (_valorGatorade < 100 ) {

		_valorGatorade = 100 ;

		for (var i=0;i<4;i++) {

			if (_jugadores[i][0] != "Sin Asignar") {

				document.getElementById("Jugador"+String(i+1)+"_Gatorade").innerHTML = 0;
//				console.log(">>>> quebro Gatorade ")
			}

		}

	}

	if (_valorMcDonalds < 100 ) {

		_valorMcDonalds = 100 ;

		for (var i=0;i<4;i++) {

			if (_jugadores[i][0] != "Sin Asignar") {

				document.getElementById("Jugador"+String(i+1)+"_McDonalds").innerHTML = 0;
//				console.log(">>>> quebro McDonalds ")
			}

		}
	}

	if (_valorNike < 100 ) {

		_valorNike = 100 ;

		for (var i=0;i<4;i++) {

			if (_jugadores[i][0] != "Sin Asignar") {

				document.getElementById("Jugador"+String(i+1)+"_Nike").innerHTML = 0;
//				console.log(">>>> quebro Nike ")
			}

		}
	}

	debugBws(" TERMINE >>>>>> Calculo de TOPES ")	;

	calcularTotalJugadores();

}

//---------------------------------- Limpiar los valores por cambio de combo -----------------------------//

function limpiarValoresInput() {

	document.getElementById("H_Radio").checked = false;
	document.getElementById("G_Radio").checked = false;
	document.getElementById("M_Radio").checked = false;
	document.getElementById("N_Radio").checked = false;
	document.getElementById("CantidadInput").value ="0";

}

//---------------------------------- calculos por radio buttons -----------------------------//

function calcularPorRadio(_radio) {

	var _auxUserCash = 0;
	var _estadoCombo ; 
	var _quienJuegaCash ;
	var _quienJuegaEmpresa ;


	_quienJuegaCash = "Jugador"+String(_turnoJugador+1)+"_Cash";
	_estadoCombo = document.getElementById('ComboBox').value ;
	_auxUserCash = Number(format2Num(document.getElementById(_quienJuegaCash).innerHTML));

	if (_estadoCombo == 'C') {

		// comprar //

		switch (_radio) {


			case "H" :

				document.getElementById("CantidadInput").value = String(Math.floor(_auxUserCash / _valorHeineken));
				debugBws("Entra por RADIO > HEINEKEN - comprar ")	;
				break;
			case "M" :
				document.getElementById("CantidadInput").value = String(Math.floor(_auxUserCash / _valorMcDonalds));
				debugBws("Entra por RADIO > MC DONALDS - comprar")	;
				break;
			case "N" :
				document.getElementById("CantidadInput").value = String(Math.floor(_auxUserCash / _valorNike));
				debugBws("Entra por RADIO > NIKE - comprar ")	;
				break;
			case "G" :
				document.getElementById("CantidadInput").value = String(Math.floor(_auxUserCash / _valorGatorade));
				debugBws("Entra por RADIO > GATORADE - comprar ")	;
				break;

		}


	} 

	else 

	{

		// vender //

		switch (_radio) {


			case "H" :
				_quienJuegaEmpresa="Jugador"+String(_turnoJugador+1)+"_Heineken";
				debugBws("Entra por RADIO > HEINEKEN - vender ")	;
				break;
			case "M" :
				_quienJuegaEmpresa="Jugador"+String(_turnoJugador+1)+"_McDonalds";
				debugBws("Entra por RADIO > MC DONALDS - vender")	;
				break;
			case "N" :
				_quienJuegaEmpresa="Jugador"+String(_turnoJugador+1)+"_Nike";
				debugBws("Entra por RADIO > NIKE - vender ")	;
				break;
			case "G" :
				_quienJuegaEmpresa="Jugador"+String(_turnoJugador+1)+"_Gatorade";
				debugBws("Entra por RADIO > GATORADE - vender ")	;
				break;

		}

		document.getElementById("CantidadInput").value = Number(format2Num(document.getElementById(_quienJuegaEmpresa).innerHTML));


	}

}
//---------------------------------- Ejecutar Movimientos del Usuario -----------------------//

function ejecutarMovimientosUser() {
    var _estadoCombo; 
    var _valorAccion;
    var _auxUserCash;
    var _auxUserInput;
    var _auxUserAcciones;
    var _empresaNombre;
    
    var _nodoJugadorAccion;
    if (document.getElementById("H_Radio").checked) {
        _nodoJugadorAccion = "Jugador"+String(_turnoJugador+1)+"_Heineken";
        _valorAccion = _valorHeineken;
        _empresaNombre = "Heineken";
    } else if (document.getElementById("G_Radio").checked) {
        _nodoJugadorAccion = "Jugador"+String(_turnoJugador+1)+"_Gatorade";
        _valorAccion = _valorGatorade;
        _empresaNombre = "Gatorade";
    } else if (document.getElementById("M_Radio").checked) {
        _nodoJugadorAccion = "Jugador"+String(_turnoJugador+1)+"_McDonalds";
        _valorAccion = _valorMcDonalds;
        _empresaNombre = "McDonalds";
    } else if (document.getElementById("N_Radio").checked) {
        _nodoJugadorAccion = "Jugador"+String(_turnoJugador+1)+"_Nike";
        _valorAccion = _valorNike;
        _empresaNombre = "Nike";
    }

    _estadoCombo = document.getElementById('ComboBox').value;
    _auxUserCash = Number(format2Num(document.getElementById("Jugador"+String(_turnoJugador+1)+"_Cash").innerHTML));
    _auxUserInput = Number(format2Num(document.getElementById("CantidadInput").value));
    _auxUserAcciones = Number(format2Num(document.getElementById(_nodoJugadorAccion).innerHTML));

    var _operacionRealizada = false;

    if (_estadoCombo == 'C') {
        if (_auxUserInput * _valorAccion <= _auxUserCash) {
            document.getElementById(_nodoJugadorAccion).innerHTML = num2Format(_auxUserAcciones + _auxUserInput);
            document.getElementById("Jugador"+String(_turnoJugador+1)+"_Cash").innerHTML = num2Format((Number(format2Num(document.getElementById("Jugador"+String(_turnoJugador+1)+"_Cash").innerHTML)) - (_auxUserInput * _valorAccion)));
            _operacionRealizada = true;
        }
    } else if (_estadoCombo == 'V') {
        if (_auxUserInput <= _auxUserAcciones) {
            document.getElementById(_nodoJugadorAccion).innerHTML = num2Format(_auxUserAcciones - _auxUserInput);
            document.getElementById("Jugador"+String(_turnoJugador+1)+"_Cash").innerHTML = num2Format((Number(format2Num(document.getElementById("Jugador"+String(_turnoJugador+1)+"_Cash").innerHTML)) + (_auxUserInput * _valorAccion)));
            _operacionRealizada = true;
        }
    }

    if (_operacionRealizada && _nodoJugadorAccion) {
        var _tipoOp = _estadoCombo == 'C' ? 'Compra' : 'Venta';
        var _nombreJugador = _jugadores[_turnoJugador][0];
        socket.emit('registrarTransaccion', {
            jugador: _nombreJugador,
            tipo: _tipoOp,
            empresa: _empresaNombre,
            cantidad: _auxUserInput
        });
    }

    debugBws("Boton : EJECUTAR");
    calcularTotalJugadores();
    document.getElementById("CantidadInput").value = "";
    sincronizarMiPantallaAlServidor();
}

//---------------------------------- Calculo de Totales por jugador ------------------//

function calcularTotalJugadores() {

	debugBws(" Calcular Totales Jugadores ")	;

	var _userTotal ;

	for ( var i=0;i<_jugadores.length; i++) {

		if (_jugadores[i][0]!="Sin Asignar" ) {

			_userTotal = Number(format2Num(document.getElementById("Jugador"+String(i+1)+"_Cash").innerHTML));
			_userTotal = _userTotal + (Number(format2Num(document.getElementById("Jugador"+String(i+1)+"_Heineken").innerHTML) * _valorHeineken ));
			_userTotal = _userTotal + (Number(format2Num(document.getElementById("Jugador"+String(i+1)+"_McDonalds").innerHTML) * _valorMcDonalds ));
			_userTotal = _userTotal + (Number(format2Num(document.getElementById("Jugador"+String(i+1)+"_Nike").innerHTML) * _valorNike ));
			_userTotal = _userTotal + (Number(format2Num(document.getElementById("Jugador"+String(i+1)+"_Gatorade").innerHTML) * _valorGatorade ));

			document.getElementById("Jugador"+String(i+1)+"_Total").innerHTML = num2Format(_userTotal);

			document.getElementById("Jugador"+String(i+1)+"_V_Heineken").innerHTML = num2Format((Number(format2Num(document.getElementById("Jugador"+String(i+1)+"_Heineken").innerHTML)) * _valorHeineken ));
			document.getElementById("Jugador"+String(i+1)+"_V_McDonalds").innerHTML = num2Format((Number(format2Num(document.getElementById("Jugador"+String(i+1)+"_McDonalds").innerHTML)) * _valorMcDonalds ));
			document.getElementById("Jugador"+String(i+1)+"_V_Nike").innerHTML = num2Format((Number(format2Num(document.getElementById("Jugador"+String(i+1)+"_Nike").innerHTML)) * _valorNike ));
			document.getElementById("Jugador"+String(i+1)+"_V_Gatorade").innerHTML = num2Format((Number(format2Num(document.getElementById("Jugador"+String(i+1)+"_Gatorade").innerHTML)) * _valorGatorade ));



		}

	}

		debugBws("Realizo los calculos de todos los jugadores en la lista ")	;


}

//---------------------------------- JUGADA CARTAS DE MASO --------------------------//
function jugadaCartaDelMaso() {
    if (_jugarCartas) {
        var _empresaElegida;
        document.getElementById("Finalizar").style = "background-color : red;";
        document.getElementById("Finalizar").disabled = false;
        _jugarCartas = false;
        if (_valorIndice > 67) {
            document.getElementById('CartaMaso').src = "_imagenes/MasoVacio.png";
            alert("El juego ha finalizado");
            return;
        }
        document.getElementById('CartaJugada').src = cartasMaestro[_valorIndice][2];
        console.log("Emitiendo seJugoCartaDelMaso con índice:", _valorIndice, "carta:", cartasMaestro[_valorIndice]);
        socket.emit('seJugoCartaDelMaso', _valorIndice);
        socket.emit('mostrarCartaEspera', _valorIndice);
        jugarCartasCompletar(true, 0);
    } else {
        alert("El jugador ya jugo su carta y no puede volver a jugar otra hasta su proximo turno ");
    }
}

// ----------------------------------------- terminar jugada de cartas ------------------------------ //

function terminarJugadaCartas(_empresaElegida,_valorIndiceINT) {

debugBws(" Calculo final / Terminar Jugada - sin finalizar  ")	;

// realizo la jugada 

	switch (cartasMaestro[_valorIndiceINT][1]) {

		case "N" :

			switch (cartasMaestro[_valorIndiceINT][0]) {

				case "1000" :

					_valorNike = _valorNike + 1000;
					_valorGatorade = _valorGatorade - 100;
					_valorHeineken = _valorHeineken - 100;
					_valorMcDonalds = _valorMcDonalds - 100;
					break;

				case "600" :

					_valorNike = _valorNike + 600;

					// determinar quein baja por el user

						if (_empresaElegida == "G") {

							_valorGatorade = _valorGatorade - 300;
							document.getElementById("N_Radio").disabled = true;
							document.getElementById("G_Radio").disabled = true;
							break;

						}else if (_empresaElegida == "H") {

							_valorHeineken = _valorHeineken - 300;
							document.getElementById("N_Radio").disabled = true;
							document.getElementById("H_Radio").disabled = true;
							break;

						}else if (_empresaElegida == "M") {

							_valorMcDonalds = _valorMcDonalds - 300;
							document.getElementById("N_Radio").disabled = true;
							document.getElementById("M_Radio").disabled = true;
							break;
						}

					break;
	
				case "500" :

					_valorNike = _valorNike - 500;

						if (_empresaElegida == "G") {

							_valorGatorade = _valorGatorade + 600;
							document.getElementById("N_Radio").disabled = true;
							document.getElementById("G_Radio").disabled = true;
							break;

						}else if (_empresaElegida == "H") {

							_valorHeineken = _valorHeineken + 600;
							document.getElementById("N_Radio").disabled = true;
							document.getElementById("H_Radio").disabled = true;
							break;

						}else if (_empresaElegida == "M") {

							_valorMcDonalds = _valorMcDonalds + 600;
							document.getElementById("N_Radio").disabled = true;
							document.getElementById("M_Radio").disabled = true;
							break;
						}

					break;

	
				case "x2" :

					_valorNike = _valorNike * 2;

						if (_empresaElegida == "G") {

							_valorGatorade = _valorGatorade /2 ;
							document.getElementById("N_Radio").disabled = true;
							document.getElementById("G_Radio").disabled = true;
							break;

						}else if (_empresaElegida == "H") {

							_valorHeineken = _valorHeineken /2;
							document.getElementById("N_Radio").disabled = true;
							document.getElementById("H_Radio").disabled = true;
							break;

						}else if (_empresaElegida == "M") {

							_valorMcDonalds = _valorMcDonalds /2;
							document.getElementById("N_Radio").disabled = true;
							document.getElementById("M_Radio").disabled = true;
							break;
						}

					break;
	
				case "/2" :

					_valorNike = _valorNike /2 ;

						if (_empresaElegida == "G") {

							_valorGatorade = _valorGatorade * 2 ;
							document.getElementById("N_Radio").disabled = true;
							document.getElementById("G_Radio").disabled = true;
							break;

						}else if (_empresaElegida == "H") {

							_valorHeineken = _valorHeineken * 2;
							document.getElementById("N_Radio").disabled = true;
							document.getElementById("H_Radio").disabled = true;
							break;

						}else if (_empresaElegida == "M") {

							_valorMcDonalds = _valorMcDonalds * 2;
							document.getElementById("N_Radio").disabled = true;
							document.getElementById("M_Radio").disabled = true;
							break;
						}

					break;
		
			}
			break;

		case "H" :

			switch (cartasMaestro[_valorIndiceINT][0]) {

				case "1000" :

					_valorNike = _valorNike - 100;
					_valorGatorade = _valorGatorade - 100;
					_valorHeineken = _valorHeineken + 1000;
					_valorMcDonalds = _valorMcDonalds - 100;
					break;

				case "600" :

					_valorHeineken = _valorHeineken + 600;

						if (_empresaElegida == "G") {

							_valorGatorade = _valorGatorade - 300;
							document.getElementById("H_Radio").disabled = true;
							document.getElementById("G_Radio").disabled = true;
							break;

						}else if (_empresaElegida == "N") {

							_valorNike = _valorNike - 300;
							document.getElementById("H_Radio").disabled = true;
							document.getElementById("N_Radio").disabled = true;
							break;

						}else if (_empresaElegida == "M") {

							_valorMcDonalds = _valorMcDonalds - 300;
							document.getElementById("H_Radio").disabled = true;
							document.getElementById("M_Radio").disabled = true;
							break;
						}

					break;
	
				case "500" :

					_valorHeineken = _valorHeineken - 500;

						if (_empresaElegida == "G") {

							_valorGatorade = _valorGatorade + 600;
							document.getElementById("H_Radio").disabled = true;
							document.getElementById("G_Radio").disabled = true;
							break;

						}else if (_empresaElegida == "N") {

							_valorNike = _valorNike + 600;
							document.getElementById("H_Radio").disabled = true;
							document.getElementById("N_Radio").disabled = true;
							break;

						}else if (_empresaElegida == "M") {

							_valorMcDonalds = _valorMcDonalds + 600;
							document.getElementById("H_Radio").disabled = true;
							document.getElementById("M_Radio").disabled = true;
							break;
						}

					break;
	
				case "x2" :

					_valorHeineken = _valorHeineken * 2;

						if (_empresaElegida == "G") {

							_valorGatorade = _valorGatorade /2 ;
							document.getElementById("H_Radio").disabled = true;
							document.getElementById("G_Radio").disabled = true;
							break;

						}else if (_empresaElegida == "N") {

							_valorNike = _valorNike /2;
							document.getElementById("H_Radio").disabled = true;
							document.getElementById("N_Radio").disabled = true;
							break;

						}else if (_empresaElegida == "M") {

							_valorMcDonalds = _valorMcDonalds /2;
							document.getElementById("H_Radio").disabled = true;
							document.getElementById("M_Radio").disabled = true;
							break;
						}

					break;

				case "/2" :

					_valorHeineken = _valorHeineken /2 ;

						if (_empresaElegida == "G") {

							_valorGatorade = _valorGatorade * 2 ;
							document.getElementById("H_Radio").disabled = true;
							document.getElementById("G_Radio").disabled = true;
							break;

						}else if (_empresaElegida == "N") {

							_valorNike = _valorNike * 2;
							document.getElementById("H_Radio").disabled = true;
							document.getElementById("N_Radio").disabled = true;
							break;

						}else if (_empresaElegida == "M") {

							_valorMcDonalds = _valorMcDonalds * 2;
							document.getElementById("H_Radio").disabled = true;
							document.getElementById("M_Radio").disabled = true;
							break;
						}

					break;
	
			}
			break;

		case "G" :

			switch (cartasMaestro[_valorIndiceINT][0]) {

				case "1000" :

					_valorNike = _valorNike - 100;
					_valorGatorade = _valorGatorade + 1000;
					_valorHeineken = _valorHeineken - 100;
					_valorMcDonalds = _valorMcDonalds - 100;
					break;

				case "600" :

					_valorGatorade = _valorGatorade + 600;

						if (_empresaElegida == "H") {

							_valorHeineken = _valorHeineken - 300;
							document.getElementById("G_Radio").disabled = true;
							document.getElementById("H_Radio").disabled = true;
							break;

						}else if (_empresaElegida == "N") {

							_valorNike = _valorNike - 300;
							document.getElementById("G_Radio").disabled = true;
							document.getElementById("N_Radio").disabled = true;
							break;

						}else if (_empresaElegida == "M") {

							_valorMcDonalds = _valorMcDonalds - 300;
							document.getElementById("G_Radio").disabled = true;
							document.getElementById("M_Radio").disabled = true;
							break;
						}

					
					break;
	
				case "500" :

					_valorGatorade = _valorGatorade - 500;

						if (_empresaElegida == "H") {

							_valorHeineken = _valorHeineken + 600;
							document.getElementById("G_Radio").disabled = true;
							document.getElementById("H_Radio").disabled = true;
							break;

						}else if (_empresaElegida == "N") {

							_valorNike = _valorNike + 600;
							document.getElementById("G_Radio").disabled = true;
							document.getElementById("N_Radio").disabled = true;
							break;

						}else if (_empresaElegida == "M") {

							_valorMcDonalds = _valorMcDonalds + 600;
							document.getElementById("G_Radio").disabled = true;
							document.getElementById("M_Radio").disabled = true;
							break;
						}

					break;
	
				case "x2" :

					_valorGatorade = _valorGatorade * 2;

						if (_empresaElegida == "H") {

							_valorHeineken = _valorHeineken /2 ;
							document.getElementById("G_Radio").disabled = true;
							document.getElementById("H_Radio").disabled = true;
							break;

						}else if (_empresaElegida == "N") {

							_valorNike = _valorNike /2;
							document.getElementById("G_Radio").disabled = true;
							document.getElementById("N_Radio").disabled = true;
							break;

						}else if (_empresaElegida == "M") {

							_valorMcDonalds = _valorMcDonalds /2;
							document.getElementById("G_Radio").disabled = true;
							document.getElementById("M_Radio").disabled = true;
							break;
						}
					break;

				case "/2" :

					_valorGatorade = _valorGatorade /2 ;

						if (_empresaElegida == "H") {

							_valorHeineken = _valorHeineken * 2 ;
							document.getElementById("G_Radio").disabled = true;
							document.getElementById("H_Radio").disabled = true;
							break;

						}else if (_empresaElegida == "N") {

							_valorNike = _valorNike * 2;
							document.getElementById("G_Radio").disabled = true;
							document.getElementById("N_Radio").disabled = true;
							break;

						}else if (_empresaElegida == "M") {

							_valorMcDonalds = _valorMcDonalds * 2;
							document.getElementById("G_Radio").disabled = true;
							document.getElementById("M_Radio").disabled = true;
							break;
						}

					break;

			}
			break;

		case "M" :

			switch (cartasMaestro[_valorIndiceINT][0]) {

				case "1000" :

					_valorNike = _valorNike - 100;
					_valorGatorade = _valorGatorade - 100;
					_valorHeineken = _valorHeineken - 100;
					_valorMcDonalds = _valorMcDonalds + 1000;
					break;

				case "600" :

					_valorMcDonalds = _valorMcDonalds + 600;

						if (_empresaElegida == "H") {

							_valorHeineken = _valorHeineken - 300;
							document.getElementById("M_Radio").disabled = true;
							document.getElementById("H_Radio").disabled = true;
							break;

						}else if (_empresaElegida == "N") {

							_valorNike = _valorNike - 300;
							document.getElementById("M_Radio").disabled = true;
							document.getElementById("N_Radio").disabled = true;
							break;

						}else if (_empresaElegida == "G") {

							_valorGatorade = _valorGatorade - 300;
							document.getElementById("M_Radio").disabled = true;
							document.getElementById("G_Radio").disabled = true;
							break;
						}

					break;
		
				case "500" :

					_valorMcDonalds = _valorMcDonalds - 500;

						if (_empresaElegida == "H") {

							_valorHeineken = _valorHeineken + 600;
							document.getElementById("M_Radio").disabled = true;
							document.getElementById("H_Radio").disabled = true;
							break;

						}else if (_empresaElegida == "N") {

							_valorNike = _valorNike + 600;
							document.getElementById("M_Radio").disabled = true;
							document.getElementById("N_Radio").disabled = true;
							break;

						}else if (_empresaElegida == "G") {

							_valorGatorade = _valorGatorade + 600;
							document.getElementById("M_Radio").disabled = true;
							document.getElementById("G_Radio").disabled = true;
							break;
						}

					break;
		
				case "x2" :

					_valorMcDonalds = _valorMcDonalds * 2;

						if (_empresaElegida == "H") {

							_valorHeineken = _valorHeineken /2 ;
							document.getElementById("M_Radio").disabled = true;
							document.getElementById("H_Radio").disabled = true;
							break;

						}else if (_empresaElegida == "N") {

							_valorNike = _valorNike /2;
							document.getElementById("M_Radio").disabled = true;
							document.getElementById("N_Radio").disabled = true;
							break;

						}else if (_empresaElegida == "G") {

							_valorGatorade = _valorGatorade /2;
							document.getElementById("M_Radio").disabled = true;
							document.getElementById("G_Radio").disabled = true;
							break;
						}
					break;

				case "/2" :

					_valorMcDonalds = _valorMcDonalds /2 ;

						if (_empresaElegida == "H") {

							_valorHeineken = _valorHeineken * 2 ;
							document.getElementById("M_Radio").disabled = true;
							document.getElementById("H_Radio").disabled = true;
							break;

						}else if (_empresaElegida == "N") {

							_valorNike = _valorNike * 2;
							document.getElementById("M_Radio").disabled = true;
							document.getElementById("N_Radio").disabled = true;
							break;

						}else if (_empresaElegida == "G") {

							_valorGatorade = _valorGatorade * 2;
							document.getElementById("M_Radio").disabled = true;
							document.getElementById("G_Radio").disabled = true;
							break;
						}

					break;
		
			}
			break;


	}

// redondeos completo personalizado en 50 

	redondeos();

// Calculo de topes ( reventada o quiebres ) *-// 

	topes();

// cambio los elementos en pantalla 


	setCotizacion('ValorHeineken',  _valorHeineken);
	setCotizacion('ValorGatorade',  _valorGatorade);
	setCotizacion('ValorMcDonalds', _valorMcDonalds);
	setCotizacion('ValorNike',      _valorNike);
	
	dibujoGraficaBarras(_valorHeineken,_valorGatorade,_valorNike,_valorMcDonalds);

	// Agrega un elemento mas al array con el valor actual 
	var _auxInterno = _valorIndiceGraficas + 1;

	_logHeineken[_valorIndiceGraficas+1] = _valorHeineken;
	_logGatorade[_valorIndiceGraficas+1] = _valorGatorade;
	_logNike[_valorIndiceGraficas+1] = _valorNike;
	_logMcDonalds[_valorIndiceGraficas+1] = _valorMcDonalds;

	if (_jugadores[0][0] != "Sin Asignar") {
		_logJugador_1[_valorIndiceGraficas+1]=Number(format2Num(document.getElementById("Jugador1_Total").innerHTML));

	}else {
		_logJugador_1[_valorIndiceGraficas+1]=0;


	}

	if (_jugadores[1][0] != "Sin Asignar") {
		_logJugador_2[_valorIndiceGraficas+1]=Number(format2Num(document.getElementById("Jugador2_Total").innerHTML));

	}else {
		_logJugador_2[_valorIndiceGraficas+1]=0;


	}

	if (_jugadores[2][0] != "Sin Asignar") {
		_logJugador_3[_valorIndiceGraficas+1]=Number(format2Num(document.getElementById("Jugador3_Total").innerHTML));

	}else {
		_logJugador_3[_valorIndiceGraficas+1]=0;

	}

	if (_jugadores[3][0] != "Sin Asignar") {
		_logJugador_4[_valorIndiceGraficas+1]=Number(format2Num(document.getElementById("Jugador4_Total").innerHTML));

	}else {
		_logJugador_4[_valorIndiceGraficas+1]=0;


	}

//	_logJugador_1[_valorIndice+1]=Number(format2Num(document.getElementById("Jugador1_Total").innerHTML));
//	_logJugador_2[_valorIndice+1]=Number(format2Num(document.getElementById("Jugador2_Total").innerHTML));
//	_logJugador_3[_valorIndice+1]=Number(format2Num(document.getElementById("Jugador3_Total").innerHTML));
//	_logJugador_4[_valorIndice+1]=Number(format2Num(document.getElementById("Jugador4_Total").innerHTML));

	_logLabels[_valorIndiceGraficas+1]=_auxInterno.toString();


	grafcaLineal();


// ajusto totales de jugador 

	calcularTotalJugadores();

// sincronizcion socket server ... 

	sincronizarMiPantallaAlServidor();	


}

// --------------------------------------------- Boton Finalizar Jugada --------------------------------- //

function finalizarJugada() {
    debugBws(" Boton Finalizar jugada / jugador ");
    // Verificamos si el jugador tiene cash para seguir operando
    if (_jugarCartas === false) {
        var _miCash = Number(format2Num(document.getElementById("Jugador"+String(miAsientoLocal)+"_Cash").innerHTML));
        if (_miCash > 0) {
            var _preciosDisponibles = [];
            if (!document.getElementById("H_Radio").disabled) _preciosDisponibles.push(_valorHeineken);
            if (!document.getElementById("G_Radio").disabled) _preciosDisponibles.push(_valorGatorade);
            if (!document.getElementById("N_Radio").disabled) _preciosDisponibles.push(_valorNike);
            if (!document.getElementById("M_Radio").disabled) _preciosDisponibles.push(_valorMcDonalds);
            var _precioMinimo = Math.min(..._preciosDisponibles);
            if (_miCash >= _precioMinimo) {
                document.getElementById('ModalAdvertenciaFinalizar').style.display = 'flex';
                return;
            }
        }
    }
    _ejecutarFinalizarJugada();
}

function confirmarFinalizar() {
    document.getElementById('ModalAdvertenciaFinalizar').style.display = 'none';
    _ejecutarFinalizarJugada();
}

function _ejecutarFinalizarJugada() {
    debugBws(" Boton Finalizar jugada / jugador ");
    // 1. UI: Deshabilitamos el botón y reseteamos mazo
    document.getElementById("Finalizar").style = "background-color : grey;";
    document.getElementById("Finalizar").disabled = true;
    document.getElementById('CartaMaso').src = "_imagenes/CartaEjemploAtras.png";
    _jugarCartas = true;
    // 2. Lógica de índices de cartas
    if (_jugoDeLaMano == false) {
        _valorIndice = _valorIndice + 1;
    }
    _valorIndiceGraficas = _valorIndiceGraficas + 1; 
    _jugoDeLaMano = false;
    if (_valorIndice > 67) {    
        document.getElementById('CartaMaso').src = "_imagenes/MasoVacio.png";
    }
    document.getElementById('MInteractivoTituloMaso').innerHTML = "Movimientos : " + String(_valorIndice) + "/68";
    // 3. UI: Limpiamos los radios y mostramos cartas
    document.getElementById("M_Radio").disabled = false;
    document.getElementById("G_Radio").disabled = false;
    document.getElementById("H_Radio").disabled = false;
    document.getElementById("N_Radio").disabled = false;
    mostrarCartasJugador();
    saveDataLocalStorage();
    _actualizarGrafica = true;
    sincronizarMiPantallaAlServidor();
    socket.emit('finalizarTurno', {
        indiceActual: _valorIndice,
        indiceGraficas: _valorIndiceGraficas
    });
    console.log("Turno finalizado y enviado al servidor.");
}

// -------------------------------------------------- MOSTRAR CARTAS DEL JUGADOR ---------------------------------------------------- // 

function mostrarCartasJugador() {
    var _miIndice = miAsientoLocal - 1;
    var _auxJ = _miIndice;

    if (_miIndice == 1){
        _auxJ = _auxJ + 3;
    } else if (_miIndice == 2){
        _auxJ = _auxJ + 6;
    } else if (_miIndice == 3){
        _auxJ = _auxJ + 9;
    }

    for (var i = 0; i < 4; i++) {
        if (_jugadores[_miIndice][i+1]) {
            document.getElementById('CartaMaso'+String(i+1)).src = cartasMaestro[_auxJ+i][2];
        } else {
            document.getElementById('CartaMaso'+String(i+1)).src = "_imagenes/CartaEjemploAtras.png";
        }
    }
    document.getElementById("CartaMaso1").disabled = false;
    document.getElementById("CartaMaso2").disabled = false;
    document.getElementById("CartaMaso3").disabled = false;
    document.getElementById("CartaMaso4").disabled = false;
}

// ---------------------------------------------- JUGAR CARTA DE LA MANO ---------------------------------------------------------- //

function jugadaCartaDeLaMano(_CartaElegida) {
    console.log("jugadaCartaDeLaMano llamada con carta:", _CartaElegida, "miIndice:", miAsientoLocal - 1, "_jugarCartas:", _jugarCartas);
 
    var _miIndice = miAsientoLocal - 1;
    if (_valorIndice > 67) {
        document.getElementById('CartaMaso').src = "_imagenes/MasoVacio.png";
        alert("El juego ha finalizado");
    }
    else if (_jugadores[_miIndice][_CartaElegida+1] && _jugarCartas) {
        var _auxJ = _miIndice;
        if (_miIndice == 1){
            _auxJ = _auxJ + 3;
        } else if (_miIndice == 2){
            _auxJ = _auxJ + 6;
        } else if (_miIndice == 3){
            _auxJ = _auxJ + 9;
        }
        var _empresaElegida;
        document.getElementById("Finalizar").style = "background-color : red;";
        document.getElementById("Finalizar").disabled = false;
        document.getElementById('CartaMaso'+String(_CartaElegida+1)).src = "_imagenes/CartaEjemploAtras.png";
        _jugadores[_miIndice][_CartaElegida+1] = false;
        _jugarCartas = false; 
        _jugoDeLaMano = true;
        document.getElementById("CartaMaso1").disabled = true;
        document.getElementById("CartaMaso2").disabled = true;
        document.getElementById("CartaMaso3").disabled = true;
        document.getElementById("CartaMaso4").disabled = true;
        document.getElementById('CartaJugada').src = cartasMaestro[_auxJ+_CartaElegida][2];
        // Avisamos al servidor inmediatamente el estado de cartas de la mano
        socket.emit('actualizarCartasMano', {
            indiceJugador: _miIndice,
            c1: _jugadores[_miIndice][1],
            c2: _jugadores[_miIndice][2],
            c3: _jugadores[_miIndice][3],
            c4: _jugadores[_miIndice][4],
            indiceCarta: _auxJ + _CartaElegida
        });
        // Avisamos a los demas que muestren la carta en espera
        socket.emit('mostrarCartaEspera', _auxJ+_CartaElegida);
        jugarCartasCompletar(false, _auxJ+_CartaElegida);
    } else {
        alert("El jugador ya jugo su carta y no puede volver a jugar otra hasta su proximo turno ");
    }
}

// ================================================================================================================================== //
// ================================================== GRAFICA DE BARRAS ============================================================= //
// ================================================================================================================================== //

function dibujoGraficaBarras(_Heineken, _Gatorade, _Nike, _McDonalds) {
    const myCanvas = document.getElementById("canvasBarras");
    
    // Calcular altura disponible dinámicamente
    const contenedor = document.getElementById('LogoTablero');
    const alturaContenedor = contenedor ? contenedor.offsetHeight : 820;
    const alturaUsada = myCanvas.offsetTop;
    const alturaDisponible = alturaContenedor - alturaUsada;

    myCanvas.width = 362;
    myCanvas.height = alturaDisponible > 100 ? alturaDisponible : 566;
    
    const ctx = myCanvas.getContext("2d");

    const valoresDestino = {
        Heineken: _Heineken,
        Gatorade: _Gatorade,
        Nike: _Nike,
        McDonalds: _McDonalds
    };

    const colores = {
        Heineken:  { top: "#28a745", bottom: "#004d00" },
        Gatorade:  { top: "#adb5bd", bottom: "#343a40" },
        Nike:      { top: "#dc3545", bottom: "#5c0000" },
        McDonalds: { top: "#ffc107", bottom: "#997300" }
    };

    const maxValue = 2500; 
    const padding = 20;
    const widthReal = myCanvas.width - (padding * 2);
    const heightReal = myCanvas.height - (padding * 3); 
    
    const marcas = Object.keys(valoresDestino);
    const gap = 15; 
    const anchoBarra = (widthReal / marcas.length) - gap;

    const duracion = 800; 
    const inicio = performance.now();
    const valoresInicio = { ...estadoPrevioBarras };

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    function drawBarraRedondeada(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x, y + height);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height);
        ctx.closePath();
        ctx.fill();
    }

    function animarFrame(tiempoActual) {
        let progreso = (tiempoActual - inicio) / duracion;
        if (progreso > 1) progreso = 1;

        const pSuavizado = easeOutQuart(progreso);

        // --- FONDO ---
        ctx.fillStyle = "#060a0e";
        ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);

        // --- GRILLA HORIZONTAL cada 100 ---
        const gridSteps = maxValue / 100;
        const gridTop    = padding;
        const gridBottom = myCanvas.height - padding;
        const gridLeft   = padding;
        const gridRight  = myCanvas.width - padding;

        for (let i = 0; i <= gridSteps; i++) {
            const yGrid = gridBottom - (i / gridSteps) * heightReal;

            ctx.beginPath();
            ctx.strokeStyle = i === 0 ? "#2a3a4a" : "#131e2a";
            ctx.lineWidth = i === 0 ? 1.5 : 0.5;
            ctx.setLineDash(i === 0 ? [] : [3, 5]);
            ctx.moveTo(gridLeft, yGrid);
            ctx.lineTo(gridRight, yGrid);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // --- SCAN LINE: línea horizontal que barre de abajo a arriba (solo primeros 400ms) ---
        if (progreso < 0.5) {
            const scanEase = progreso / 0.5; // 0→1 en la primera mitad
            const scanY = gridBottom - (scanEase * heightReal);
            const scanGrad = ctx.createLinearGradient(gridLeft, scanY, gridRight, scanY);
            scanGrad.addColorStop(0,    'rgba(74,158,255,0)');
            scanGrad.addColorStop(0.3,  'rgba(74,158,255,0.12)');
            scanGrad.addColorStop(0.5,  'rgba(74,158,255,0.35)');
            scanGrad.addColorStop(0.7,  'rgba(74,158,255,0.12)');
            scanGrad.addColorStop(1,    'rgba(74,158,255,0)');
            ctx.fillStyle = scanGrad;
            ctx.fillRect(gridLeft, scanY - 2, gridRight - gridLeft, 4);
        }

        // --- BARRAS ---
        let index = 0;
        for (let marca of marcas) {
            const valorCalculado = valoresInicio[marca] + ((valoresDestino[marca] - valoresInicio[marca]) * pSuavizado);
            estadoPrevioBarras[marca] = valorCalculado;

            let altoBarra = (valorCalculado / maxValue) * heightReal;
            if (altoBarra < 2) altoBarra = 2;

            const x = gridLeft + (index * (anchoBarra + gap)) + (gap / 2);
            const y = gridBottom - altoBarra;

            // sombra/glow
            ctx.shadowColor = colores[marca].top;
            ctx.shadowBlur = 14;

            // gradiente de barra
            let gradient = ctx.createLinearGradient(x, y, x, gridBottom);
            gradient.addColorStop(0, colores[marca].top);
            gradient.addColorStop(1, colores[marca].bottom);
            ctx.fillStyle = gradient;
            drawBarraRedondeada(ctx, x, y, anchoBarra, altoBarra, 8);

            // borde sutil superior de la barra
            ctx.shadowBlur = 0;
            ctx.strokeStyle = colores[marca].top;
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.4;
            ctx.beginPath();
            ctx.moveTo(x + 8, y);
            ctx.lineTo(x + anchoBarra - 8, y);
            ctx.stroke();
            ctx.globalAlpha = 1;

            // valor encima de la barra
            ctx.shadowBlur = 0;
            ctx.fillStyle = colores[marca].top;
            ctx.font = "bold 12px 'Share Tech Mono', monospace";
            ctx.textAlign = "center";
            ctx.fillText(Math.round(valorCalculado), x + (anchoBarra / 2), y - 7);

            // --- PARTÍCULA DE DESTELLO en la cima al finalizar la animación ---
            if (progreso >= 1) {
                const cx = x + anchoBarra / 2;
                const cy = y;
                // Corona de destellos (8 rayos)
                for (let r = 0; r < 8; r++) {
                    const angle  = (r / 8) * Math.PI * 2;
                    const len    = 10 + Math.random() * 6;
                    const xEnd   = cx + Math.cos(angle) * len;
                    const yEnd   = cy + Math.sin(angle) * len;
                    ctx.beginPath();
                    ctx.strokeStyle = colores[marca].top;
                    ctx.lineWidth   = 1.2;
                    ctx.globalAlpha = 0.55;
                    ctx.shadowColor = colores[marca].top;
                    ctx.shadowBlur  = 6;
                    ctx.moveTo(cx, cy);
                    ctx.lineTo(xEnd, yEnd);
                    ctx.stroke();
                }
                ctx.globalAlpha = 1;
                ctx.shadowBlur  = 0;
            }

            index++;
        }

        ctx.shadowBlur = 0;

        if (progreso < 1) {
            animacionBarrasReq = requestAnimationFrame(animarFrame);
        }
    }

    if (animacionBarrasReq) cancelAnimationFrame(animacionBarrasReq);
    animacionBarrasReq = requestAnimationFrame(animarFrame);
}

// ================================================================================================================================== //
// ================================================== FIN : GRAFICA DE BARRAS ======================================================= //
// ================================================================================================================================== //


// ================================================================================================================================== //
// ================================================== GRAFICA DE lineas ============================================================= //
// ================================================================================================================================== //

function cambiargraficaLinea() {
	if (_queGraficaVa == "A") {
		_queGraficaVa = "B";
		document.getElementById("TituloGraficas").innerHTML = "Estadisticas Jugadores";
		grafcaLineal();
	}else{

		_queGraficaVa = "A";
		document.getElementById("TituloGraficas").innerHTML = "Estadisticas Empresas";
		grafcaLineal();

	}

}

//-------------------------------------------------- GRAFICAR 

function grafcaLineal() {
    var ctx = document.getElementById("popChart").getContext("2d");
    if (_queGraficaVa == "A") {
        var speedData = {
            labels: _logLabels,
            datasets: [
                {
                    label: "Heineken",
                    data: _logHeineken,
                    lineTension: 0.3,
                    fill: false,
                    borderColor: '#28a745',
                    borderWidth: 2,
                    pointBackgroundColor: '#28a745',
                    pointRadius: 3,
                    pointHoverRadius: 5
                },
                {
                    label: "Gatorade",
                    data: _logGatorade,
                    lineTension: 0.3,
                    fill: false,
                    borderColor: '#adb5bd',
                    borderWidth: 2,
                    pointBackgroundColor: '#adb5bd',
                    pointRadius: 3,
                    pointHoverRadius: 5
                },
                {
                    label: "Nike",
                    data: _logNike,
                    lineTension: 0.3,
                    fill: false,
                    borderColor: '#dc3545',
                    borderWidth: 2,
                    pointBackgroundColor: '#dc3545',
                    pointRadius: 3,
                    pointHoverRadius: 5
                },
                {
                    label: "McDonalds",
                    data: _logMcDonalds,
                    lineTension: 0.3,
                    fill: false,
                    borderColor: '#ffc107',
                    borderWidth: 2,
                    pointBackgroundColor: '#ffc107',
                    pointRadius: 3,
                    pointHoverRadius: 5
                }
            ]
        };
    } else {
        var speedData = {
            labels: _logLabels,
            datasets: [
                {
                    label: _jugadores[0][0],
                    data: _logJugador_1,
                    lineTension: 0.3,
                    fill: false,
                    borderColor: '#4e9af1',
                    borderWidth: 2,
                    pointBackgroundColor: '#4e9af1',
                    pointRadius: 3,
                    pointHoverRadius: 5
                },
                {
                    label: _jugadores[1][0],
                    data: _logJugador_2,
                    lineTension: 0.3,
                    fill: false,
                    borderColor: '#e07b39',
                    borderWidth: 2,
                    pointBackgroundColor: '#e07b39',
                    pointRadius: 3,
                    pointHoverRadius: 5
                },
                {
                    label: _jugadores[2][0],
                    data: _logJugador_3,
                    lineTension: 0.3,
                    fill: false,
                    borderColor: '#adb5bd',
                    borderWidth: 2,
                    pointBackgroundColor: '#adb5bd',
                    pointRadius: 3,
                    pointHoverRadius: 5
                },
                {
                    label: _jugadores[3][0],
                    data: _logJugador_4,
                    lineTension: 0.3,
                    fill: false,
                    borderColor: '#a855f7',
                    borderWidth: 2,
                    pointBackgroundColor: '#a855f7',
                    pointRadius: 3,
                    pointHoverRadius: 5
                }
            ]
        };
    }

    if (_lineChartInstance) {
        _lineChartInstance.destroy();
    }

    _lineChartInstance = new Chart(ctx, {
        type: 'line',
        data: speedData,
        options: {
            responsive: false,
            maintainAspectRatio: false,
            legend: {
                labels: {
                    fontColor: '#ccc',
                    fontSize: 11
                }
            },
            scales: {
                yAxes: [{
                    gridLines: {
                        color: 'rgba(255,255,255,0.05)',
                        zeroLineColor: 'rgba(255,255,255,0.1)'
                    },
                    ticks: {
                        fontColor: '#aaa',
                        fontSize: 10,
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    gridLines: {
                        color: 'rgba(255,255,255,0.05)'
                    },
                    ticks: {
                        fontColor: '#aaa',
                        fontSize: 10
                    }
                }]
            }
        }
    });
}

// ------------------------------------------------------ LOGICA PARA ARRASTRAR EL MODAL --------------------------------------------------//
function hacerDraggable(elementoPrincipal, tirador) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    // El 'tirador' es el título de donde agarramos
    tirador.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // Obtener posición del ratón al inicio
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // Llamar a la función cada vez que el ratón se mueve
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // Calcular nueva posición
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // Setear la nueva posición al elemento
        elementoPrincipal.style.top = (elementoPrincipal.offsetTop - pos2) + "px";
        elementoPrincipal.style.left = (elementoPrincipal.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // Detener el movimiento cuando se suelta el botón
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// ---------  Función para activar/desactivar el bloqueo visual según el turno
function gestionarBloqueoPantalla(turnoActual, listaJugadores) {
    const modal = document.getElementById('ModalEsperaTurno');
    const texto = document.getElementById('TextoTurnoNombre');
    const btnSaltear = document.getElementById('BtnSaltearTurno');

    if (!modal) return;

    const jugadorDeTurno = listaJugadores[turnoActual - 1];

    if (turnoActual === miAsientoLocal) {
        // --- ES MI TURNO ---
        modal.style.display = 'none';
        _jugadorSeleccionado = miAsientoLocal;
        _turnoJugador = miAsientoLocal - 1;

        // Finalizar solo se habilita si ya jugó carta
        if (_jugarCartas) {
            document.getElementById('Finalizar').disabled = true;
            document.getElementById('Finalizar').style = "background-color : grey;";
        } else {
            document.getElementById('Finalizar').disabled = false;
            document.getElementById('Finalizar').style = "background-color : red;";
        }

        document.getElementById('Ejecutar').disabled = false;
        document.getElementById('ComboBox').disabled = false;
        document.getElementById('CantidadInput').disabled = false;
        document.getElementById('H_Radio').disabled = false;
        document.getElementById('G_Radio').disabled = false;
        document.getElementById('N_Radio').disabled = false;
        document.getElementById('M_Radio').disabled = false;

        // Mazo y cartas: solo habilitamos si NO jugó carta todavía
        if (_jugarCartas) {
            document.getElementById('CartaMaso').onclick = function() { jugadaCartaDelMaso(); };
            document.getElementById('CartaMaso').style.cursor = 'pointer';
            document.getElementById('CartaMaso1').onclick = function() { jugadaCartaDeLaMano(0); };
            document.getElementById('CartaMaso2').onclick = function() { jugadaCartaDeLaMano(1); };
            document.getElementById('CartaMaso3').onclick = function() { jugadaCartaDeLaMano(2); };
            document.getElementById('CartaMaso4').onclick = function() { jugadaCartaDeLaMano(3); };
            document.getElementById('CartaMaso1').style.cursor = 'pointer';
            document.getElementById('CartaMaso2').style.cursor = 'pointer';
            document.getElementById('CartaMaso3').style.cursor = 'pointer';
            document.getElementById('CartaMaso4').style.cursor = 'pointer';
        } else {
            document.getElementById('CartaMaso').onclick = null;
            document.getElementById('CartaMaso').style.cursor = 'not-allowed';
            document.getElementById('CartaMaso1').onclick = null;
            document.getElementById('CartaMaso2').onclick = null;
            document.getElementById('CartaMaso3').onclick = null;
            document.getElementById('CartaMaso4').onclick = null;
            document.getElementById('CartaMaso1').style.cursor = 'not-allowed';
            document.getElementById('CartaMaso2').style.cursor = 'not-allowed';
            document.getElementById('CartaMaso3').style.cursor = 'not-allowed';
            document.getElementById('CartaMaso4').style.cursor = 'not-allowed';
        }

    } else {
        // --- NO ES MI TURNO ---
        modal.style.display = 'flex';

        // Asignamos onclick del botón SALTEAR siempre que no es mi turno
        if (btnSaltear) {
            btnSaltear.onclick = function() {
                ejecutarSalteoPorDesconexion();
            };
        }

        // Deshabilitamos botones
        document.getElementById('Finalizar').disabled = true;
        document.getElementById('Ejecutar').disabled = true;
        document.getElementById('ComboBox').disabled = true;
        document.getElementById('CantidadInput').disabled = true;
        document.getElementById('H_Radio').disabled = true;
        document.getElementById('G_Radio').disabled = true;
        document.getElementById('N_Radio').disabled = true;
        document.getElementById('M_Radio').disabled = true;

        // Bloqueamos cartas
        document.getElementById('CartaMaso').onclick = null;
        document.getElementById('CartaMaso').style.cursor = 'not-allowed';
        document.getElementById('CartaMaso1').onclick = null;
        document.getElementById('CartaMaso2').onclick = null;
        document.getElementById('CartaMaso3').onclick = null;
        document.getElementById('CartaMaso4').onclick = null;
        document.getElementById('CartaMaso1').style.cursor = 'not-allowed';
        document.getElementById('CartaMaso2').style.cursor = 'not-allowed';
        document.getElementById('CartaMaso3').style.cursor = 'not-allowed';
        document.getElementById('CartaMaso4').style.cursor = 'not-allowed';

        if (jugadorDeTurno && texto) {
            texto.innerHTML = jugadorDeTurno.nombre.toUpperCase();

            if (btnSaltear) {
                if (jugadorDeTurno.socketId === null) {
                    btnSaltear.disabled = false;
                    btnSaltear.style.backgroundColor = "#89152b";
                    btnSaltear.style.color = "white";
                    btnSaltear.style.borderColor = "#89152b";
                    btnSaltear.style.cursor = "pointer";
                } else {
                    btnSaltear.disabled = true;
                    btnSaltear.style.backgroundColor = "#1a1a1a";
                    btnSaltear.style.color = "#444";
                    btnSaltear.style.borderColor = "#333";
                    btnSaltear.style.cursor = "not-allowed";
                }
            }
        }
    }
}
//------------ Función para saltear a un jugador desconectado o que agotó su tiempo
function ejecutarSalteoPorDesconexion() {
    console.log("Iniciando salteo de jugador...");
    if (!_cartaJugadaServidor) {
        console.log("Salteo: forzando carta del mazo...");
        document.getElementById("Finalizar").style = "background-color : red;";
        document.getElementById("Finalizar").disabled = false;
        _jugarCartas = false;
        if (_valorIndice > 67) {
            document.getElementById('CartaMaso').src = "_imagenes/MasoVacio.png";
            alert("El juego ha finalizado");
            return;
        }
        document.getElementById('CartaJugada').src = cartasMaestro[_valorIndice][2];
        if (cartasMaestro[_valorIndice][0] == "1000") {
            socket.emit('seJugoCartaDelMaso', _valorIndice);
            jugarCartasCompletar(true, 0);
            return;
        }
        var empresaCarta = cartasMaestro[_valorIndice][1];
        var empresasDisponibles = ["H", "G", "N", "M"].filter(e => e !== empresaCarta);
        var empresaForzada = empresasDisponibles[0];
        socket.emit('seJugoCartaDelMaso', _valorIndice);
        terminarJugadaCartas(empresaForzada, _valorIndice);
        _ejecutarFinalizarJugada();
    } else {
        console.log("Salteo: jugador ya sacó carta, solo finalizando...");
        _ejecutarFinalizarJugada();
    }
    console.log("Salteo ejecutado correctamente.");
}
//-------------------- Función para iniciar y controlar el temporizador de 5 minutos

function iniciarTimerTurno() {
    // 1. Limpiamos cualquier timer anterior para evitar que el reloj corra doble
    if (typeof timerTurno !== 'undefined' && timerTurno !== null) {
        clearInterval(timerTurno);
    }
    let tiempoRestante = 5; // 5 segundos para pruebas
    const display = document.getElementById('TemporizadorTurno');
    // 2. Seteo inicial inmediato (Evita que se vea el tiempo del turno anterior)
    if (display) {
        display.innerHTML = "00:05";
    }
    timerTurno = setInterval(function () {
        if (!display) {
            clearInterval(timerTurno);
            return; 
        }
        let minutos = parseInt(tiempoRestante / 60, 10);
        let segundos = parseInt(tiempoRestante % 60, 10);
        minutos = minutos < 10 ? "0" + minutos : minutos;
        segundos = segundos < 10 ? "0" + segundos : segundos;
        display.innerHTML = minutos + ":" + segundos;
        // 3. Control de fin de tiempo
        if (--tiempoRestante < 0) {
            clearInterval(timerTurno);
            console.log("Tiempo agotado para el jugador actual.");
            // Solo habilitamos el botón SALTEAR para todos — no ejecutamos nada
            const btnSaltear = document.getElementById('BtnSaltearTurno');
            if (btnSaltear) {
                btnSaltear.disabled = false;
                btnSaltear.style.backgroundColor = "#89152b";
                btnSaltear.style.color = "white";
                btnSaltear.style.borderColor = "#89152b";
                btnSaltear.style.cursor = "pointer";
            }
        }
    }, 1000);
}

//--------------------------------------------------------------

function sincronizarMiPantallaAlServidor() {
    // REINTEGRADA: Necesitamos el índice (0-3) basado en el asiento (1-4)
    var _miIndice = miAsientoLocal - 1; 
    
    var datosParaEnviar = {
        precios: {
            heineken:  _valorHeineken,
            gatorade:  _valorGatorade,
            nike:      _valorNike,
            mcdonalds: _valorMcDonalds
        },
        entorno: {
            IndiceJuego:   _valorIndice,
            TurnoJugador:  _turnoJugador,
            cartaJugada:   !_jugarCartas
        },
        jugadores: [],
        logEmpresas: {
            heineken:  _logHeineken,
            gatorade:  _logGatorade,
            nike:      _logNike,
            mcdonalds: _logMcDonalds,
            labels:    _logLabels
        },
        logJugadores: {
            j1: _logJugador_1,
            j2: _logJugador_2,
            j3: _logJugador_3,
            j4: _logJugador_4
        }
    };

    // Ahora el jugador que tiene el turno envía la información de TODOS
    for (var i = 0; i < 4; i++) {
        var jugador = { 
            nombre: _jugadores[i][0],
            // Extraemos los valores del HTML que topes() ya actualizó para todos
            cash:   Number(format2Num(document.getElementById("Jugador"+String(i+1)+"_Cash").innerHTML)),
            h:      Number(format2Num(document.getElementById("Jugador"+String(i+1)+"_Heineken").innerHTML)),
            g:      Number(format2Num(document.getElementById("Jugador"+String(i+1)+"_Gatorade").innerHTML)),
            n:      Number(format2Num(document.getElementById("Jugador"+String(i+1)+"_Nike").innerHTML)),
            m:      Number(format2Num(document.getElementById("Jugador"+String(i+1)+"_McDonalds").innerHTML)),
            // Mantenemos las cartas que ya estaban en el array local
            c1:     _jugadores[i][1],
            c2:     _jugadores[i][2],
            c3:     _jugadores[i][3],
            c4:     _jugadores[i][4]
        };
        datosParaEnviar.jugadores.push(jugador);
    }

    socket.emit('enviarJugadaAlServidor', datosParaEnviar);
    console.log("Sincronización completa enviada por índice:", _miIndice);
}

// ----------------------- log historial 
function abrirHistorial() {
    var contenido = document.getElementById('ContenidoHistorial');
    contenido.innerHTML = '';

    if (_historialTransacciones.length === 0) {
        contenido.innerHTML = '<p style="color:#4a9eff; text-align:center; margin-top:30px; font-size:13px; font-family:\'Rajdhani\',sans-serif; letter-spacing:2px;">SIN TRANSACCIONES AÚN.</p>';
        document.getElementById('ModalHistorial').style.display = 'flex';
        return;
    }

    // Orden descendente — últimas operaciones primero
    var historialInvertido = _historialTransacciones.slice().reverse();

    historialInvertido.forEach(function(item) {
        if (item.tipo === 'separador') {
            contenido.innerHTML += '<hr style="border:none; border-top:1px solid #1a1a1a; margin:6px 0;">';
        } else if (item.tipo === 'carta') {
            var empresas = { 'H': 'Heineken', 'G': 'Gatorade', 'N': 'Nike', 'M': 'McDonalds' };
            var principal = empresas[item.empresaPrincipal] || item.empresaPrincipal;
            var elegida = empresas[item.empresaElegida] || item.empresaElegida;
            var descripcion = '';
            switch (item.carta) {
                case '1000': descripcion = principal + ' +1000 / resto -100'; break;
                case '600':  descripcion = principal + ' +600 / ' + elegida + ' -300'; break;
                case '500':  descripcion = principal + ' -500 / ' + elegida + ' +600'; break;
                case 'x2':   descripcion = principal + ' x2 / ' + elegida + ' /2'; break;
                case '/2':   descripcion = principal + ' /2 / ' + elegida + ' x2'; break;
            }
            contenido.innerHTML += '<p style="margin:4px 0; padding:7px 12px; background:#0d0d0d; border-left:3px solid #ffc107; border-radius:4px; font-size:18px; color:#8ca0b8;"><b style="color:#ffc107;">' + item.jugador + '</b> · CARTA [' + item.origen + '] → ' + descripcion + '</p>';
        } else {
            var colorBorde = item.tipo === 'Compra' ? '#28a745' : '#dc3545';
            var colorTipo  = item.tipo === 'Compra' ? '#28a745' : '#dc3545';
            contenido.innerHTML += '<p style="margin:4px 0; padding:7px 12px; background:#0d0d0d; border-left:3px solid ' + colorBorde + '; border-radius:4px; font-size:18px; color:#8ca0b8;"><b style="color:#ffc107;">' + item.jugador + '</b> · <b style="color:' + colorTipo + ';">' + item.tipo + '</b> → ' + item.empresa + ' <b style="color:#ffffff;">' + item.cantidad + '</b> acciones</p>';
        }
    });

    document.getElementById('ModalHistorial').style.display = 'flex';
}

// -------------------- drop down personalizado 

function toggleComboBox() {
    var opciones = document.getElementById('ComboBoxOptions');
    opciones.style.display = opciones.style.display === 'none' ? 'block' : 'none';
}

function seleccionarCombo(valor, texto) {
    document.getElementById('ComboBox').value = valor;
    document.getElementById('ComboBoxSelected').innerHTML = texto + ' ▾';
    document.getElementById('ComboBoxOptions').style.display = 'none';
    limpiarValoresInput();
}
function cerrarHistorial() {
    document.getElementById('ModalHistorial').style.display = 'none';
}