// ============================================================
// BWS - MODO TABLERO  (sin socket, todo local)
// ============================================================

// ---- MAZO ----
var cartasMaestroTablero = [
    ['x2','H',"_imagenes/_cartas/HeinekenX2.png"],['x2','H',"_imagenes/_cartas/HeinekenX2.png"],['x2','H',"_imagenes/_cartas/HeinekenX2.png"],
    ['/2','H',"_imagenes/_cartas/HeinekenDIV2.png"],['/2','H',"_imagenes/_cartas/HeinekenDIV2.png"],['/2','H',"_imagenes/_cartas/HeinekenDIV2.png"],
    ['600','H',"_imagenes/_cartas/Heineken600.png"],['600','H',"_imagenes/_cartas/Heineken600.png"],['600','H',"_imagenes/_cartas/Heineken600.png"],['600','H',"_imagenes/_cartas/Heineken600.png"],
    ['500','H',"_imagenes/_cartas/Heineken500.png"],['500','H',"_imagenes/_cartas/Heineken500.png"],['500','H',"_imagenes/_cartas/Heineken500.png"],['500','H',"_imagenes/_cartas/Heineken500.png"],
    ['1000','H',"_imagenes/_cartas/Heineken1000.png"],['1000','H',"_imagenes/_cartas/Heineken1000.png"],['1000','H',"_imagenes/_cartas/Heineken1000.png"],
    ['x2','G',"_imagenes/_cartas/GatoradeX2.png"],['x2','G',"_imagenes/_cartas/GatoradeX2.png"],['x2','G',"_imagenes/_cartas/GatoradeX2.png"],
    ['/2','G',"_imagenes/_cartas/GatoradeDIV2.png"],['/2','G',"_imagenes/_cartas/GatoradeDIV2.png"],['/2','G',"_imagenes/_cartas/GatoradeDIV2.png"],
    ['600','G',"_imagenes/_cartas/Gatorade600.png"],['600','G',"_imagenes/_cartas/Gatorade600.png"],['600','G',"_imagenes/_cartas/Gatorade600.png"],['600','G',"_imagenes/_cartas/Gatorade600.png"],
    ['500','G',"_imagenes/_cartas/Gatorade500.png"],['500','G',"_imagenes/_cartas/Gatorade500.png"],['500','G',"_imagenes/_cartas/Gatorade500.png"],['500','G',"_imagenes/_cartas/Gatorade500.png"],
    ['1000','G',"_imagenes/_cartas/Gatorade1000.png"],['1000','G',"_imagenes/_cartas/Gatorade1000.png"],['1000','G',"_imagenes/_cartas/Gatorade1000.png"],
    ['x2','M',"_imagenes/_cartas/McDonaldsX2.png"],['x2','M',"_imagenes/_cartas/McDonaldsX2.png"],['x2','M',"_imagenes/_cartas/McDonaldsX2.png"],
    ['/2','M',"_imagenes/_cartas/McDonaldsDIV2.png"],['/2','M',"_imagenes/_cartas/McDonaldsDIV2.png"],['/2','M',"_imagenes/_cartas/McDonaldsDIV2.png"],
    ['600','M',"_imagenes/_cartas/McDonalds600.png"],['600','M',"_imagenes/_cartas/McDonalds600.png"],['600','M',"_imagenes/_cartas/McDonalds600.png"],['600','M',"_imagenes/_cartas/McDonalds600.png"],
    ['500','M',"_imagenes/_cartas/McDonalds500.png"],['500','M',"_imagenes/_cartas/McDonalds500.png"],['500','M',"_imagenes/_cartas/McDonalds500.png"],['500','M',"_imagenes/_cartas/McDonalds500.png"],
    ['1000','M',"_imagenes/_cartas/McDonalds1000.png"],['1000','M',"_imagenes/_cartas/McDonalds1000.png"],['1000','M',"_imagenes/_cartas/McDonalds1000.png"],
    ['x2','N',"_imagenes/_cartas/NikeX2.png"],['x2','N',"_imagenes/_cartas/NikeX2.png"],['x2','N',"_imagenes/_cartas/NikeX2.png"],
    ['/2','N',"_imagenes/_cartas/NikeDIV2.png"],['/2','N',"_imagenes/_cartas/NikeDIV2.png"],['/2','N',"_imagenes/_cartas/NikeDIV2.png"],
    ['600','N',"_imagenes/_cartas/Nike600.png"],['600','N',"_imagenes/_cartas/Nike600.png"],['600','N',"_imagenes/_cartas/Nike600.png"],['600','N',"_imagenes/_cartas/Nike600.png"],
    ['500','N',"_imagenes/_cartas/Nike500.png"],['500','N',"_imagenes/_cartas/Nike500.png"],['500','N',"_imagenes/_cartas/Nike500.png"],['500','N',"_imagenes/_cartas/Nike500.png"],
    ['1000','N',"_imagenes/_cartas/Nike1000.png"],['1000','N',"_imagenes/_cartas/Nike1000.png"],['1000','N',"_imagenes/_cartas/Nike1000.png"]
];

// ---- VARIABLES GLOBALES ----
var _jugadores          = [["Sin Asignar",true,true,true,true],["Sin Asignar",true,true,true,true],["Sin Asignar",true,true,true,true],["Sin Asignar",true,true,true,true]];
var _valorIndice        = 0;
var _turnoJugador       = 0;
var _jugarCartas        = true;
var _jugoDeLaMano       = false;
var _valorIndiceGraficas= 0;
var _gameOver           = false;
var _valorHeineken      = 1000;
var _valorNike          = 1000;
var _valorMcDonalds     = 1000;
var _valorGatorade      = 1000;
var _logHeineken        = [1000];
var _logGatorade        = [1000];
var _logNike            = [1000];
var _logMcDonalds       = [1000];
var _logLabels          = ["0"];
var _logJugador_1       = [4000];
var _logJugador_2       = [4000];
var _logJugador_3       = [4000];
var _logJugador_4       = [4000];
var _ultimaDireccion    = { heineken:0, gatorade:0, nike:0, mcdonalds:0 };
var _prevCotizaciones   = { ValorHeineken:1000, ValorGatorade:1000, ValorNike:1000, ValorMcDonalds:1000 };
var _lineChartInstance  = null;
var _actualizarGrafica  = false;
var _queGraficaVa       = "A";
var _historialTransacciones = [];
var estadoPrevioBarras  = { Heineken:0, Gatorade:0, Nike:0, McDonalds:0 };
var animacionBarrasReq  = null;
var _beepInterval       = null;
var _beepAudioContext   = null;
var cartasMaestro       = [];
var timerTurno          = null;
var _misCartasURLs      = []; // array de arrays: _misCartasURLs[posActivo][0..3]
var _graficaLineaEmpresasCanvas = null;
var _cartaManoConfirmCallback = null;
var _tuTurnoTimeout     = null;

// ============================================================
// MAZO
// ============================================================
function entreverarMazo(array) {
    for (var i = array.length-1; i > 0; i--) {
        var j = Math.floor(Math.random()*(i+1));
        var t = array[i]; array[i]=array[j]; array[j]=t;
    }
    return array;
}

// ============================================================
// AUDIO
// ============================================================
var _audioDesbloqueado = false;
function _desbloquearAudio() {
    if (_audioDesbloqueado) return;
    _audioDesbloqueado = true;
    ['audioModalBackend','audioModalCartas','audioAbrirModal','audioCerrarModal','audioTuTurnoModal'].forEach(function(id) {
        var el = document.getElementById(id);
        if (!el) return;
        el.volume = 0;
        var p = el.play();
        if (p && p.then) p.then(function(){ el.pause(); el.currentTime=0; el.volume=1; }).catch(function(){ el.volume=1; });
        else { el.pause(); el.currentTime=0; el.volume=1; }
    });
}
function reproducirAudio(id) {
    var el = document.getElementById(id);
    if (!el) return;
    try { el.currentTime=0; var p=el.play(); if (p&&p.then) p.catch(function(){}); } catch(e) {}
}
document.addEventListener('click',   _desbloquearAudio, {once:false});
document.addEventListener('keydown',  _desbloquearAudio, {once:false});

// ============================================================
// SPLASH SCREEN — no existe en tablero, arranca directo
// ============================================================
var _splashSuperado = true; // siempre true en tablero

document.addEventListener('DOMContentLoaded', function() {
    _graficaLineaEmpresasCanvas = document.getElementById('popChart');
    var btnConfirmar = document.getElementById('BtnConfirmarCartaMano');
    var btnCancelar  = document.getElementById('BtnCancelarCartaMano');
    if (btnConfirmar) btnConfirmar.addEventListener('click', function(){ cerrarModalConfirmarCarta(true); });
    if (btnCancelar)  btnCancelar.addEventListener('click',  function(){ cerrarModalConfirmarCarta(false); });
    var btnNextGame = document.getElementById('BtnNextGame');
    if (btnNextGame) btnNextGame.addEventListener('click', function(){ window.location.href='/'; });
    // Arrancar directo sin splash
    _desbloquearAudio();
    _iniciarTablero();
});

