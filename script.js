//********************************     VARIABLES  ******************************** /
// ----- Variables HTML -----
const btnRegistro = document.querySelector('#btn-abrir-cuenta');
const formContainer = document.querySelector('.container-form-registro');
const formulario = document.querySelector('#formulario-principal');
const btnSalirForm = document.querySelector('#icono-x');
// const submitFormulario = document.querySelector('btn-enviar-registro')
const idInput = document.getElementById('fid');
const nombreInput = document.getElementById('fnombre');
const apellidoInput = document.getElementById('fapellido');
const nacimientoInput = document.getElementById('fnacimiento');
const contrasenaInput = document.getElementById('fcontrasena');

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
    })
    // ----- Evento para validar datos y resgistrar cuenta -----
    idInput.addEventListener('focusout', validarDatosInput);
    nombreInput.addEventListener('focusout', validarDatosInput);
    apellidoInput.addEventListener('focusout', validarDatosInput);
    nacimientoInput.addEventListener('focusout', validarDatosInput);
    contrasenaInput.addEventListener('focusout', validarDatosInput);
    formulario.addEventListener('submit', validarFormulario);
}

//********************************    CLASES    ******************************** /

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

//********************************    FUNCIONES  ******************************** /

//! ---------- Crear registro al validar los datos ----------
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