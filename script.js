//********************************     VARIABLES  ******************************** /
// ---------- Variables HTML ----------
// Elementos de registro
const btnRegistro = document.querySelector('#btn-abrir-cuenta');
const formContainer = document.querySelector('.container-form-registro');
const formulario = document.querySelector('#formulario-principal');
const btnSalirForm = document.querySelector('img.icono-x');
const idInput = document.getElementById('fid');
const nombreInput = document.getElementById('fnombre');
const apellidoInput = document.getElementById('fapellido');
const nacimientoInput = document.getElementById('fnacimiento');
const contrasenaInput = document.getElementById('fcontrasena');
// Elementos de Iniciar sesion
const iniciarSesionContainer = document.querySelector('.container-form-iniciar-sesion');
const btnIniciarSesion = document.querySelector('#btn-iniciar-sesion');
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
            maximaFechaInput();
        })
    btnRegistro.addEventListener('click', (e) => {
     formContainer.classList.add('form-registro-is-active');
    })
    btnSalirForm.addEventListener('click', (e)=>{
     formContainer.classList.remove('form-registro-is-active');
     iniciarSesionContainer.classList.remove('form-iniciar-sesion-is-active', 'form-iniciar-sesion-is-active');
    })
    // ----- Evento para validar datos y resgistrar cuenta -----
    idInput.addEventListener('focusout', validarDatosInput);
    nombreInput.addEventListener('focusout', validarDatosInput);
    apellidoInput.addEventListener('focusout', validarDatosInput);
    nacimientoInput.addEventListener('focusout', validarDatosInput);
    contrasenaInput.addEventListener('focusout', validarDatosInput);
    formulario.addEventListener('submit', validarFormulario);
    //-------- Eventos para iniciar sesion --------------------------
    btnIniciarSesion.addEventListener('click', (e) => {
        iniciarSesionContainer.classList.add('form-iniciar-sesion-is-active')
    })
    //-------- Eventos para simulador de credito --------------------------
    btnSimuladorCredito.addEventListener('click', simuladorCredito)
}

//********************************    CLASES    ******************************** /

//! ---------- 1. Crear registro  ----------

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

//! ---------- 3.Simulador de credito  ----------
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

//! ---------- 1. Crear registro al validar los datos ----------
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
//! ---------- Iniciar sesion ----------

//! ---------- 3. Funcion Simulador de Credito ----------
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

    const existeError = document.querySelector('#form-abrir-cuenta .error');
    const divMensaje = document.createElement('div');
    
    if(!existeError){
        divMensaje.classList.add('error');
        divMensaje.textContent = mensaje;
        document.querySelector('#form-abrir-cuenta').insertBefore(divMensaje, formulario)
    }

    setTimeout(() => {
        divMensaje.remove()
    }, 2000);
}