// ============================================================
// INICIO TABLERO — lee sessionStorage
// ============================================================
function _iniciarTablero() {
    var nombresRaw = sessionStorage.getItem('bws_tablero_nombres');
    if (!nombresRaw) { window.location.href='/'; return; }
    var nombres = JSON.parse(nombresRaw);
    var forzarOrden = sessionStorage.getItem('bws_tablero_forzarOrden') === 'true';

    // Asignar nombres
    for (var i=0; i<nombres.length && i<4; i++) _jugadores[i][0] = nombres[i];

    // Reordenar si corresponde
    if (!forzarOrden && nombres.length > 1) {
        var activos = [];
        for (var i=0; i<4; i++) { if (_jugadores[i][0]!=='Sin Asignar') activos.push(i); }
        var jugActivos = activos.map(function(idx){ return _jugadores[idx]; });
        for (var i=jugActivos.length-1; i>0; i--) {
            var j=Math.floor(Math.random()*(i+1));
            var t=jugActivos[i]; jugActivos[i]=jugActivos[j]; jugActivos[j]=t;
        }
        for (var i=0; i<activos.length; i++) _jugadores[activos[i]] = jugActivos[i];
    }

    // Mezclar mazo y repartir cartas sin votación
    cartasMaestro = entreverarMazo([].concat(cartasMaestroTablero));
    var jugActivos2 = [];
    for (var i=0; i<4; i++) { if (_jugadores[i][0]!=='Sin Asignar') jugActivos2.push(i); }
    _misCartasURLs = [];
    for (var i=0; i<jugActivos2.length; i++) {
        var offset = i*4;
        _misCartasURLs[i] = [ cartasMaestro[offset][2], cartasMaestro[offset+1][2], cartasMaestro[offset+2][2], cartasMaestro[offset+3][2] ];
    }
    _valorIndice = jugActivos2.length * 4;

    // Ocultar preloader si está visible
    var pre = document.getElementById('preloader');
    if (pre) pre.style.display='none';
    var cont = document.getElementById('ContenedorGeneral');
    if (cont) { cont.style.display='block'; redimensionarJuego(); }

    _renderizarTablero();
    mostrarCartasJugadorActual();
    iniciarTimerTurno();
    mostrarModalTurno(_jugadores[_turnoJugador][0]);
    reproducirAudio('audioModalBackend');
}

// ============================================================
// RENDERIZAR TABLERO
// ============================================================
function _renderizarTablero() {
    for (var i=0; i<4; i++) {
        var num = i+1;
        if (_jugadores[i][0] !== 'Sin Asignar') {
            document.getElementById('Jugador'+num+'_Nombre').innerHTML   = _jugadores[i][0];
            document.getElementById('Jugador'+num+'_V_Nombre').innerHTML = _jugadores[i][0];
            document.getElementById('Jugador'+num+'_Cash').innerHTML     = '0';
            document.getElementById('Jugador'+num+'_Heineken').innerHTML = '1';
            document.getElementById('Jugador'+num+'_Gatorade').innerHTML = '1';
            document.getElementById('Jugador'+num+'_Nike').innerHTML     = '1';
            document.getElementById('Jugador'+num+'_McDonalds').innerHTML= '1';
            document.getElementById('Jugador'+num+'_Total').innerHTML    = num2Format(4000);
        } else {
            ['Cash','Heineken','Gatorade','Nike','McDonalds','Total'].forEach(function(f){
                document.getElementById('Jugador'+num+'_'+f).innerHTML='';
            });
        }
    }
    setCotizacion('ValorHeineken',  _valorHeineken);
    setCotizacion('ValorGatorade',  _valorGatorade);
    setCotizacion('ValorMcDonalds', _valorMcDonalds);
    setCotizacion('ValorNike',      _valorNike);
    document.getElementById('TurnoJugador').innerHTML = _jugadores[_turnoJugador][0];
    document.getElementById('MInteractivoTituloMaso').innerHTML = 'Movimientos : '+_valorIndice+'/68';
    // Ocultar elementos innecesarios en tablero
    var btnSaltear = document.getElementById('BtnSaltearTurno');
    if (btnSaltear) btnSaltear.style.display='none';
    var modalEsperaTurno = document.getElementById('ModalEsperaTurno');
    if (modalEsperaTurno) modalEsperaTurno.style.display='none';
    dibujoGraficaBarras(_valorHeineken,_valorGatorade,_valorNike,_valorMcDonalds);
    grafcaLineal();
    calcularTotalJugadores();
    actualizarIndicadoresCartas();
    _marcarTurnoUI();
    _habilitarControles();
}

function _marcarTurnoUI() {
    for (var i=1; i<=4; i++) {
        document.getElementById('Jugador'+i+'_Linea').style   = 'border-style:none;';
        document.getElementById('Jugador'+i+'_V_Linea').style = 'border-style:none;';
    }
    document.getElementById('Jugador'+(_turnoJugador+1)+'_Linea').style   = 'border-style:solid; border-color:red; border-width:2px;';
    document.getElementById('Jugador'+(_turnoJugador+1)+'_V_Linea').style = 'border-style:solid; border-color:red; border-width:2px;';
}

function _habilitarControles() {
    document.getElementById('Finalizar').disabled    = _jugarCartas;
    document.getElementById('Finalizar').style       = _jugarCartas ? 'background-color:grey;' : 'background-color:red;';
    document.getElementById('Ejecutar').disabled     = false;
    document.getElementById('ComboBox').disabled     = false;
    document.getElementById('CantidadInput').disabled= false;
    ['H_Radio','G_Radio','N_Radio','M_Radio'].forEach(function(id){ document.getElementById(id).disabled=false; });
    document.getElementById('CartaMaso').onclick      = function(){ jugadaCartaDelMaso(); };
    document.getElementById('CartaMaso').style.cursor = 'pointer';
    for (var c=1; c<=4; c++) {
        document.getElementById('CartaMaso'+c).style.cursor = 'pointer';
    }
}

// ============================================================
// CARTAS DEL JUGADOR ACTIVO
// ============================================================
function mostrarCartasJugadorActual() {
    // Calcular posición en activos del jugador de turno
    var posActivo = 0;
    for (var i=0; i<_turnoJugador; i++) { if (_jugadores[i][0]!=='Sin Asignar') posActivo++; }
    var urls = _misCartasURLs[posActivo] || [];
    for (var c=0; c<4; c++) {
        var el = document.getElementById('CartaMaso'+(c+1));
        if (!el) continue;
        el.src = (_jugadores[_turnoJugador][c+1] && urls[c]) ? urls[c] : '_imagenes/CartaEjemploAtras.png';
    }
}

// ============================================================
// MODAL TURNO (muestra nombre del jugador)
// ============================================================
function mostrarModalTurno(nombreJugador) {
    var modal    = document.getElementById('ModalTuTurno');
    var interior = document.getElementById('ModalTuTurnoInterior');
    var texto    = document.getElementById('ModalTuTurnoTexto');
    if (!modal || !interior) return;
    if (_tuTurnoTimeout) { clearTimeout(_tuTurnoTimeout); _tuTurnoTimeout=null; }
    if (texto) texto.innerHTML = nombreJugador.toUpperCase();
    interior.classList.remove('entrando','saliendo');
    void interior.offsetWidth;
    interior.classList.add('entrando');
    modal.style.display='flex';
    modal.style.pointerEvents='all';
    reproducirAudio('audioTuTurnoModal');
    function cerrar() { quitarL(); _cerrarModalTurno(); }
    function quitarL() { document.removeEventListener('mousemove',cerrar); document.removeEventListener('keydown',cerrar); }
    setTimeout(function(){ document.addEventListener('mousemove',cerrar); document.addEventListener('keydown',cerrar); }, 400);
}
function _cerrarModalTurno() {
    var modal=document.getElementById('ModalTuTurno'), interior=document.getElementById('ModalTuTurnoInterior');
    if (!modal||!interior) return;
    modal.style.pointerEvents='none';
    interior.classList.remove('entrando'); void interior.offsetWidth; interior.classList.add('saliendo');
    interior.addEventListener('animationend', function h(){ interior.removeEventListener('animationend',h); modal.style.display='none'; interior.classList.remove('saliendo'); });
}

// ============================================================
// AVANZAR TURNO
// ============================================================
function avanzarTurno() {
    var proximo = _turnoJugador;
    var encontrado = false;
    while (!encontrado) {
        proximo++; if (proximo>3) proximo=0;
        if (_jugadores[proximo][0]!=='Sin Asignar') encontrado=true;
    }
    _turnoJugador   = proximo;
    _jugarCartas    = true;
    _jugoDeLaMano   = false;
    document.getElementById('CartaMaso').src = '_imagenes/CartaEjemploAtras.png';
    document.getElementById('TurnoJugador').innerHTML = _jugadores[_turnoJugador][0];
    document.getElementById('MInteractivoTituloMaso').innerHTML = 'Movimientos : '+_valorIndice+'/68';
    ['M_Radio','G_Radio','H_Radio','N_Radio'].forEach(function(id){ document.getElementById(id).disabled=false; });
    limpiarValoresInput();
    _marcarTurnoUI();
    _habilitarControles();
    mostrarCartasJugadorActual();
    actualizarIndicadoresCartas();
    iniciarTimerTurno();
    detenerBlinkYBeep();
    mostrarModalTurno(_jugadores[_turnoJugador][0]);
}

