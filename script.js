//********************************     VARIABLES  ******************************** /
// ---------- Variables HTML ----------
// Elementos de registro
const btnRegistro = document.querySelector('#btn-abrir-cuenta');
const formContainer = document.querySelector('.container-form-registro');
const formulario = document.querySelector('#formulario-principal');
const btnSalirForm = document.querySelectorAll('img.icono-x');
const idInput = document.getElementById('fid');
const nombreInput = document.getElementById('fnombre');
const apellidoInput = document.getElementById('fapellido');
const nacimientoInput = document.getElementById('fnacimiento');
const contrasenaInput = document.getElementById('fcontrasena');
// Elementos de Iniciar sesion
const iniciarSesionContainer = document.querySelector('.container-form-iniciar-sesion');
const btnIniciarSesion = document.querySelector('#btn-iniciar-sesion');
const formularioIniciarSesion = document.querySelector('#formulario-principal-iniciar-sesion')
const btnSalirCuenta = document.querySelector('#salir-sesion-cuenta')
const uiCuenta = document.querySelector('.inicio-oculto')
const navbar = document.querySelector('.container-navbar')
// Simulador de credito
const btnSimuladorCredito = document.querySelector('#simulador-credito a')


// ----- Variables  -----
let cliente;
let numCuentasBancarias = [];
let cuentasBancarias = [];

//********************************  EVENTOS   ******************************** /

eventoslistener()
function eventoslistener(){
    // ----- Evento al cargar la pagina, para que se llenen los datos -----
    document.addEventListener('DOMContentLoaded', (e) => {
            //Cargar fecha
            maximaFechaInput();
            //Dar clic en X para salir de cualquier formulario
            salirDelFormulario()
        })
    btnRegistro.addEventListener('click', (e) => {
     formContainer.classList.add('form-registro-is-active');
    })
    btnIniciarSesion.addEventListener('click', (e) => {
        iniciarSesionContainer.classList.add('form-iniciar-sesion-is-active')
    })
    
    // ----- Evento para validar datos y resgistrar cuenta -----
    idInput.addEventListener('focusout', validarDatosInput);
    nombreInput.addEventListener('focusout', validarDatosInput);
    apellidoInput.addEventListener('focusout', validarDatosInput);
    nacimientoInput.addEventListener('focusout', validarDatosInput);
    contrasenaInput.addEventListener('focusout', validarDatosInput);
    formulario.addEventListener('submit', validarFormulario);
    //-------- Eventos para iniciar sesion --------------------------
    formularioIniciarSesion.addEventListener('submit', validarIniciosesion)
    btnSalirCuenta.addEventListener('click', salirSesionCuenta)
    //-------- Eventos para simulador de credito --------------------------
    btnSimuladorCredito.addEventListener('click', simuladorCredito)

}

//********************************    CLASES    ******************************** /

//! ---------- 1. Crear registro  --------------------------------------

class Cuenta{
    constructor( id, nombre, apellido, nacimiento, clave ){
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.nacimiento = nacimiento;
        this.numeroCuenta = this.generarNumeroCuenta();
        this.saldo = 0;
        this.transfereciaRealizada = 0;
        this.clave = clave;
        this.movimientos = []
    }
    generarNumeroCuenta(){
        this.numeroCuenta = (Math.floor(Math.random() * 100000000)).toString();
        while ( numCuentasBancarias.includes(this.numeroCuenta) ){
            this.numeroCuenta = (Math.floor(Math.random() * 100000000)).toString();
        }
        numCuentasBancarias.push(this.numeroCuenta);
        return this.numeroCuenta;
    }

}

//! ---------- 3.Simulador de credito  ------------------------------
class Credito{
    constructor(monto, anios, tipoCredito){
        this.monto = monto;
        this.anios = anios;
        this.tipoCredito = tipoCredito;
    }

    calcularCredito(){
        const interes = 0.092
        const montoCredito = parseFloat(this.monto) * (1+interes)
        const meses = parseFloat(this.anios) * 12
        alert(`El monto total a pagar de su crédito es de $${(montoCredito).toFixed(2)}, por ${meses} meses.
               Su pago mensual es de $${(montoCredito/meses).toFixed(2)}.`)
    }
}
//********************************    FUNCIONES  ******************************** /

