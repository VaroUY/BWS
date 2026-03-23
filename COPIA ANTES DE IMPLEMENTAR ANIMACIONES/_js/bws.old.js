// JavaScript BWS 

// ------------------------------------------------------------------------------------------------------//
// ------------------ INICIO SOCKET SERVER y defino sus funciones ---------------------------------------//
// ------------------------------------------------------------------------------------------------------//

var socket;

window.addEventListener('load', function() {
    socket = io();
    console.log("Socket inicializado correctamente");

    // --- ESCUCHADOR MULTIJUGADOR:

    socket.on('enviarPrecios', function(datosRecibidos)) {

        _valorHeineken  = datosRecibidos.precios.heineken;
        _valorGatorade  = datosRecibidos.precios.gatorade;
        _valorNike      = datosRecibidos.precios.nike;
        _valorMcDonalds = datosRecibidos.precios.mcdonalds;

        console.log("Sincronización: Actualizando tablero visual...",datosRecibidos.precios);

        if (typeof ejecutarMovimientosUser === "function") {
            ejecutarMovimientosUser();
        }
        
        if (typeof finalizarJugada === "function") {
            finalizarJugada();
        }

        document.getElementById('ValorHeineken').innerHTML = num2Format(_valorHeineken);
        document.getElementById('ValorGatorade').innerHTML = num2Format(_valorGatorade);
        document.getElementById('ValorMcDonalds').innerHTML = num2Format(_valorMcDonalds);
        document.getElementById('ValorNike').innerHTML = num2Format(_valorNike);
        
        if (typeof dibujoGraficaBarras === "function") {
            dibujoGraficaBarras(_valorHeineken, _valorGatorade, _valorNike, _valorMcDonalds);
        }
        if (typeof grafcaLineal === "function") {
            grafcaLineal();
        }
        if (typeof calcularTotalJugadores === "function") {
            calcularTotalJugadores();
        }
       // _compararValores();
    });
});

// --------- Captura la tabla de monitor central de jugadores para viralizar ---------------- //

function capturarDatosTablaHTML() {
    let tablaTemporal = [];

    for (let i = 1; i <= 4; i++) {
        let registro = {
            id: i,
            nombre: document.getElementById('Jugador' + i + '_Nombre').innerHTML,
            total:  Number(format2Num(document.getElementById('Jugador' + i + '_Total').innerHTML)),
            cash:   Number(format2Num(document.getElementById('Jugador' + i + '_Cash').innerHTML)),
            h:      Number(format2Num(document.getElementById('Jugador' + i + '_Heineken').innerHTML)),
            g:      Number(format2Num(document.getElementById('Jugador' + i + '_Gatorade').innerHTML)),
            n:      Number(format2Num(document.getElementById('Jugador' + i + '_Nike').innerHTML)),
            m:      Number(format2Num(document.getElementById('Jugador' + i + '_McDonalds').innerHTML))
        };
        tablaTemporal.push(registro);
    }
    return tablaTemporal;
}

// -------------------------------------- Envio datos al SocketServer -----------------------------------//

function enviarEstadoAlServidor() {
    let datosAEnviar = {
        precios: {
            heineken: _valorHeineken,
            gatorade: _valorGatorade,
            nike: _valorNike,
            mcdonalds: _valorMcDonalds
        },
        jugadores: capturarDatosTablaHTML() // Aquí usamos la función de arriba
    };

    socket.emit('jugadaRealizada', datosAEnviar);
    console.log("Datos de la jugada enviados al servidor...",datosAEnviar);

}

// ------------------------------------------------------------------------------------------------------//
// ----------------------- INICIO BWS Codigo General ----------------------------------------------------//
// ------------------------------------------------------------------------------------------------------//

// Defino cartasMaestro como todas las cartas ordenadas 