// ============================================================
// TIMER DE TURNO (5 minutos, sin saltear en tablero)
// ============================================================
function iniciarTimerTurno() {
    if (timerTurno) clearInterval(timerTurno);
    var tiempoRestante = 300;
    var display = document.getElementById('TemporizadorTurno');
    if (display) display.innerHTML='05:00';
    timerTurno = setInterval(function() {
        if (!display) { clearInterval(timerTurno); return; }
        var min = parseInt(tiempoRestante/60,10);
        var seg = parseInt(tiempoRestante%60,10);
        display.innerHTML = (min<10?'0':'')+min+':'+(seg<10?'0':'')+seg;
        if (--tiempoRestante < 0) clearInterval(timerTurno);
    }, 1000);
}

// ============================================================
// UTILIDADES
// ============================================================
function num2Format(_num) {
    if (_num > 0) {
        var num2=_num.toString().split('.');
        var thousands=num2[0].split('').reverse().join('').match(/.{1,3}/g).join(',');
        var decimals=(num2[1])?'.'+num2[1]:'';
        return thousands.split('').reverse().join('')+decimals;
    }
    return _num.toString();
}
function format2Num(_numCon) { return parseFloat(_numCon.replace(/,/g,'')); }
function debugBws() {}

function limpiarValoresInput() {
    ['H_Radio','G_Radio','M_Radio','N_Radio'].forEach(function(id){ document.getElementById(id).checked=false; });
    document.getElementById('CantidadInput').value='0';
}
function toggleComboBox() {
    var o=document.getElementById('ComboBoxOptions');
    o.style.display = o.style.display==='none'?'block':'none';
}
function seleccionarCombo(valor,texto) {
    document.getElementById('ComboBox').value=valor;
    document.getElementById('ComboBoxSelected').innerHTML=texto+' ▾';
    document.getElementById('ComboBoxOptions').style.display='none';
    limpiarValoresInput();
}
function actualizarIndicadoresCartas() {
    for (var i=0; i<4; i++) {
        for (var c=1; c<=4; c++) {
            var el=document.getElementById('J'+(i+1)+'_C'+c);
            if (el) el.style.background=_jugadores[i][c]?'#89152b':'#444';
        }
    }
}
function hacerDraggable(elementoPrincipal, tirador) {
    var pos1=0,pos2=0,pos3=0,pos4=0;
    tirador.onmousedown = function(e) {
        e=e||window.event; e.preventDefault();
        pos3=e.clientX; pos4=e.clientY;
        document.onmouseup   = function(){ document.onmouseup=null; document.onmousemove=null; };
        document.onmousemove = function(e) {
            e=e||window.event; e.preventDefault();
            var contenedor=document.getElementById('ContenedorGeneral');
            var escala=1;
            if (contenedor) { var m=contenedor.style.transform.match(/scale\(([^)]+)\)/); if (m) escala=parseFloat(m[1]); }
            pos1=(pos3-e.clientX)/escala; pos2=(pos4-e.clientY)/escala;
            pos3=e.clientX; pos4=e.clientY;
            elementoPrincipal.style.top  = (elementoPrincipal.offsetTop -pos2)+'px';
            elementoPrincipal.style.left = (elementoPrincipal.offsetLeft-pos1)+'px';
        };
    };
}

// ============================================================
// COTIZACIONES ANIMADAS
// ============================================================
function animarCotizacion(idElemento, nuevoValor, valorAnterior) {
    var el=document.getElementById(idElemento); if (!el) return;
    var desde=Number(valorAnterior)||0, hasta=Number(nuevoValor)||0;
    el.classList.remove('bws-anim-up','bws-anim-down'); void el.offsetWidth;
    var dur=600, inicio=performance.now();
    var easeOut=function(t){ return 1-Math.pow(1-t,3); };
    function tick(ahora) {
        var p=Math.min((ahora-inicio)/dur,1);
        el.textContent=Math.round(desde+(hasta-desde)*easeOut(p));
        if (p<1) requestAnimationFrame(tick); else el.textContent=hasta;
    }
    requestAnimationFrame(tick);
    if (hasta>desde) el.classList.add('bws-anim-up');
    else if (hasta<desde) el.classList.add('bws-anim-down');
}
function setCotizacion(idElemento, nuevoValor) {
    var prev=_prevCotizaciones[idElemento]!==undefined?_prevCotizaciones[idElemento]:nuevoValor;
    animarCotizacion(idElemento,nuevoValor,prev);
    _prevCotizaciones[idElemento]=nuevoValor;
}

// ============================================================
// BEEP / BLINK
// ============================================================
function obtenerPrecioMinimoHabilitado() {
    var precios=[];
    if (!document.getElementById('H_Radio').disabled) precios.push(_valorHeineken);
    if (!document.getElementById('G_Radio').disabled) precios.push(_valorGatorade);
    if (!document.getElementById('N_Radio').disabled) precios.push(_valorNike);
    if (!document.getElementById('M_Radio').disabled) precios.push(_valorMcDonalds);
    return precios.length ? Math.min.apply(null,precios) : Infinity;
}
function evaluarCondicionFinalizar() {
    if (_jugarCartas!==false) return false;
    var miCash=Number(format2Num(document.getElementById('Jugador'+(_turnoJugador+1)+'_Cash').innerHTML));
    return miCash < obtenerPrecioMinimoHabilitado();
}
function reproducirBeep() {
    try {
        if (!_beepAudioContext) _beepAudioContext=new(window.AudioContext||window.webkitAudioContext)();
        if (_beepAudioContext.state==='suspended') _beepAudioContext.resume();
        var osc=_beepAudioContext.createOscillator(), gain=_beepAudioContext.createGain();
        osc.connect(gain); gain.connect(_beepAudioContext.destination);
        osc.frequency.value=1047; osc.type='triangle'; gain.gain.value=0.3;
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.00001,_beepAudioContext.currentTime+0.6);
        osc.stop(_beepAudioContext.currentTime+0.6);
    } catch(e) {}
}
function iniciarBlinkYBeep() {
    var btn=document.getElementById('Finalizar');
    if (btn&&!btn.classList.contains('blinking')) {
        btn.classList.add('blinking');
        if (_beepInterval) clearInterval(_beepInterval);
        _beepInterval=setInterval(function(){ if (evaluarCondicionFinalizar()) reproducirBeep(); else detenerBlinkYBeep(); },2000);
    }
}
function detenerBlinkYBeep() {
    var btn=document.getElementById('Finalizar'); if (btn) btn.classList.remove('blinking');
    if (_beepInterval) { clearInterval(_beepInterval); _beepInterval=null; }
}

// ============================================================
// CALCULAR TOTALES
// ============================================================
function calcularTotalJugadores() {
    for (var i=0; i<_jugadores.length; i++) {
        if (_jugadores[i][0]==='Sin Asignar') { var cv=document.getElementById('Jugador'+(i+1)+'_V_Cash'); if(cv) cv.innerHTML='.'; continue; }
        var total=Number(format2Num(document.getElementById('Jugador'+(i+1)+'_Cash').innerHTML));
        total+=Number(format2Num(document.getElementById('Jugador'+(i+1)+'_Heineken').innerHTML))*_valorHeineken;
        total+=Number(format2Num(document.getElementById('Jugador'+(i+1)+'_McDonalds').innerHTML))*_valorMcDonalds;
        total+=Number(format2Num(document.getElementById('Jugador'+(i+1)+'_Nike').innerHTML))*_valorNike;
        total+=Number(format2Num(document.getElementById('Jugador'+(i+1)+'_Gatorade').innerHTML))*_valorGatorade;
        document.getElementById('Jugador'+(i+1)+'_Total').innerHTML=num2Format(total);
        document.getElementById('Jugador'+(i+1)+'_V_Heineken').innerHTML=num2Format(Number(format2Num(document.getElementById('Jugador'+(i+1)+'_Heineken').innerHTML))*_valorHeineken);
        document.getElementById('Jugador'+(i+1)+'_V_McDonalds').innerHTML=num2Format(Number(format2Num(document.getElementById('Jugador'+(i+1)+'_McDonalds').innerHTML))*_valorMcDonalds);
        document.getElementById('Jugador'+(i+1)+'_V_Nike').innerHTML=num2Format(Number(format2Num(document.getElementById('Jugador'+(i+1)+'_Nike').innerHTML))*_valorNike);
        document.getElementById('Jugador'+(i+1)+'_V_Gatorade').innerHTML=num2Format(Number(format2Num(document.getElementById('Jugador'+(i+1)+'_Gatorade').innerHTML))*_valorGatorade);
        var totalAnt=0;
        switch(i){ case 0:totalAnt=_logJugador_1[_valorIndiceGraficas-1]||0;break; case 1:totalAnt=_logJugador_2[_valorIndiceGraficas-1]||0;break; case 2:totalAnt=_logJugador_3[_valorIndiceGraficas-1]||0;break; case 3:totalAnt=_logJugador_4[_valorIndiceGraficas-1]||0;break; }
        var diff=total-totalAnt;
        var cr=document.getElementById('Jugador'+(i+1)+'_V_Cash');
        if (cr) { cr.innerHTML=diff>0?'▲ '+num2Format(diff):diff<0?'▼ '+num2Format(Math.abs(diff)):'0'; cr.style.color='#a855f7'; }
    }
}