//! ---------- 1. Crear registro al validar los datos --------------------
function validarDatosInput(e){
    if( e.target.value === ''){
        mostrarMensaje('*Este campo es obligatorio', 'error');
        return;
    }
}
function validarFormulario(e){
    e.preventDefault()

    const id = idInput.value;
    const nombre = nombreInput.value;
    const apellido = apellidoInput.value;
    const nacimiento = nacimientoInput.value;
    const clave = contrasenaInput.value;

    if( id === '' | nombre === '' | apellido === '' | nacimiento === '' | clave === '' ){
        mostrarMensaje('**Todos los campos son obligatorios', 'error');
        return;
    }

    formulario.reset();
    formContainer.classList.remove('form-registro-is-active');
    registrarCuenta(id, nombre, apellido, nacimiento, clave);
}
function registrarCuenta(id, nombre, apellido, nacimiento, clave){
   
    cliente = new Cuenta( id, nombre, apellido, nacimiento, clave );
    cuentasBancarias = [ ...cuentasBancarias, cliente];

    alert('Su cuenta ha sido creada exitosamente');
    console.table(cuentasBancarias);

}
//! ---------- Iniciar sesion ----------------------------------------
function validarIniciosesion(e){
    e.preventDefault()

    const idInicioSesion = document.querySelector('#id').value
    const contrasenaInicioSesion = document.querySelector('#contrasena').value
   
    const existeID = cuentasBancarias.find( cuenta => cuenta.id === idInicioSesion )

    if(existeID){
        const existeContrasena = existeID.clave === contrasenaInicioSesion
        if(existeContrasena){
            mostrarMensaje('Sesión iniciada correctamente')
            setTimeout(() => {
                iniciarSesionContainer.classList.remove('form-iniciar-sesion-is-active');
                iniciarCuenta(existeID)
            }, 3000);
        }else{
            mostrarMensaje('La contrasena ingresada es inválida.', 'error')
            console.log('error clave')
            return;
        }
    }else{
        mostrarMensaje('El ID ingresado es inválido.', 'error') 
        return;   
    }
}
function iniciarCuenta(clienteObjeto){
    
    uiCuenta.style.display = 'block'
    navbar.style.display = 'none'

    const mensajeBienvenida = document.querySelector('.mensaje-bienvenida')
    const infoCliente = document.querySelector('.informacion-cliente')

    const {id, nombre, apellido, nacimiento, numeroCuenta, saldo, transfereciaRealizada, movimientos} = clienteObjeto
    mensajeBienvenida.innerHTML = `¡Bienvenid@ ${nombre}!`
    infoCliente.innerHTML = `
        <ul>
            <li>
                <div class='datos-cliente'><strong>ID:  </strong>${id}</div>
            </li>
            <li>
                <div class='datos-cliente'><strong>Nombres:  </strong>${nombre} ${apellido}</div>
            </li>
            <li><div class='datos-cliente'><strong>Fecha de nacimiento:  </strong>${nacimiento}</div></li>
            <li><div class='datos-cliente'><strong>Nº cuenta:  </strong>${numeroCuenta}</div></li>
            <li><div class='datos-cliente'><strong>Saldo:  </strong>${saldo}</div></li>
            <li><div class='datos-cliente'><strong>Transferencias realizadas:  </strong>${transfereciaRealizada}</div></li>  
        </ul>
    `
    cargarResumenMovimientos(movimientos)
}
function cargarResumenMovimientos(movimientosCuenta){

}
//! ---------- 3. Funcion Simulador de Credito -----------------------
function simuladorCredito(){
    let montoIngresado = prompt('Ingrese el monto de su crédito:', 0);
    while( isNaN(montoIngresado) || parseFloat(montoIngresado) == 0){
        montoIngresado = prompt('Ingrese el monto de su crédito:', 0);
    }

    let aniosIngresados = prompt('Ingrese el tiempo del credito en años: ', 0);
    while( isNaN(aniosIngresados) || parseFloat(aniosIngresados) == 0 ){
        aniosIngresados = prompt('Ingrese el tiempo del credito en años: ', 0);
    }

    let tipoCreditoIngresado = prompt('Ingrese el tipo de crédito: ');
    while( tipoCreditoIngresado == '' || !isNaN(tipoCreditoIngresado) ){
        tipoCreditoIngresado = prompt('Ingrese el tipo de crédito: ');
    }
    let credito = new Credito(montoIngresado, aniosIngresados, tipoCreditoIngresado);
    
    credito.calcularCredito();
}
//! --------------- Funciones para la interfaz de usuario ---------------
//Carga a fecha maxima que puede tener el formulario
function maximaFechaInput(){
    const now = new Date();
    let today = now.getFullYear()+"-"+("0" + (now.getMonth() + 1)).slice(-2)+"-"+("0" + now.getDate()).slice(-2);
    nacimientoInput.max = today;
}
// Mostar mensaje de error o de exito si se ha completado algun campo o formulario
function mostrarMensaje(mensaje, tipo){

    const divMensajes  = document.querySelectorAll('.mensaje-info')
    divMensajes.forEach( divMensaje => {
        if( tipo === 'error'){
            divMensaje.classList.add('error');
        }else{
            divMensaje.classList.add('exito');
        }
        divMensaje.textContent = mensaje;
        setTimeout(() => {
            divMensaje.textContent = ''
            divMensaje.classList.remove('error', 'exito')
        }, 3000); 
    })
    return;
}
function salirDelFormulario(){

    for (let i = 0; i < btnSalirForm.length; i++) {

        btnSalirForm[i].addEventListener('click', (e) => {
            formContainer.classList.remove('form-registro-is-active');
            iniciarSesionContainer.classList.remove('form-iniciar-sesion-is-active')
        });
    }
}
function salirSesionCuenta(){
    uiCuenta.style.display = 'none'
    navbar.style.display = 'block'
}