var definicionCartas = [

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

// --------------------------------- MEZCLAR LAS CARTAS EN ARRAY  ------------------------------//

var cartasMaestro = definicionCartas.sort(function() {return Math.random() - 0.5});

// ---------------------------------------------------------------------------------------------//

var _jugadores = [["Sin Asignar",true,true,true,true],["Sin Asignar",true,true,true,true],["Sin Asignar",true,true,true,true],["Sin Asignar",true,true,true,true]]

// _valorIndice es quien define el numero de jugada 

var _valorIndice = 0;	// Numero de jugada, indice de las cartas 
var _turnoJugador = 0; 	// turno
var _jugarCartas = true; // para validar que si ya jugo carta no haga click en otra carta ( maso o mano )
var _jugoDeLaMano = false; // flag para saber si el jugador jugo de la mano ... ( defecto false )
var _valorIndiceGraficas = 0; // Numero de jugada para las graficas ( )

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

//--------------------------------------------------- ALMACENAMIENTO EN LOCAL STORAGE ---------------------------------------------//

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
	document.getElementById('ValorHeineken').innerHTML = _valorHeineken ;
	document.getElementById('ValorGatorade').innerHTML = _valorGatorade ;
	document.getElementById('ValorMcDonalds').innerHTML = _valorMcDonalds ;
	document.getElementById('ValorNike').innerHTML = _valorNike ;
	document.getElementById('MInteractivoTituloMaso').innerHTML = "Movimientos : " + String(_valorIndice) + "/68";
	document.getElementById('CartaJugada').src = cartasMaestro[_valorIndice-1][2];
	

	document.getElementById("Jugador"+String(_turnoJugador+1)+"_Linea").style= "border-color: red; border-width: 0.5px;" ;
	document.getElementById("Jugador"+String(_turnoJugador+1)+"_V_Linea").style= "border-color: red; border-width: 0.5px;" ;

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
	document.getElementById('ValorHeineken').innerHTML = _valorHeineken ;
	document.getElementById('ValorGatorade').innerHTML = _valorGatorade ;
	document.getElementById('ValorMcDonalds').innerHTML = _valorMcDonalds ;
	document.getElementById('ValorNike').innerHTML = _valorNike ;
	document.getElementById('MInteractivoTituloMaso').innerHTML = "Movimientos : " + String(_valorIndice) + "/68";
	

	document.getElementById("Jugador"+String(_turnoJugador+1)+"_Linea").style= "border-color: red; border-width: 0.5px;" ;
	document.getElementById("Jugador"+String(_turnoJugador+1)+"_V_Linea").style= "border-color: red; border-width: 0.5px;" ;

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

	console.log("======== "+_desdeDondeLlaman+" ==========");
	console.log("Valor del Inidice ( jugada ) : ",_valorIndice+" Carta : "+cartasMaestro[_valorIndice][1]+" - "+cartasMaestro[_valorIndice][0]);
	console.log("Turno del jugador            : ",_turnoJugador+" Nombre : " + _jugadores[_turnoJugador],[0]);
	console.log("Valor Heineken 			  : ",_valorHeineken);
	console.log("Valor NikeX2 				  : ",_valorNike);
	console.log("Valor McDondals 			  : ",_valorMcDonalds);
	console.log("Valor Gatorade 			  : ",_valorGatorade);
}

// ------------------------------------------------------ JUGAR CARTAS COMPLETAR --------------------------------------------------//