// ============================================================
// REDONDEOS Y TOPES
// ============================================================
function redondeos() {
    if (_valorNike%100>0)      _valorNike-=50;
    if (_valorHeineken%100>0)  _valorHeineken-=50;
    if (_valorMcDonalds%100>0) _valorMcDonalds-=50;
    if (_valorGatorade%100>0)  _valorGatorade-=50;
}
function topes() {
    if (window._gameOver) return;
    function revienta(empresa, getVal, setVal, idCol) {
        var v=getVal(); if (v>2500) { var exc=v-2500; setVal(2500); for(var i=0;i<4;i++){ if(_jugadores[i][0]!=='Sin Asignar'){ var cash=Number(format2Num(document.getElementById('Jugador'+(i+1)+'_Cash').innerHTML)); var acc=Number(format2Num(document.getElementById('Jugador'+(i+1)+'_'+idCol).innerHTML)); document.getElementById('Jugador'+(i+1)+'_Cash').innerHTML=num2Format(cash+(acc*exc)); } } }
    }
    revienta('H', function(){return _valorHeineken;},  function(v){_valorHeineken=v;},  'Heineken');
    revienta('G', function(){return _valorGatorade;},   function(v){_valorGatorade=v;},  'Gatorade');
    revienta('M', function(){return _valorMcDonalds;},  function(v){_valorMcDonalds=v;}, 'McDonalds');
    revienta('N', function(){return _valorNike;},        function(v){_valorNike=v;},      'Nike');
    function quiebra(getVal, setVal, idCol) {
        if (getVal()<100) { setVal(100); for(var i=0;i<4;i++){ if(_jugadores[i][0]!=='Sin Asignar') document.getElementById('Jugador'+(i+1)+'_'+idCol).innerHTML=0; } }
    }
    quiebra(function(){return _valorHeineken;},  function(v){_valorHeineken=v;},  'Heineken');
    quiebra(function(){return _valorGatorade;},   function(v){_valorGatorade=v;},  'Gatorade');
    quiebra(function(){return _valorMcDonalds;},  function(v){_valorMcDonalds=v;}, 'McDonalds');
    quiebra(function(){return _valorNike;},        function(v){_valorNike=v;},      'Nike');
    calcularTotalJugadores();
    // Quiebra de banca
    var hayQuiebra=false, totalesAntes=[];
    for (var i=0;i<4;i++) {
        if (_jugadores[i][0]!=='Sin Asignar') {
            var cash=Number(format2Num(document.getElementById('Jugador'+(i+1)+'_Cash').innerHTML));
            var h=Number(format2Num(document.getElementById('Jugador'+(i+1)+'_Heineken').innerHTML));
            var g=Number(format2Num(document.getElementById('Jugador'+(i+1)+'_Gatorade').innerHTML));
            var n=Number(format2Num(document.getElementById('Jugador'+(i+1)+'_Nike').innerHTML));
            var m=Number(format2Num(document.getElementById('Jugador'+(i+1)+'_McDonalds').innerHTML));
            var total=Number(format2Num(document.getElementById('Jugador'+(i+1)+'_Total').innerHTML));
            totalesAntes.push({nombre:_jugadores[i][0],total:total});
            if (cash===0&&h===0&&g===0&&n===0&&m===0) hayQuiebra=true;
        }
    }
    if (hayQuiebra) {
        window._gameOver=true;
        var perdedores=totalesAntes.filter(function(p){return p.total>0;}).map(function(p){return{nombre:p.nombre,perdida:p.total};});
        for (var i=0;i<4;i++) { if (_jugadores[i][0]!=='Sin Asignar') { ['Cash','Heineken','Gatorade','Nike','McDonalds'].forEach(function(f){ document.getElementById('Jugador'+(i+1)+'_'+f).innerHTML='0'; }); } }
        calcularTotalJugadores();
        mostrarQuiebreBanca(perdedores);
    }
}

// ============================================================
// COMPRA / VENTA
// ============================================================
function calcularPorRadio(_radio) {
    var _estadoCombo=document.getElementById('ComboBox').value;
    var _auxUserCash=Number(format2Num(document.getElementById('Jugador'+(_turnoJugador+1)+'_Cash').innerHTML));
    if (_estadoCombo==='C') {
        switch(_radio){ case'H':document.getElementById('CantidadInput').value=String(Math.floor(_auxUserCash/_valorHeineken));break; case'M':document.getElementById('CantidadInput').value=String(Math.floor(_auxUserCash/_valorMcDonalds));break; case'N':document.getElementById('CantidadInput').value=String(Math.floor(_auxUserCash/_valorNike));break; case'G':document.getElementById('CantidadInput').value=String(Math.floor(_auxUserCash/_valorGatorade));break; }
    } else {
        var _qje;
        switch(_radio){ case'H':_qje='Jugador'+(_turnoJugador+1)+'_Heineken';break; case'M':_qje='Jugador'+(_turnoJugador+1)+'_McDonalds';break; case'N':_qje='Jugador'+(_turnoJugador+1)+'_Nike';break; case'G':_qje='Jugador'+(_turnoJugador+1)+'_Gatorade';break; }
        document.getElementById('CantidadInput').value=Number(format2Num(document.getElementById(_qje).innerHTML));
    }
}

function ejecutarMovimientosUser() {
    var _nodoJugadorAccion,_valorAccion,_empresaNombre;
    if (document.getElementById('H_Radio').checked)      {_nodoJugadorAccion='Jugador'+(_turnoJugador+1)+'_Heineken'; _valorAccion=_valorHeineken; _empresaNombre='Heineken';}
    else if (document.getElementById('G_Radio').checked) {_nodoJugadorAccion='Jugador'+(_turnoJugador+1)+'_Gatorade'; _valorAccion=_valorGatorade; _empresaNombre='Gatorade';}
    else if (document.getElementById('M_Radio').checked) {_nodoJugadorAccion='Jugador'+(_turnoJugador+1)+'_McDonalds';_valorAccion=_valorMcDonalds;_empresaNombre='McDonalds';}
    else if (document.getElementById('N_Radio').checked) {_nodoJugadorAccion='Jugador'+(_turnoJugador+1)+'_Nike';     _valorAccion=_valorNike;     _empresaNombre='Nike';}
    if (!_nodoJugadorAccion) return;
    var _estadoCombo=document.getElementById('ComboBox').value;
    var _auxUserCash=Number(format2Num(document.getElementById('Jugador'+(_turnoJugador+1)+'_Cash').innerHTML));
    var _auxUserInput=Number(format2Num(document.getElementById('CantidadInput').value));
    var _auxUserAcciones=Number(format2Num(document.getElementById(_nodoJugadorAccion).innerHTML));
    if (_estadoCombo==='C') {
        if (_auxUserInput*_valorAccion<=_auxUserCash) {
            document.getElementById(_nodoJugadorAccion).innerHTML=num2Format(_auxUserAcciones+_auxUserInput);
            document.getElementById('Jugador'+(_turnoJugador+1)+'_Cash').innerHTML=num2Format(_auxUserCash-(_auxUserInput*_valorAccion));
            _registrarTransaccion(_jugadores[_turnoJugador][0],'Compra',_empresaNombre,_auxUserInput);
        }
    } else {
        if (_auxUserInput<=_auxUserAcciones) {
            document.getElementById(_nodoJugadorAccion).innerHTML=num2Format(_auxUserAcciones-_auxUserInput);
            document.getElementById('Jugador'+(_turnoJugador+1)+'_Cash').innerHTML=num2Format(_auxUserCash+(_auxUserInput*_valorAccion));
            _registrarTransaccion(_jugadores[_turnoJugador][0],'Venta',_empresaNombre,_auxUserInput);
        }
    }
    calcularTotalJugadores();
    document.getElementById('CantidadInput').value='';
    if (evaluarCondicionFinalizar()) iniciarBlinkYBeep(); else detenerBlinkYBeep();
}

// ============================================================
// HISTORIAL LOCAL
// ============================================================
function _registrarTransaccion(jugador,tipo,empresa,cantidad) {
    if (_historialTransacciones.length>0) { var u=_historialTransacciones[_historialTransacciones.length-1]; if (u.jugador!==jugador&&u.tipo!=='separador') _historialTransacciones.push({tipo:'separador'}); }
    _historialTransacciones.push({jugador:jugador,tipo:tipo,empresa:empresa,cantidad:cantidad});
}
function _registrarCarta(jugador,carta,empresaPrincipal,empresaElegida,origen) {
    if (_historialTransacciones.length>0) { var u=_historialTransacciones[_historialTransacciones.length-1]; if (u.jugador!==jugador&&u.tipo!=='separador') _historialTransacciones.push({tipo:'separador'}); }
    _historialTransacciones.push({jugador:jugador,tipo:'carta',origen:origen,carta:carta,empresaPrincipal:empresaPrincipal,empresaElegida:empresaElegida});
}

// ============================================================
// CARTAS - MASO
// ============================================================
function jugadaCartaDelMaso() {
    if (!_jugarCartas) return;
    document.getElementById('Finalizar').style='background-color:red;';
    document.getElementById('Finalizar').disabled=false;
    _jugarCartas=false;
    if (_valorIndice>67) { document.getElementById('CartaMaso').src='_imagenes/MasoVacio.png'; return; }
    document.getElementById('CartaJugada').src=cartasMaestro[_valorIndice][2];
    jugarCartasCompletar(true,0);
}

// ============================================================
// CONFIRMAR CARTA DE MANO
// ============================================================
function abrirModalConfirmarCartaMano(urlCarta,onConfirmar) {
    _cartaManoConfirmCallback=onConfirmar;
    var img=document.getElementById('ModalConfirmarCartaImagen');
    var modal=document.getElementById('ModalConfirmarCartaMano');
    var interior=document.getElementById('ModalConfirmarCartaManoInterior');
    if (img) img.src=urlCarta;
    if (interior) { interior.classList.remove('bws-modal-up-out','bws-modal-up'); void interior.offsetWidth; interior.classList.add('bws-modal-up'); }
    if (modal) modal.style.display='flex';
    reproducirAudio('audioAbrirModal');
    if (interior) hacerDraggable(interior,interior);
}
function cerrarModalConfirmarCarta(continuar) {
    reproducirAudio('audioCerrarModal');
    cerrarModalConAnimacion('ModalConfirmarCartaMano','ModalConfirmarCartaManoInterior','bws-modal-up-out',function(){
        if (continuar&&_cartaManoConfirmCallback) { _cartaManoConfirmCallback(); _cartaManoConfirmCallback=null; }
        else { _cartaManoConfirmCallback=null; }
    });
}

// ============================================================
// CARTAS - MANO
// ============================================================
function jugadaCartaDeLaMano(_CartaElegida) {
    if (!_jugarCartas) return;
    if (_valorIndice>67) return;
    var idx=_turnoJugador;
    if (!_jugadores[idx][_CartaElegida+1]) return;
    var posActivo=0;
    for (var i=0;i<idx;i++) { if (_jugadores[i][0]!=='Sin Asignar') posActivo++; }
    var urls=_misCartasURLs[posActivo]||[];
    var urlCarta=urls[_CartaElegida]||'_imagenes/CartaEjemploAtras.png';
    var indiceReal=posActivo*4+_CartaElegida;
    abrirModalConfirmarCartaMano(urlCarta,function(){
        document.getElementById('Finalizar').style='background-color:red;';
        document.getElementById('Finalizar').disabled=false;
        document.getElementById('CartaMaso'+(_CartaElegida+1)).src='_imagenes/CartaEjemploAtras.png';
        _jugadores[idx][_CartaElegida+1]=false;
        _jugarCartas=false; _jugoDeLaMano=true;
        document.getElementById('CartaJugada').src=cartasMaestro[indiceReal][2];
        actualizarIndicadoresCartas();
        jugarCartasCompletar(false,indiceReal);
    });
}

// ============================================================
// COMPLETAR JUGADA
// ============================================================
function jugarCartasCompletar(_esDelMaso,_queCarta) {
    var _valorIndiceAUX=_esDelMaso?_valorIndice:_queCarta;
    if (cartasMaestro[_valorIndiceAUX][0]==='1000') {
        terminarJugadaCartas('no-aplica',_valorIndiceAUX);
        _registrarCarta(_jugadores[_turnoJugador][0],'1000',cartasMaestro[_valorIndiceAUX][1],null,_jugoDeLaMano?'mano':'mazo');
        _ejecutarFinalizarJugada();
        return;
    }
    var modal=document.getElementById('ModalCartas');
    var tituloTexto=document.getElementById('ModalTituloTexto');
    var divImagenes=document.getElementById('ModalImagenesOpciones');
    var divRadios=document.getElementById('ModalFormulario');
    switch(cartasMaestro[_valorIndiceAUX][0]){ case'500':tituloTexto.innerHTML='QUE EMPRESA SUBE 600 ?';break; case'600':tituloTexto.innerHTML='QUE EMPRESA BAJA 300 ?';break; case'/2':tituloTexto.innerHTML='QUE EMPRESA DUPLICA ?';break; case'x2':tituloTexto.innerHTML='QUE EMPRESA BAJA A LA MITAD ?';break; }
    var empresaCarta=cartasMaestro[_valorIndiceAUX][1];
    var htmlImagenes='',htmlRadios='';
    function agregarOpcion(img,letra){ htmlImagenes+='<img src="_imagenes/'+img+'" style="width:60px;">'; htmlRadios+='<input type="radio" name="modalRadio" style="cursor:pointer;transform:scale(1.5);" onclick="ejecutarSeleccionModal(\''+letra+'\','+_valorIndiceAUX+')">'; }
    if (empresaCarta==='N'){agregarOpcion('PopUpMcDonalds.png','M');agregarOpcion('PopUpGatorade.png','G');agregarOpcion('PopUpHeineken.png','H');}
    else if(empresaCarta==='H'){agregarOpcion('PopUpMcDonalds.png','M');agregarOpcion('PopUpGatorade.png','G');agregarOpcion('PopUpNike.png','N');}
    else if(empresaCarta==='G'){agregarOpcion('PopUpMcDonalds.png','M');agregarOpcion('PopUpHeineken.png','H');agregarOpcion('PopUpNike.png','N');}
    else if(empresaCarta==='M'){agregarOpcion('PopUpHeineken.png','H');agregarOpcion('PopUpGatorade.png','G');agregarOpcion('PopUpNike.png','N');}
    divImagenes.innerHTML=htmlImagenes; divRadios.innerHTML=htmlRadios;
    var cartaActualImg=document.getElementById('ModalCartaImagen');
    cartaActualImg.src=''; cartaActualImg.src=cartasMaestro[_valorIndiceAUX][2];
    reproducirAudio('audioModalCartas');
    modal.style.display='flex';
    var cajaBlanca=document.getElementById('ModalCajaInterior');
    cajaBlanca.style.top='50%'; cajaBlanca.style.left='50%'; cajaBlanca.style.transform='translate(-50%,-50%)';
    cajaBlanca.classList.remove('bws-modal-center-down'); void cajaBlanca.offsetWidth; cajaBlanca.classList.add('bws-modal-center-down');
    hacerDraggable(cajaBlanca,cajaBlanca);
}

function ejecutarSeleccionModal(empresaElegida,indiceCarta) {
    document.getElementById('ModalCartas').style.display='none';
    terminarJugadaCartas(empresaElegida,indiceCarta);
    _registrarCarta(_jugadores[_turnoJugador][0],cartasMaestro[indiceCarta][0],cartasMaestro[indiceCarta][1],empresaElegida,_jugoDeLaMano?'mano':'mazo');
}