function jugarCartasCompletar(_esDelMaso,_queCarta) {

	var _valorIndiceAUX 

	if (_esDelMaso) {

		_valorIndiceAUX = _valorIndice;

	}else {

		_valorIndiceAUX = _queCarta;

	}

	debugBws(" Completar Jugada desde el Maso - parte 1 ");
	// si la carta es 1000, se va sin abrir el popup. 
	// esta funcion es para abrir el popup para determinar quien sube o baja ( sustituir el punto segun lo que elija el usr )

	if (cartasMaestro[_valorIndiceAUX][0]=="1000") {
		terminarJugadaCartas("parametro no necesario, no chequea marca cuando es 1000",_valorIndiceAUX);
		finalizarJugada();
//		alert("carta 1000");
		return;
	}

	// Como no podemos crear una cadena con mas de 2 comillas , no se pudo pasar texto a la funcion 
	// del onclick del radio ( cada uno ) . Entonces cada empresa se paso anumero 

	// 1 Heineken
	// 2 Gatorade
	// 3 Nike
	// 4 MacDonalds 


  	// Open a new window
 

  	var myWindow = window.open("", "myWindow", "width=205,height=158,left = 2590,top = 600");

    myWindow.document.write('<p id="modalTitulo" style="margin-top: 5px;align-self: center; ">'); 
    myWindow.document.write('</p>');
      
	switch (cartasMaestro[_valorIndiceAUX][1]) {

		case "N" :

			switch (cartasMaestro[_valorIndiceAUX][0]) {

				case "600" :

    				myWindow.document.write('<p> Empresa baja 500 </p>');

					break;
	
				case "500" :

   					myWindow.document.write('<p> Empresa sube 600 </p>');

					break;

	
				case "x2" :

   					myWindow.document.write('<p> Empresa / 2 </p>');

					break;
	
				case "/2" :

   					myWindow.document.write('<p> Empresa X 2 </p>');

					break;
		
			}


    		myWindow.document.write('<img src="file:../BWS/_imagenes/PopUpMcDonalds.png">'); 
    		myWindow.document.write('<img src="file:../BWS/_imagenes/PopUpGatorade.png">'); 
    		myWindow.document.write('<img src="file:../BWS/_imagenes/PopUpHeineken.png">'); 

     		myWindow.document.write('<form action="" method="get" style="background-color: none;">');
    		myWindow.document.write('<p>');

    		myWindow.document.write('<input type="radio" name="modalRadio1" id="modal_1_Radio" value="1" style="margin-left: 23px;cursor: pointer;" onclick="javascript:seleccionEmpresaRadio(4)">');
    		myWindow.document.write('<label for="HeinekenValue"></label>');

    		myWindow.document.write('<input type="radio" name="modalRadio2" id="modal_2_Radio" value="2" style="margin-left: 45px;cursor: pointer;" onclick="seleccionEmpresaRadio(2)">');
    		myWindow.document.write('<label for="GatoradeValue"></label>');

    		myWindow.document.write('<input type="radio" name="modalRadio3" id="modal_3_Radio" value="2" style="margin-left: 45px;cursor: pointer;" onclick="seleccionEmpresaRadio(1)">');
   			myWindow.document.write('<label for="NikeValue"></label>');

			break;

		case "H" :

			switch (cartasMaestro[_valorIndiceAUX][0]) {

				case "600" :

    				myWindow.document.write('<p> Empresa baja 500 </p>');

					break;
	
				case "500" :

   					myWindow.document.write('<p> Empresa sube 600 </p>');

					break;

	
				case "x2" :

   					myWindow.document.write('<p> Empresa / 2 </p>');

					break;
	
				case "/2" :

   					myWindow.document.write('<p> Empresa X 2 </p>');

					break;
		
			}


    		myWindow.document.write('<img src="file:../BWS/_imagenes/PopUpMcDonalds.png">'); 
    		myWindow.document.write('<img src="file:../BWS/_imagenes/PopUpGatorade.png">'); 
    		myWindow.document.write('<img src="file:../BWS/_imagenes/PopUpNike.png">'); 	

     		myWindow.document.write('<form action="" method="get" style="background-color: none;">');
    		myWindow.document.write('<p>');

    		myWindow.document.write('<input type="radio" name="modalRadio1" id="modal_1_Radio" value="1" style="margin-left: 23px;cursor: pointer;" onclick="seleccionEmpresaRadio(4)">');
    		myWindow.document.write('<label for="HeinekenValue"></label>');

    		myWindow.document.write('<input type="radio" name="modalRadio2" id="modal_2_Radio" value="2" style="margin-left: 45px;cursor: pointer;" onclick="seleccionEmpresaRadio(2)">');
    		myWindow.document.write('<label for="GatoradeValue"></label>');

    		myWindow.document.write('<input type="radio" name="modalRadio3" id="modal_3_Radio" value="3" style="margin-left: 45px;cursor: pointer;" onclick="seleccionEmpresaRadio(3)">');
   			myWindow.document.write('<label for="NikeValue"></label>');


    		break;

		case "G" :

			switch (cartasMaestro[_valorIndiceAUX][0]) {

				case "600" :

    				myWindow.document.write('<p> Empresa baja 500 </p>');

					break;
	
				case "500" :

   					myWindow.document.write('<p> Empresa sube 600 </p>');

					break;

	
				case "x2" :

   					myWindow.document.write('<p> Empresa / 2 </p>');

					break;
	
				case "/2" :

   					myWindow.document.write('<p> Empresa X 2 </p>');

					break;
		
			}


    		myWindow.document.write('<img src="file:../BWS/_imagenes/PopUpMcDonalds.png">'); 
    		myWindow.document.write('<img src="file:../BWS/_imagenes/PopUpHeineken.png">'); 
    		myWindow.document.write('<img src="file:../BWS/_imagenes/PopUpNike.png">'); 	

     		myWindow.document.write('<form action="" method="get" style="background-color: none;">');
    		myWindow.document.write('<p>');

    		myWindow.document.write('<input type="radio" name="modalRadio1" id="modal_1_Radio" value="1" style="margin-left: 23px;cursor: pointer;" onclick="seleccionEmpresaRadio(4)">');
    		myWindow.document.write('<label for="HeinekenValue"></label>');

    		myWindow.document.write('<input type="radio" name="modalRadio2" id="modal_2_Radio" value="2" style="margin-left: 45px;cursor: pointer;" onclick="seleccionEmpresaRadio(1)">');
    		myWindow.document.write('<label for="GatoradeValue"></label>');

    		myWindow.document.write('<input type="radio" name="modalRadio3" id="modal_3_Radio" value="3" style="margin-left: 45px;cursor: pointer;" onclick="seleccionEmpresaRadio(3)">');
   			myWindow.document.write('<label for="NikeValue"></label>');


    		break;

		case "M" :

			switch (cartasMaestro[_valorIndiceAUX][0]) {

				case "600" :

    				myWindow.document.write('<p> Empresa baja 500 </p>');

					break;
	
				case "500" :

   					myWindow.document.write('<p> Empresa sube 600 </p>');

					break;

	
				case "x2" :

   					myWindow.document.write('<p> Empresa / 2 </p>');

					break;
	
				case "/2" :

   					myWindow.document.write('<p> Empresa X 2 </p>');

					break;
		
			}


    		myWindow.document.write('<img src="file:../BWS/_imagenes/PopUpHeineken.png">'); 
    		myWindow.document.write('<img src="file:../BWS/_imagenes/PopUpGatorade.png">'); 
    		myWindow.document.write('<img src="file:../BWS/_imagenes/PopUpNike.png">'); 	

     		myWindow.document.write('<form action="" method="get" style="background-color: none;">');
    		myWindow.document.write('<p>');

    		myWindow.document.write('<input type="radio" name="modalRadio1" id="modal_1_Radio" value="1" style="margin-left: 23px;cursor: pointer;" onclick="seleccionEmpresaRadio(1)">');
    		myWindow.document.write('<label for="HeinekenValue"></label>');

    		myWindow.document.write('<input type="radio" name="modalRadio2" id="modal_2_Radio" value="2" style="margin-left: 45px;cursor: pointer;" onclick="seleccionEmpresaRadio(2)">');
    		myWindow.document.write('<label for="GatoradeValue"></label>');

    		myWindow.document.write('<input type="radio" name="modalRadio3" id="modal_3_Radio" value="3" style="margin-left: 45px;cursor: pointer;" onclick="seleccionEmpresaRadio(3)">');
   			myWindow.document.write('<label for="NikeValue"></label>');


    		break;


	}

    myWindow.document.write('<br>');
 //   myWindow.document.write('<br>');
 //   myWindow.document.write('<input id="modalEjecutar" type="button" value="EJECUTAR" onclick = "javascript:seleccionEmpresaRadio(400);">');

    myWindow.document.write('</p>');
    myWindow.document.write('</form>');    
		
    myWindow.seleccionEmpresaRadio = function(_popUpRadio){
//    	myWindow.opener.just_a_variable = v; 
    	myWindow.close();
  		switch (_popUpRadio) {

				case 1 :
 					myWindow.opener.terminarJugadaCartas("H",_valorIndiceAUX);
  					break;
				case 2 :
 					myWindow.opener.terminarJugadaCartas("G",_valorIndiceAUX);
  					break;	
				case 3 :
 					myWindow.opener.terminarJugadaCartas("N",_valorIndiceAUX);
  					break;
				case 4 :
 					myWindow.opener.terminarJugadaCartas("M",_valorIndiceAUX);
  					break;

			}  	
    }



}