// ============================================================
// TERMINAR JUGADA DE CARTAS (lógica de precios)
// ============================================================
function terminarJugadaCartas(_empresaElegida,_valorIndiceINT) {
    var totalesAntes=[];
    for (var i=0;i<4;i++){ if(_jugadores[i][0]!=='Sin Asignar'){ var t=Number(format2Num(document.getElementById('Jugador'+(i+1)+'_Total').innerHTML)); totalesAntes[i]=t; }else{ totalesAntes[i]=null; } }
    switch(cartasMaestro[_valorIndiceINT][1]){
        case'N':switch(cartasMaestro[_valorIndiceINT][0]){case'1000':_valorNike+=1000;_valorGatorade-=100;_valorHeineken-=100;_valorMcDonalds-=100;break;case'600':_valorNike+=600;if(_empresaElegida==='G'){_valorGatorade-=300;document.getElementById('N_Radio').disabled=true;document.getElementById('G_Radio').disabled=true;}else if(_empresaElegida==='H'){_valorHeineken-=300;document.getElementById('N_Radio').disabled=true;document.getElementById('H_Radio').disabled=true;}else if(_empresaElegida==='M'){_valorMcDonalds-=300;document.getElementById('N_Radio').disabled=true;document.getElementById('M_Radio').disabled=true;}break;case'500':_valorNike-=500;if(_empresaElegida==='G'){_valorGatorade+=600;document.getElementById('N_Radio').disabled=true;document.getElementById('G_Radio').disabled=true;}else if(_empresaElegida==='H'){_valorHeineken+=600;document.getElementById('N_Radio').disabled=true;document.getElementById('H_Radio').disabled=true;}else if(_empresaElegida==='M'){_valorMcDonalds+=600;document.getElementById('N_Radio').disabled=true;document.getElementById('M_Radio').disabled=true;}break;case'x2':_valorNike*=2;if(_empresaElegida==='G'){_valorGatorade/=2;document.getElementById('N_Radio').disabled=true;document.getElementById('G_Radio').disabled=true;}else if(_empresaElegida==='H'){_valorHeineken/=2;document.getElementById('N_Radio').disabled=true;document.getElementById('H_Radio').disabled=true;}else if(_empresaElegida==='M'){_valorMcDonalds/=2;document.getElementById('N_Radio').disabled=true;document.getElementById('M_Radio').disabled=true;}break;case'/2':_valorNike/=2;if(_empresaElegida==='G'){_valorGatorade*=2;document.getElementById('N_Radio').disabled=true;document.getElementById('G_Radio').disabled=true;}else if(_empresaElegida==='H'){_valorHeineken*=2;document.getElementById('N_Radio').disabled=true;document.getElementById('H_Radio').disabled=true;}else if(_empresaElegida==='M'){_valorMcDonalds*=2;document.getElementById('N_Radio').disabled=true;document.getElementById('M_Radio').disabled=true;}break;}break;
        case'H':switch(cartasMaestro[_valorIndiceINT][0]){case'1000':_valorNike-=100;_valorGatorade-=100;_valorHeineken+=1000;_valorMcDonalds-=100;break;case'600':_valorHeineken+=600;if(_empresaElegida==='G'){_valorGatorade-=300;document.getElementById('H_Radio').disabled=true;document.getElementById('G_Radio').disabled=true;}else if(_empresaElegida==='N'){_valorNike-=300;document.getElementById('H_Radio').disabled=true;document.getElementById('N_Radio').disabled=true;}else if(_empresaElegida==='M'){_valorMcDonalds-=300;document.getElementById('H_Radio').disabled=true;document.getElementById('M_Radio').disabled=true;}break;case'500':_valorHeineken-=500;if(_empresaElegida==='G'){_valorGatorade+=600;document.getElementById('H_Radio').disabled=true;document.getElementById('G_Radio').disabled=true;}else if(_empresaElegida==='N'){_valorNike+=600;document.getElementById('H_Radio').disabled=true;document.getElementById('N_Radio').disabled=true;}else if(_empresaElegida==='M'){_valorMcDonalds+=600;document.getElementById('H_Radio').disabled=true;document.getElementById('M_Radio').disabled=true;}break;case'x2':_valorHeineken*=2;if(_empresaElegida==='G'){_valorGatorade/=2;document.getElementById('H_Radio').disabled=true;document.getElementById('G_Radio').disabled=true;}else if(_empresaElegida==='N'){_valorNike/=2;document.getElementById('H_Radio').disabled=true;document.getElementById('N_Radio').disabled=true;}else if(_empresaElegida==='M'){_valorMcDonalds/=2;document.getElementById('H_Radio').disabled=true;document.getElementById('M_Radio').disabled=true;}break;case'/2':_valorHeineken/=2;if(_empresaElegida==='G'){_valorGatorade*=2;document.getElementById('H_Radio').disabled=true;document.getElementById('G_Radio').disabled=true;}else if(_empresaElegida==='N'){_valorNike*=2;document.getElementById('H_Radio').disabled=true;document.getElementById('N_Radio').disabled=true;}else if(_empresaElegida==='M'){_valorMcDonalds*=2;document.getElementById('H_Radio').disabled=true;document.getElementById('M_Radio').disabled=true;}break;}break;
        case'G':switch(cartasMaestro[_valorIndiceINT][0]){case'1000':_valorNike-=100;_valorGatorade+=1000;_valorHeineken-=100;_valorMcDonalds-=100;break;case'600':_valorGatorade+=600;if(_empresaElegida==='H'){_valorHeineken-=300;document.getElementById('G_Radio').disabled=true;document.getElementById('H_Radio').disabled=true;}else if(_empresaElegida==='N'){_valorNike-=300;document.getElementById('G_Radio').disabled=true;document.getElementById('N_Radio').disabled=true;}else if(_empresaElegida==='M'){_valorMcDonalds-=300;document.getElementById('G_Radio').disabled=true;document.getElementById('M_Radio').disabled=true;}break;case'500':_valorGatorade-=500;if(_empresaElegida==='H'){_valorHeineken+=600;document.getElementById('G_Radio').disabled=true;document.getElementById('H_Radio').disabled=true;}else if(_empresaElegida==='N'){_valorNike+=600;document.getElementById('G_Radio').disabled=true;document.getElementById('N_Radio').disabled=true;}else if(_empresaElegida==='M'){_valorMcDonalds+=600;document.getElementById('G_Radio').disabled=true;document.getElementById('M_Radio').disabled=true;}break;case'x2':_valorGatorade*=2;if(_empresaElegida==='H'){_valorHeineken/=2;document.getElementById('G_Radio').disabled=true;document.getElementById('H_Radio').disabled=true;}else if(_empresaElegida==='N'){_valorNike/=2;document.getElementById('G_Radio').disabled=true;document.getElementById('N_Radio').disabled=true;}else if(_empresaElegida==='M'){_valorMcDonalds/=2;document.getElementById('G_Radio').disabled=true;document.getElementById('M_Radio').disabled=true;}break;case'/2':_valorGatorade/=2;if(_empresaElegida==='H'){_valorHeineken*=2;document.getElementById('G_Radio').disabled=true;document.getElementById('H_Radio').disabled=true;}else if(_empresaElegida==='N'){_valorNike*=2;document.getElementById('G_Radio').disabled=true;document.getElementById('N_Radio').disabled=true;}else if(_empresaElegida==='M'){_valorMcDonalds*=2;document.getElementById('G_Radio').disabled=true;document.getElementById('M_Radio').disabled=true;}break;}break;
        case'M':switch(cartasMaestro[_valorIndiceINT][0]){case'1000':_valorNike-=100;_valorGatorade-=100;_valorHeineken-=100;_valorMcDonalds+=1000;break;case'600':_valorMcDonalds+=600;if(_empresaElegida==='H'){_valorHeineken-=300;document.getElementById('M_Radio').disabled=true;document.getElementById('H_Radio').disabled=true;}else if(_empresaElegida==='N'){_valorNike-=300;document.getElementById('M_Radio').disabled=true;document.getElementById('N_Radio').disabled=true;}else if(_empresaElegida==='G'){_valorGatorade-=300;document.getElementById('M_Radio').disabled=true;document.getElementById('G_Radio').disabled=true;}break;case'500':_valorMcDonalds-=500;if(_empresaElegida==='H'){_valorHeineken+=600;document.getElementById('M_Radio').disabled=true;document.getElementById('H_Radio').disabled=true;}else if(_empresaElegida==='N'){_valorNike+=600;document.getElementById('M_Radio').disabled=true;document.getElementById('N_Radio').disabled=true;}else if(_empresaElegida==='G'){_valorGatorade+=600;document.getElementById('M_Radio').disabled=true;document.getElementById('G_Radio').disabled=true;}break;case'x2':_valorMcDonalds*=2;if(_empresaElegida==='H'){_valorHeineken/=2;document.getElementById('M_Radio').disabled=true;document.getElementById('H_Radio').disabled=true;}else if(_empresaElegida==='N'){_valorNike/=2;document.getElementById('M_Radio').disabled=true;document.getElementById('N_Radio').disabled=true;}else if(_empresaElegida==='G'){_valorGatorade/=2;document.getElementById('M_Radio').disabled=true;document.getElementById('G_Radio').disabled=true;}break;case'/2':_valorMcDonalds/=2;if(_empresaElegida==='H'){_valorHeineken*=2;document.getElementById('M_Radio').disabled=true;document.getElementById('H_Radio').disabled=true;}else if(_empresaElegida==='N'){_valorNike*=2;document.getElementById('M_Radio').disabled=true;document.getElementById('N_Radio').disabled=true;}else if(_empresaElegida==='G'){_valorGatorade*=2;document.getElementById('M_Radio').disabled=true;document.getElementById('G_Radio').disabled=true;}break;}break;
    }
    redondeos(); topes();
    setCotizacion('ValorHeineken',_valorHeineken); setCotizacion('ValorGatorade',_valorGatorade); setCotizacion('ValorMcDonalds',_valorMcDonalds); setCotizacion('ValorNike',_valorNike);
    dibujoGraficaBarras(_valorHeineken,_valorGatorade,_valorNike,_valorMcDonalds);
    var aux=_valorIndiceGraficas+1;
    _logHeineken[aux]=_valorHeineken; _logGatorade[aux]=_valorGatorade; _logNike[aux]=_valorNike; _logMcDonalds[aux]=_valorMcDonalds;
    if(_jugadores[0][0]!=='Sin Asignar') _logJugador_1[aux]=Number(format2Num(document.getElementById('Jugador1_Total').innerHTML)); else _logJugador_1[aux]=0;
    if(_jugadores[1][0]!=='Sin Asignar') _logJugador_2[aux]=Number(format2Num(document.getElementById('Jugador2_Total').innerHTML)); else _logJugador_2[aux]=0;
    if(_jugadores[2][0]!=='Sin Asignar') _logJugador_3[aux]=Number(format2Num(document.getElementById('Jugador3_Total').innerHTML)); else _logJugador_3[aux]=0;
    if(_jugadores[3][0]!=='Sin Asignar') _logJugador_4[aux]=Number(format2Num(document.getElementById('Jugador4_Total').innerHTML)); else _logJugador_4[aux]=0;
    _logLabels[aux]=aux.toString();
    grafcaLineal(); calcularTotalJugadores();
    if (evaluarCondicionFinalizar()) iniciarBlinkYBeep(); else detenerBlinkYBeep();
}

// ============================================================
// FINALIZAR JUGADA
// ============================================================
function finalizarJugada() {
    if (_jugarCartas===false) {
        var _miCash=Number(format2Num(document.getElementById('Jugador'+(_turnoJugador+1)+'_Cash').innerHTML));
        if (_miCash>0) {
            var precios=[];
            if(!document.getElementById('H_Radio').disabled) precios.push(_valorHeineken);
            if(!document.getElementById('G_Radio').disabled) precios.push(_valorGatorade);
            if(!document.getElementById('N_Radio').disabled) precios.push(_valorNike);
            if(!document.getElementById('M_Radio').disabled) precios.push(_valorMcDonalds);
            if (precios.length && _miCash>=Math.min.apply(null,precios)) {
                reproducirAudio('audioAbrirModal');
                document.getElementById('ModalAdvertenciaFinalizar').style.display='flex';
                return;
            }
        }
    }
    _ejecutarFinalizarJugada();
}
function confirmarFinalizar() {
    reproducirAudio('audioCerrarModal');
    cerrarModalConAnimacion('ModalAdvertenciaFinalizar','ModalAdvertenciaFinalizarInterior','bws-modal-up-out',function(){ _ejecutarFinalizarJugada(); });
}
function _ejecutarFinalizarJugada() {
    detenerBlinkYBeep();
    document.getElementById('Finalizar').style='background-color:grey;';
    document.getElementById('Finalizar').disabled=true;
    document.getElementById('CartaMaso').src='_imagenes/CartaEjemploAtras.png';
    _jugarCartas=true;
    if (_jugoDeLaMano===false) _valorIndice++;
    _valorIndiceGraficas++;
    _jugoDeLaMano=false;
    if (_valorIndice>67) {
        document.getElementById('CartaMaso').src='_imagenes/MasoVacio.png';
        var ganador='', mayorTotal=-1;
        for (var i=0;i<4;i++) { if(_jugadores[i][0]!=='Sin Asignar'){ var t=Number(format2Num(document.getElementById('Jugador'+(i+1)+'_Total').innerHTML)); if(t>mayorTotal){mayorTotal=t;ganador=_jugadores[i][0];} } }
        mostrarGameOver(ganador);
        return;
    }
    document.getElementById('MInteractivoTituloMaso').innerHTML='Movimientos : '+_valorIndice+'/68';
    ['M_Radio','G_Radio','H_Radio','N_Radio'].forEach(function(id){ document.getElementById(id).disabled=false; });
    _actualizarGrafica=true;
    avanzarTurno();
}

// ============================================================
// GAME OVER
// ============================================================
function mostrarGameOver(ganador) {
    var modal=document.getElementById('ModalGameOver'); if (!modal) return;
    document.getElementById('GameOverTitulo').innerHTML='GAME OVER!';
    document.getElementById('GameOverSubtitulo').innerHTML='FIN DEL JUEGO';
    document.getElementById('GameOverContenido').innerHTML='<div style="font-size:28px;color:#ffc107;">🏆 GANADOR 🏆</div><div style="font-size:32px;margin-top:10px;">'+ganador+'</div>';
    modal.style.display='flex';
    reproducirAudio('audioAbrirModal');
    var container=document.getElementById('GameOverContainer');
    if (container) { container.style.top='50%'; container.style.left='50%'; container.style.transform='translate(-50%,-50%)'; container.style.margin='0'; hacerDraggable(container,container); }
}
function mostrarQuiebreBanca(perdedores) {
    var modal=document.getElementById('ModalGameOver'); if (!modal) return;
    document.getElementById('GameOverTitulo').innerHTML='QUIEBRE COMPLETO BWS!';
    document.getElementById('GameOverSubtitulo').innerHTML='Game Over';
    var html='<div style="font-size:28px;margin-bottom:20px;color:#ffc107;">💸 PÉRDIDAS 💸</div>';
    if (perdedores&&perdedores.length>0) perdedores.forEach(function(j){ html+='<div style="font-size:24px;margin:8px 0;">'+j.nombre+': - $'+j.perdida.toLocaleString()+'</div>'; });
    document.getElementById('GameOverContenido').innerHTML=html;
    modal.style.display='flex';
    reproducirAudio('audioAbrirModal');
    var container=document.getElementById('GameOverContainer');
    if (container) { container.style.top='50%'; container.style.left='50%'; container.style.transform='translate(-50%,-50%)'; container.style.margin='0'; hacerDraggable(container,container); }
}

// ============================================================
// HISTORIAL UI
// ============================================================
function abrirHistorial() {
    var contenido=document.getElementById('ContenidoHistorial'); contenido.innerHTML='';
    if (_historialTransacciones.length===0) { contenido.innerHTML='<p style="color:#4a9eff;text-align:center;margin-top:30px;font-size:13px;font-family:Rajdhani,sans-serif;letter-spacing:2px;">SIN TRANSACCIONES AÚN.</p>'; }
    else {
        var violetas=['#a855f7','#b66eff','#c280ff','#d49cff'];
        function getColor(nombre){ for(var i=0;i<_jugadores.length;i++){ if(_jugadores[i][0]===nombre) return violetas[i%violetas.length]; } return violetas[0]; }
        var inv=_historialTransacciones.slice().reverse();
        inv.forEach(function(item){
            if (item.tipo==='separador') { contenido.innerHTML+='<hr style="border:none;border-top:1px solid #1a1a1a;margin:6px 0;">'; }
            else if (item.tipo==='carta') {
                var empresas={'H':'Heineken','G':'Gatorade','N':'Nike','M':'McDonalds'};
                var principal=empresas[item.empresaPrincipal]||item.empresaPrincipal;
                var elegida=empresas[item.empresaElegida]||item.empresaElegida;
                var desc='';
                switch(item.carta){ case'1000':desc=principal+' +1000 / resto -100';break; case'600':desc=principal+' +600 / '+elegida+' -300';break; case'500':desc=principal+' -500 / '+elegida+' +600';break; case'x2':desc=principal+' x2 / '+elegida+' /2';break; case'/2':desc=principal+' /2 / '+elegida+' x2';break; }
                var colorJ=getColor(item.jugador);
                contenido.innerHTML+='<div style="margin:6px 0;background:#000;border-left:3px solid #ffc107;border-right:3px solid #ffc107;border-top:0.5px solid #ffc107;border-bottom:0.5px solid #ffc107;border-radius:4px;padding:7px 12px;display:flex;align-items:center;justify-content:space-between;"><div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" fill="#0ff"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#0ff" stroke-width="2" stroke-linecap="round"/></svg><span style="color:'+colorJ+';font-weight:bold;">'+item.jugador+'</span><span style="margin:0 2px;">·</span><span> → '+desc+'</span></div><span style="color:#ccc;font-size:18px;">→</span></div>';
            } else {
                var colorB=item.tipo==='Compra'?'#28a745':'#dc3545';
                var colorJ=getColor(item.jugador);
                contenido.innerHTML+='<div style="margin:6px 0;background:#000;border-left:3px solid '+colorB+';border-right:3px solid '+colorB+';border-top:0.5px solid '+colorB+';border-bottom:0.5px solid '+colorB+';border-radius:4px;padding:7px 12px;display:flex;align-items:center;justify-content:space-between;"><div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" fill="#0ff"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#0ff" stroke-width="2" stroke-linecap="round"/></svg><span style="color:'+colorJ+';font-weight:bold;">'+item.jugador+'</span><span style="margin:0 2px;">·</span><span style="color:'+colorB+';">'+item.tipo+'</span><span> → '+item.empresa+' <b style="color:#fff;">'+item.cantidad+'</b> acciones</span></div><span style="color:#ccc;font-size:18px;">→</span></div>';
            }
        });
    }
    document.getElementById('ModalHistorial').style.display='flex';
    reproducirAudio('audioAbrirModal');
}
function cerrarHistorial() {
    reproducirAudio('audioCerrarModal');
    cerrarModalConAnimacion('ModalHistorial','ModalHistorialInterior','bws-modal-up-out',null);
}