// --------------------------------- ASIGNACION DE JUGADORES -------------------------------//

function asignacionInicialJugadores() {

	var _auxLocal = 1;

	while ( _auxLocal < 5) {

		if (document.getElementById("altasJ"+String(_auxLocal)).value != "..." ) {

			document.getElementById("Jugador"+String(_auxLocal)+"_Nombre").innerHTML = document.getElementById("altasJ"+String(_auxLocal)).value;
			document.getElementById("Jugador"+String(_auxLocal)+"_V_Nombre").innerHTML = document.getElementById("altasJ"+String(_auxLocal)).value;
			document.getElementById("Jugador"+String(_auxLocal)+"_Total").innerHTML = num2Format(4000);
			document.getElementById("Jugador"+String(_auxLocal)+"_Cash").innerHTML = "0";
			document.getElementById("Jugador"+String(_auxLocal)+"_Heineken").innerHTML = "1";
			document.getElementById("Jugador"+String(_auxLocal)+"_Gatorade").innerHTML = "1";
			document.getElementById("Jugador"+String(_auxLocal)+"_Nike").innerHTML = "1";
			document.getElementById("Jugador"+String(_auxLocal)+"_McDonalds").innerHTML = "1";

			_jugadores[_auxLocal - 1][0] = document.getElementById("altasJ"+String(_auxLocal)).value;
			_auxLocal = _auxLocal + 1;
			_valorIndice = _valorIndice + 4;

		}else{

			_auxLocal = 100;	

		}	

	}

	document.getElementById('TurnoJugador').innerHTML = _jugadores[_turnoJugador][0];
	document.getElementById("Jugador1_Linea").style= "border-color: red; border-width: 0.5px;" ;
	document.getElementById("Jugador1_V_Linea").style= "border-color: red; border-width: 0.5px;" ;

	document.getElementById("Finalizar").style = "background-color : grey;";
	document.getElementById("Finalizar").disabled = true;

	dibujoGraficaBarras(_valorHeineken,_valorGatorade,_valorNike,_valorMcDonalds);
	grafcaLineal(); 
	mostrarCartasJugador();

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

		debugBws(" Calculo de TOPES ")	;


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
				console.log(">>>> quebro Heineken ")
			}

		}


	}

	if (_valorGatorade < 100 ) {

		_valorGatorade = 100 ;

		for (var i=0;i<4;i++) {

			if (_jugadores[i][0] != "Sin Asignar") {

				document.getElementById("Jugador"+String(i+1)+"_Gatorade").innerHTML = 0;
				console.log(">>>> quebro Gatorade ")
			}

		}

	}

	if (_valorMcDonalds < 100 ) {

		_valorMcDonalds = 100 ;

		for (var i=0;i<4;i++) {

			if (_jugadores[i][0] != "Sin Asignar") {

				document.getElementById("Jugador"+String(i+1)+"_McDonalds").innerHTML = 0;
				console.log(">>>> quebro McDonalds ")
			}

		}
	}

	if (_valorNike < 100 ) {

		_valorNike = 100 ;

		for (var i=0;i<4;i++) {

			if (_jugadores[i][0] != "Sin Asignar") {

				document.getElementById("Jugador"+String(i+1)+"_Nike").innerHTML = 0;
				console.log(">>>> quebro Nike ")
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

	var _estadoCombo ; 
	var _valorAccion ;
	var _auxUserCash ;
	var _auxUserInput ;
	var _auxUserAcciones ;


	
	// esta variable compone al nodo a operar . Jugador + Empresa . Nodo de la lista .

	var _nodoJugadorAccion ;

	if (document.getElementById("H_Radio").checked) {

		_nodoJugadorAccion = "Jugador"+String(_turnoJugador+1)+"_Heineken";
		_valorAccion = _valorHeineken;

	}else if (document.getElementById("G_Radio").checked){

		_nodoJugadorAccion = "Jugador"+String(_turnoJugador+1)+"_Gatorade";
		_valorAccion = _valorGatorade;

	}else if (document.getElementById("M_Radio").checked){

		_nodoJugadorAccion = "Jugador"+String(_turnoJugador+1)+"_McDonalds";
		_valorAccion = _valorMcDonalds;

	}else if (document.getElementById("N_Radio").checked){

		_nodoJugadorAccion = "Jugador"+String(_turnoJugador+1)+"_Nike";
		_valorAccion = _valorNike;

	}

	_estadoCombo = document.getElementById('ComboBox').value ;
	_auxUserCash = Number(format2Num(document.getElementById("Jugador"+String(_turnoJugador+1)+"_Cash").innerHTML));
	_auxUserInput = Number(format2Num(document.getElementById("CantidadInput").value));
	_auxUserAcciones = Number(format2Num(document.getElementById(_nodoJugadorAccion).innerHTML));

	// --- comprar --- //

	if (_estadoCombo == 'C') {


		if ( _auxUserInput * _valorAccion <= _auxUserCash ) {

			document.getElementById(_nodoJugadorAccion).innerHTML = num2Format(_auxUserAcciones + _auxUserInput);

//			alert(document.getElementById("Jugador"+String(_turnoJugador+1)+"_Cash").innerHTML);
//			alert(Number(document.getElementById("Jugador"+String(_turnoJugador+1)+"_Cash").innerHTML));
//			alert(num2Format((Number(document.getElementById("Jugador"+String(_turnoJugador+1)+"_Cash").innerHTML)-(_auxUserInput * _valorAccion))));
	
			document.getElementById("Jugador"+String(_turnoJugador+1)+"_Cash").innerHTML=num2Format((Number(format2Num(document.getElementById("Jugador"+String(_turnoJugador+1)+"_Cash").innerHTML))-(_auxUserInput * _valorAccion)));


		}

	}else if (_estadoCombo == 'V') {

		if ( _auxUserInput <= _auxUserAcciones ) {

			document.getElementById(_nodoJugadorAccion).innerHTML = num2Format(_auxUserAcciones - _auxUserInput);
			document.getElementById("Jugador"+String(_turnoJugador+1)+"_Cash").innerHTML=num2Format((Number(format2Num(document.getElementById("Jugador"+String(_turnoJugador+1)+"_Cash").innerHTML))+(_auxUserInput * _valorAccion)));


		}


	}

	debugBws("Boton : EJECUTAR  ")	;

	calcularTotalJugadores();

	document.getElementById("CantidadInput").value ="";
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

	var _empresaElegida ;


// habilito el boton finalizar 

	document.getElementById("Finalizar").style = "background-color : red;";
	document.getElementById("Finalizar").disabled = false;

//	document.getElementById('CartaMaso').src = "_imagenes/MasoVacio.png";
	_jugarCartas = false;

// detiene el maso ... 




// VERIFICO que no haya terminado el juego 

	if (_valorIndice > 67) {
	
		document.getElementById('CartaMaso').src = "_imagenes/MasoVacio.png";
		alert("El juego ha finalizado");
		return ;

	}


//	console.log (_valorIndice + " " + cartasMaestro[_valorIndice][2]);

// MUESTRO LA CARTA PRIMERO 

	document.getElementById('CartaJugada').src = cartasMaestro[_valorIndice][2];

//	var xBorrar = 0; 

//	for (var i=1; i < 50 ;i++){

//		xBorrar = xBorrar + 1 ;
//		console.log(xBorrar);

//	}
	//alert(document.getElementById('CartaJugada').src);
	debugBws("** CARTAS DEL MASO **")	;

	jugarCartasCompletar(true,0);

}else{

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


	document.getElementById('ValorHeineken').innerHTML = _valorHeineken ;
	document.getElementById('ValorGatorade').innerHTML = _valorGatorade ;
	document.getElementById('ValorMcDonalds').innerHTML = _valorMcDonalds ;
	document.getElementById('ValorNike').innerHTML = _valorNike ;
	
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

// --- CONEXIÓN MULTIJUGADOR ---
// Enviamos los nuevos valores al servidor para que los distribuya
//let datosParaSincronizar = {
//    heineken: _valorHeineken,
//    gatorade: _valorGatorade,
//    nike: _valorNike,
//    mcdonalds: _valorMcDonalds
    // Aquí podemos agregar más cosas luego (quién compró qué, etc.)
//};

//socket.emit('jugadaRealizada', datosParaSincronizar);
//console.log("Datos de la jugada enviados al servidor...");

enviarEstadoAlServidor();

}

// --------------------------------------------- Boton Finalizar Jugada --------------------------------- //

function finalizarJugada() {

	debugBws(" Boton Finalizar jugada / jugador  ")	;

// vacio el maso de cartas 

	document.getElementById("Finalizar").style = "background-color : grey;";
	document.getElementById("Finalizar").disabled = true;

	document.getElementById('CartaMaso').src = "_imagenes/CartaEjemploAtras.png";
	_jugarCartas = true;

	// valido si el user jugo de la mano o del maso 
	// en caso de jugar de la mano, el indice no sumaria ya que esa carta ya habia 
	// sido descontada en el inicio del juego por cartas de lamano repartidas .

	if (_jugoDeLaMano==false) {
		_valorIndice = _valorIndice + 1 ;
	}

	// suma uno al indice de las grafiacs , que es el mismo pero por las cartas del maso y su metodo 
	// el valor indice grafica es el que corresponde al numero de jugada (para su grafica y datos ) 
	// pero el valor indice es quien hace todo en el sistema .
	// valor indice grafica es solo para que las grafiacs esten consecutivas 

	_valorIndiceGraficas = _valorIndiceGraficas + 1 ; 

	// forzo a la variable de jugar de la mano en false de nuevo por si se puso en true al jugar

	_jugoDeLaMano = false;

	if (_valorIndice > 67) {	
		document.getElementById('CartaMaso').src = "_imagenes/MasoVacio.png";
	}

	// despliego el numero de carta ya sumado en 1 para no iniciar en 0 

	document.getElementById('MInteractivoTituloMaso').innerHTML = "Movimientos : " + String(_valorIndice) + "/68";

	// este loop es para buscar al primer siguiente asignado. Sino hace loop.
	// este metodo es temporal. Tener cuidado de no entrar en loop sino hay usuairos
	document.getElementById("Jugador"+String(_turnoJugador+1)+"_Linea").style= "border-style:none;" ;
	document.getElementById("Jugador"+String(_turnoJugador+1)+"_V_Linea").style= "border-style:none;" ;

	while (true) {

		_turnoJugador = _turnoJugador + 1 ;

		if (_turnoJugador > 3) {
			_turnoJugador = 0 ;
		}

		if (_jugadores[_turnoJugador][0]!="Sin Asignar" ) {
			break;
		}


	}

	document.getElementById('TurnoJugador').innerHTML = _jugadores[_turnoJugador][0];

	document.getElementById("Jugador"+String(_turnoJugador+1)+"_Linea").style= "border-style: solid; border-color: red; border-width: 0.5px;" ;
	document.getElementById("Jugador"+String(_turnoJugador+1)+"_V_Linea").style= "border-style: solid; border-color: red; border-width: 0.5px;" ;

	document.getElementById("Finalizar").disabled = true;
	document.getElementById("M_Radio").disabled = false;
	document.getElementById("G_Radio").disabled = false;
	document.getElementById("H_Radio").disabled = false;
	document.getElementById("N_Radio").disabled = false;

	// muestro las cartas del jugador 

	mostrarCartasJugador();

	saveDataLocalStorage();

}

// -------------------------------------------------- MOSTRAR CARTAS DEL JUGADOR ---------------------------------------------------- // 

function mostrarCartasJugador() {

	var _auxJ = _turnoJugador ;

	if (_turnoJugador == 1){

		_auxJ = _auxJ + 3 ;

	}else if (_turnoJugador == 2 ){

		_auxJ = _auxJ + 6 ;

	}else if (_turnoJugador == 3 ){

		_auxJ = _auxJ + 9 ;

	}

	for (var i=0;i<4;i++) {
//		alert(_turnoJugador);
//		alert(_jugadores[_turnoJugador][i+1]);

		if (_jugadores[_turnoJugador][i+1]) {
			document.getElementById('CartaMaso'+String(i+1)).src = cartasMaestro[_auxJ+i][2];
		}else{
			document.getElementById('CartaMaso'+String(i+1)).src = "_imagenes/CartaEjemploAtras.png";
		}
	}
	document.getElementById("CartaMaso1").disabled = false;
	document.getElementById("CartaMaso2").disabled = false;
	document.getElementById("CartaMaso3").disabled = false;
	document.getElementById("CartaMaso4").disabled = false;

// alert(cartasMaestro);
}

// ---------------------------------------------- JUGAR CARTA DE LA MANO ---------------------------------------------------------- //

function jugadaCartaDeLaMano(_CartaElegida) {

if (_valorIndice > 67) {
	
		document.getElementById('CartaMaso').src = "_imagenes/MasoVacio.png";
		alert("El juego ha finalizado");

	}
else if (_jugadores[_turnoJugador][_CartaElegida+1] && _jugarCartas) {

//	alert(_CartaElegida);
	var _auxJ = _turnoJugador ;

	if (_turnoJugador == 1){
		_auxJ = _auxJ + 3 ;
	}else if (_turnoJugador == 2 ){
		_auxJ = _auxJ + 6 ;
	}else if (_turnoJugador == 3 ){
		_auxJ = _auxJ + 9 ;
	}

	var _empresaElegida ;


// habilito el boton finalizar 

	document.getElementById("Finalizar").style = "background-color : red;";
	document.getElementById("Finalizar").disabled = false;
	document.getElementById('CartaMaso'+String(_CartaElegida+1)).src = "_imagenes/CartaEjemploAtras.png";

	// pongo la carta en false y que jugarcartas en false que significa que ya se jugo una.
	_jugadores[_turnoJugador][_CartaElegida+1] = false;
	_jugarCartas = false; 

	// setep el flag de si el user jugo de la mano, en true. sirve para que en el boton de finaliza 
	// no le sume al indice de cartas ya que las cartas de la mano se descuentan antes de empezar . 

	_jugoDeLaMano = true;

	document.getElementById("CartaMaso1").disabled = true;
	document.getElementById("CartaMaso2").disabled = true;
	document.getElementById("CartaMaso3").disabled = true;
	document.getElementById("CartaMaso4").disabled = true;


// MUESTRO LA CARTA PRIMERO 
	document.getElementById('CartaJugada').src = cartasMaestro[[_auxJ+_CartaElegida]][2];
	jugarCartasCompletar(false,_auxJ+_CartaElegida);


}else{

	alert("El jugador ya jugo su carta y no puede volver a jugar otra hasta su proximo turno ");

}

}

// ================================================================================================================================== //
// ================================================== GRAFICA DE BARRAS ============================================================= //
// ================================================================================================================================== //

function dibujoGraficaBarras(_Heineken,_Gatorade,_Nike,_McDonalds) {

    var myCanvas = document.getElementById("canvasBarras");


    myCanvas.width = 390;
    myCanvas.height = 550;
    myCanvas.border = true;
  
    var ctx = myCanvas.getContext("2d");
    var myVinyls = {
        "Heineken": _Heineken,
        "Gatorade": _Gatorade,
        "Nike": _Nike,
        "McDonalds": _McDonalds
    };
      // ======
    var Barchart = function(options){
        this.options = options;
        this.canvas = options.canvas;
        this.ctx = this.canvas.getContext("2d");
        this.colors = options.colors;

        this.draw = function(){
          
          var maxValue = 0;
          for (var categ in this.options.data){
             maxValue = Math.max(maxValue,this.options.data[categ]);
          }
          maxValue = 2500;
 
          var canvasActualHeight = this.canvas.height - this.options.padding * 2;
  
          var canvasActualWidth = this.canvas.width - this.options.padding * 2;
          //drawing the grid lines
 /*         var gridValue = 0;
          while (gridValue <= maxValue){
            var gridY = canvasActualHeight * (1 - gridValue/maxValue) + this.options.padding;
            drawLine(
                this.ctx,
                0,
                gridY,
                this.canvas.width,
                gridY,
                this.options.gridColor
            );
             
            //writing grid markers
            this.ctx.save();
            this.ctx.fillStyle = this.options.gridColor;
            this.ctx.font = "bold 10px Arial";
            this.ctx.fillText(gridValue, 10,gridY - 2);
            this.ctx.restore();

            gridValue+=this.options.gridScale;
          }
  */ 
           //drawing the bars
        var barIndex = 0;
        var numberOfBars = Object.keys(this.options.data).length;
        var barSize = (canvasActualWidth)/numberOfBars;
 
        for (categ in this.options.data){
            var val = this.options.data[categ];
            var barHeight = Math.round( canvasActualHeight * val/maxValue) ;
            drawBar(
                this.ctx,
                this.options.padding + barIndex * barSize,
                this.canvas.height - barHeight - this.options.padding,
                barSize,
                barHeight,
                this.colors[barIndex%this.colors.length]
            );
 
            barIndex++;
        }
  
      }
    }

    function drawLine(ctx, startX, startY, endX, endY,color){

        ctx.save();
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(startX,startY);
        ctx.lineTo(endX,endY);
        ctx.stroke();
        ctx.restore();
    }      

    function drawBar(ctx, upperLeftCornerX, upperLeftCornerY, width, height,color){

        ctx.save();
        ctx.fillStyle=color;
        ctx.fillRect(upperLeftCornerX,upperLeftCornerY,width,height);
        ctx.restore();
    }

    var myBarchart = new Barchart( {
        canvas:myCanvas,
        padding:10,
        gridScale:5,
        gridColor:"#eeeeee",
        data:myVinyls,
 //       colors:["rgb(63,157,32)","rgb(124,124,124)", "rgb(192,64,64)","rgb(192,192,69)"]
       colors:["darkgreen","grey", "darkred","orange"]
    }
    );

    myBarchart.draw();
}
//}

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

	var _graficaLineaEmpresasCanvas = document.getElementById("popChart").getContext("2d");

	_graficaLineaEmpresasCanvas.width = 733;
	_graficaLineaEmpresasCanvas.height = 305;
	_graficaLineaEmpresasCanvas.border = true;

	if (_queGraficaVa == "A") {

		// cargo los datos para la grafica de empresas 

		var _lineaHeineken = {
 	 		label: "Heineken",
 	 		data: _logHeineken,
 	 		lineTension: 0,
  			fill: false,  
  			borderColor: 'green',
		};
   
		var _lineaGatorade = {
 	 		label: "Gatorade",
 	 		data: _logGatorade,
	  		lineTension: 0,
	  		fill: false,
	  		borderColor: 'grey',
 
		};

 	 	var _lineaNike = {
 	 		label: "Nike",
  			data: _logNike,
  			lineTension: 0,
  			fill: false,  
 	 		borderColor: 'red',
		};

		var _lineaMcDonalds = {
 	 		label: "McDonalds",
 	 		data: _logMcDonalds,
  			lineTension: 0,
 	 		fill: false,  
 	 		borderColor: 'yellow',

		};

		var speedData = {
 	 		labels: _logLabels,
	  		datasets: [_lineaHeineken,_lineaGatorade,_lineaNike,_lineaMcDonalds]
		};
 	}

	else {

		// cargo los datos para la grafica de jugadores 	

		var _lineaJ1 = {
 	 		label: _jugadores[0][0],
 	 		data: _logJugador_1,
 	 		lineTension: 0,
  			fill: false,  
  			borderColor: 'blue',
		};
   
		var _lineaJ2 = {
 	 		label: _jugadores[1][0],
 	 		data: _logJugador_2,
	  		lineTension: 0,
	  		fill: false,
	  		borderColor: 'brown',
 
		};

 	 	var _lineaJ3 = {
 	 		label: _jugadores[2][0],
  			data: _logJugador_3,
  			lineTension: 0,
  			fill: false,  
 	 		borderColor: 'grey',
		};

		var _lineaJ4 = {
 	 		label: _jugadores[3][0],
 	 		data: _logJugador_4,
  			lineTension: 0,
 	 		fill: false,  
 	 		borderColor: 'orange',

		};

		var speedData = {
 	 		labels: _logLabels,
	  		datasets: [_lineaJ1,_lineaJ2,_lineaJ3,_lineaJ4]
		};
 	
 	}

	var lineChart = new Chart(_graficaLineaEmpresasCanvas, {
 	 	type: 'line',
 	 	data: speedData,
 	    options: {
  		    responsive: false,
  		    maintainAspectRatio: false,
 		    scales: {
           	yAxes: [{
 	            ticks: {
               	beginAtZero:true
               	}
           	}]
       		}	  
       	}	
 	}

	);

	

}