// ============================================================
// CERRAR MODAL CON ANIMACION (utility)
// ============================================================
function cerrarModalConAnimacion(idModal,idInterior,animOut,fnDespues) {
    var interior=document.getElementById(idInterior), modal=document.getElementById(idModal);
    if (!interior||!modal) { if(fnDespues) fnDespues(); return; }
    interior.classList.remove('bws-modal-up','bws-modal-down','bws-modal-center-down','bws-modal-up-out','bws-modal-down-out','bws-modal-center-down-out');
    void interior.offsetWidth; interior.classList.add(animOut);
    function handler(){ interior.removeEventListener('animationend',handler); modal.style.display='none'; interior.classList.remove(animOut); if(fnDespues) fnDespues(); }
    interior.addEventListener('animationend',handler);
}

// ============================================================
// GRÁFICA DE BARRAS
// ============================================================
function dibujoGraficaBarras(_Heineken,_Gatorade,_Nike,_McDonalds) {
    var myCanvas=document.getElementById('canvasBarras'); if (!myCanvas) return;
    var contenedor=document.getElementById('LogoTablero');
    var alturaContenedor=contenedor?contenedor.offsetHeight:820;
    var alturaUsada=myCanvas.offsetTop;
    var alturaDisponible=alturaContenedor-alturaUsada;
    myCanvas.width=362; myCanvas.height=alturaDisponible>100?alturaDisponible:566;
    var ctx=myCanvas.getContext('2d');
    var valoresDestino={Heineken:_Heineken,Gatorade:_Gatorade,Nike:_Nike,McDonalds:_McDonalds};
    var colores={Heineken:{top:'#28a745',bottom:'#004d00'},Gatorade:{top:'#adb5bd',bottom:'#343a40'},Nike:{top:'#dc3545',bottom:'#5c0000'},McDonalds:{top:'#ffc107',bottom:'#997300'}};
    var maxValue=2500, padding=20;
    var widthReal=myCanvas.width-(padding*2), heightReal=myCanvas.height-(padding*3);
    var marcas=Object.keys(valoresDestino);
    var gap=15, anchoBarra=(widthReal/marcas.length)-gap;
    var duracion=800, inicio=performance.now();
    var valoresInicio={};
    marcas.forEach(function(m){ valoresInicio[m]=estadoPrevioBarras[m]||0; });
    var easeOutQuart=function(t){ return 1-Math.pow(1-t,4); };
    function drawBarraRedondeada(ctx,x,y,width,height,radius){ ctx.beginPath(); ctx.moveTo(x,y+height); ctx.lineTo(x,y+radius); ctx.quadraticCurveTo(x,y,x+radius,y); ctx.lineTo(x+width-radius,y); ctx.quadraticCurveTo(x+width,y,x+width,y+radius); ctx.lineTo(x+width,y+height); ctx.closePath(); ctx.fill(); }
    function animarFrame(tiempoActual) {
        var progreso=Math.min((tiempoActual-inicio)/duracion,1);
        var pS=easeOutQuart(progreso);
        ctx.fillStyle='#060a0e'; ctx.fillRect(0,0,myCanvas.width,myCanvas.height);
        var gridSteps=maxValue/100, gridBottom=myCanvas.height-padding, gridLeft=padding, gridRight=myCanvas.width-padding;
        for (var i=0;i<=gridSteps;i++){ var yGrid=gridBottom-(i/gridSteps)*heightReal; ctx.beginPath(); ctx.strokeStyle=i===0?'#2a3a4a':'#131e2a'; ctx.lineWidth=i===0?1.5:0.5; ctx.setLineDash(i===0?[]:[3,5]); ctx.moveTo(gridLeft,yGrid); ctx.lineTo(gridRight,yGrid); ctx.stroke(); ctx.setLineDash([]); }
        var index=0;
        marcas.forEach(function(marca){
            var valorCalculado=valoresInicio[marca]+((valoresDestino[marca]-valoresInicio[marca])*pS);
            estadoPrevioBarras[marca]=valorCalculado;
            var altoBarra=(valorCalculado/maxValue)*heightReal; if(altoBarra<2) altoBarra=2;
            var x=gridLeft+(index*(anchoBarra+gap))+(gap/2), y=gridBottom-altoBarra;
            ctx.shadowColor=colores[marca].top; ctx.shadowBlur=14;
            var gradient=ctx.createLinearGradient(x,y,x,gridBottom);
            gradient.addColorStop(0,colores[marca].top); gradient.addColorStop(1,colores[marca].bottom);
            ctx.fillStyle=gradient; drawBarraRedondeada(ctx,x,y,anchoBarra,altoBarra,8);
            ctx.shadowBlur=0; ctx.strokeStyle=colores[marca].top; ctx.lineWidth=1; ctx.globalAlpha=0.4;
            ctx.beginPath(); ctx.moveTo(x+8,y); ctx.lineTo(x+anchoBarra-8,y); ctx.stroke(); ctx.globalAlpha=1;
            ctx.shadowBlur=0; ctx.fillStyle=colores[marca].top; ctx.font="bold 12px 'Share Tech Mono',monospace"; ctx.textAlign='center';
            ctx.fillText(Math.round(valorCalculado),x+(anchoBarra/2),y-7);
            if (progreso>=1) {
                var dir=0;
                switch(marca){ case'Heineken':dir=_ultimaDireccion.heineken;break; case'Gatorade':dir=_ultimaDireccion.gatorade;break; case'Nike':dir=_ultimaDireccion.nike;break; case'McDonalds':dir=_ultimaDireccion.mcdonalds;break; }
                if (dir>0||dir<0) { ctx.fillStyle=colores[marca].top; ctx.font="bold 14px 'Share Tech Mono',monospace"; ctx.fillText(dir>0?'▲':'▼',x+(anchoBarra/2)+20,y-7); }
            }
            index++;
        });
        ctx.shadowBlur=0;
        if (progreso<1) animacionBarrasReq=requestAnimationFrame(animarFrame);
    }
    if (animacionBarrasReq) cancelAnimationFrame(animacionBarrasReq);
    animacionBarrasReq=requestAnimationFrame(animarFrame);
}

// ============================================================
// GRÁFICA LINEAL
// ============================================================
function cambiargraficaLinea() {
    _queGraficaVa=_queGraficaVa==='A'?'B':'A';
    document.getElementById('TituloGraficas').innerHTML=_queGraficaVa==='A'?'Estadisticas Empresas':'Estadisticas Jugadores';
    grafcaLineal();
}
function grafcaLineal() {
    var ctx=document.getElementById('popChart').getContext('2d');
    if (_lineChartInstance) { _lineChartInstance.destroy(); _lineChartInstance=null; }
    var speedData;
    if (_queGraficaVa==='A') {
        speedData={labels:_logLabels,datasets:[
            {label:'Heineken',data:_logHeineken,lineTension:0.3,fill:false,borderColor:'#28a745',borderWidth:2,pointBackgroundColor:'#28a745',pointRadius:3,pointHoverRadius:5},
            {label:'Gatorade',data:_logGatorade,lineTension:0.3,fill:false,borderColor:'#adb5bd',borderWidth:2,pointBackgroundColor:'#adb5bd',pointRadius:3,pointHoverRadius:5},
            {label:'Nike',data:_logNike,lineTension:0.3,fill:false,borderColor:'#dc3545',borderWidth:2,pointBackgroundColor:'#dc3545',pointRadius:3,pointHoverRadius:5},
            {label:'McDonalds',data:_logMcDonalds,lineTension:0.3,fill:false,borderColor:'#ffc107',borderWidth:2,pointBackgroundColor:'#ffc107',pointRadius:3,pointHoverRadius:5}
        ]};
    } else {
        var violetas=['#ffff00','#ff1a1a','#00aaff','#00ff44'];
        var datasets=[];
        var activos=[{data:_logJugador_1,idx:0},{data:_logJugador_2,idx:1},{data:_logJugador_3,idx:2},{data:_logJugador_4,idx:3}];
        activos.forEach(function(a){ if(_jugadores[a.idx][0]!=='Sin Asignar') datasets.push({label:_jugadores[a.idx][0],data:a.data,lineTension:0.3,fill:false,borderColor:violetas[a.idx%4],borderWidth:2,pointBackgroundColor:violetas[a.idx%4],pointRadius:3,pointHoverRadius:5}); });
        speedData={labels:_logLabels,datasets:datasets};
    }
    _lineChartInstance=new Chart(ctx,{type:'line',data:speedData,options:{responsive:false,legend:{labels:{fontColor:'#8ca0b8',fontSize:11}},scales:{xAxes:[{ticks:{fontColor:'#8ca0b8',fontSize:10},gridLines:{color:'#1a2535'}}],yAxes:[{ticks:{fontColor:'#8ca0b8',fontSize:10},gridLines:{color:'#1a2535'}}]}}});
}

// ============================================================
// RESIZE
// ============================================================
function redimensionarJuego() {
    var contenedor=document.getElementById('ContenedorGeneral');
    if (contenedor&&contenedor.style.display!=='none') {
        var escalaX=window.innerWidth/1440, escalaY=window.innerHeight/820;
        var escalaFinal=Math.min(escalaX,escalaY)*0.98;
        contenedor.style.transform='translate(-50%,-50%) scale('+escalaFinal+')';
    }
}
window.addEventListener('resize', redimensionarJuego);
window.addEventListener('load',   redimensionarJuego);
redimensionarJuego();
