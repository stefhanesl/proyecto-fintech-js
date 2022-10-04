// ********************************     VARIABLES  ******************************** //
// ------------------------------ Variables HTML --------------------
// Elementos de registro
const btnRegistro = document.querySelector('#btn-abrir-cuenta');
const formContainer = document.querySelector('.container-form-registro');
const formulario = document.querySelector('#formulario-principal');
const btnSalirForm1 = document.querySelector('img.icono-x');
const btnSalirForm2 = document.querySelector('img.icono-y');
const idInput = document.querySelector('#fid');
const nombreInput = document.querySelector('#fnombre');
const apellidoInput = document.querySelector('#fapellido');
const nacimientoInput = document.querySelector('#fnacimiento');
const contrasenaInput = document.querySelector('#fcontrasena');
// Elementos de Iniciar sesion
const iniciarSesionContainer = document.querySelector('.container-form-iniciar-sesion');
const btnIniciarSesion = document.querySelector('#btn-iniciar-sesion');
const formularioIniciarSesion = document.querySelector('#formulario-principal-iniciar-sesion')
const btnSalirCuenta = document.querySelector('#salir-sesion-cuenta')

// ----- Variables  -----
let cliente;
let numCuentasBancarias = [];
let cuentasBancarias = [];
// let cuentas = JSON.parse(localStorage.getItem('cuentas')) || []

let clientes = []
//********************************  EVENTOS   ******************************** /

eventoslistener()
function eventoslistener(){
    // ----- Evento al cargar la pagina, para que se llenen los datos -----
    document.addEventListener('DOMContentLoaded', (e) => {
            //Cargar fecha
            maximaFechaInput();
        })
    document.addEventListener('DOMContentLoaded', (e) => {
        cargarClientesLocalStorage()
    })
    btnRegistro.addEventListener('click', (e) => {
        formContainer.classList.add('form-registro-is-active');
    })
    btnIniciarSesion.addEventListener('click', (e) => {
        e.preventDefault()
        iniciarSesionContainer.classList.add('form-iniciar-sesion-is-active')
    })
    btnSalirForm1.addEventListener('click', (e) => {
        formContainer.classList.remove('form-registro-is-active');
       })
    btnSalirForm2.addEventListener('click', (e) => {
        iniciarSesionContainer.classList.remove('form-iniciar-sesion-is-active')
    })
    
    // ----- Evento para validar datos y resgistrar cuenta -----
    idInput.addEventListener('focusout', validarDatosInput);
    nombreInput.addEventListener('focusout', validarDatosInput);
    apellidoInput.addEventListener('focusout', validarDatosInput);
    nacimientoInput.addEventListener('focusout', validarDatosInput);
    contrasenaInput.addEventListener('focusout', validarDatosInput);
    formulario.addEventListener('submit', validarFormulario);
    //-------- Eventos para iniciar sesion --------------------------
    formularioIniciarSesion.addEventListener('submit', (e) => {
        e.preventDefault()
        validarIniciosesion()
    })
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
        this.saldo = parseFloat(0);        
        this.clave = clave;
        this.transferencias = [];
        this.movimientos = [];
        this.carrito = [];
        this.inversiones = [];
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

//! ---------- 1. Crear registro al validar los datos --------------------
function validarDatosInput(e){
    if( e.target.value === ''){
        mostrarMensaje('*Este campo es obligatorio', 'error', e.target);
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
        mostrarMensaje('**Todos los campos son obligatorios', 'error', formulario);
        return;
    }
    formContainer.classList.remove('form-registro-is-active');
    registrarCuenta(id, nombre, apellido, nacimiento, clave);
    formulario.reset();
    
}
function registrarCuenta(id, nombre, apellido, nacimiento, clave){
   
    cliente = new Cuenta( id, nombre, apellido, nacimiento, clave );

    clientes = [...clientes, cliente]

    Swal.fire({
        title: 'Registro',
        icon: 'success',
        confirmButtonText: 'Cool',
        confirmButtonColor: '#0F265C',
        timer: 4000,
        iconColor: '#0F265C',
        text: `Sr(a). ${nombre} ${apellido}, su cuenta ha sido creada exitosamente`,
        imageUrl: '/img/logo-fintech.jpg',
        imageHeight: 200
    })
    guardarCursosLocalStorage(clientes)

}
function guardarCursosLocalStorage(objetosDeClientes){
    localStorage.clear()
    localStorage.setItem('clientes', JSON.stringify(objetosDeClientes))
}
function cargarClientesLocalStorage(){
    clientes = JSON.parse(localStorage.getItem('clientes')) || []
}
//! ---------- Iniciar sesion ----------------------------------------

function validarIniciosesion(e){
  
    const idInicioSesion = document.querySelector('#id').value
    const contrasenaInicioSesion = document.querySelector('#contrasena').value

    let contador = 0

    if(idInicioSesion === '' || contrasenaInicioSesion === ''){
        mostrarMensaje('Llene todos los campos.', 'error', formularioIniciarSesion)
        return;
    }

    while (contador < 3 ){
        let existeID;
            existeID = clientes.find( cuenta => cuenta.id === idInicioSesion ) 
            if(existeID){
                const existeContrasena = existeID.clave === contrasenaInicioSesion
                if(existeContrasena){
                    Swal.fire({
                        title: 'INICIO DE SESIÓN',
                        icon: 'success',
                        confirmButtonText: 'Cool',
                        confirmButtonColor: '#0F265C',
                        timer: 4000,
                        iconColor: '#0F265C',
                        text: `Su incio de sesion se ha completado exitosamente. Sr(a). ${existeID.nombre} `,
                        imageUrl: '/img/logo-fintech.jpg',
                        imageHeight: 200
                    })
                    setTimeout(() => {
                        window.localStorage.setItem('cliente-sesion', JSON.stringify(existeID))
                        formularioIniciarSesion.reset()
                        window.location.assign("http://127.0.0.1:5500/paginas/inicio-sesion.html")
                    }, 4000);
                }else{
                    Swal.fire({
                        title: 'ERROR',
                        icon: 'error',
                        showConfirmButton: false,
                        timer: 2000,
                        text: `La contraseña es incorrecta.`,
                    })
                    return;
                }
            }else{
                Swal.fire({
                    title: 'ERROR',
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 2000,
                    text: `El usuario no existe.`,
                })
                return;   
            }    
        contador++;
    } 
    inicioValidado(false)
}

//! --------------- Funciones para la interfaz de usuario ---------------
//Carga a fecha maxima que puede tener el formulario
function maximaFechaInput(){
    const now = new Date();
    let today = now.getFullYear()+"-"+("0" + (now.getMonth() + 1)).slice(-2)+"-"+("0" + now.getDate()).slice(-2);
    nacimientoInput.max = today;
}
// Mostar mensaje de error o de exito si se ha completado algun campo o formulario
function mostrarMensaje(mensaje, tipo, nodo){

    const divMensaje = document.createElement('div')

    if( tipo === 'error'){
        divMensaje.classList.add('error');
    }else{
        divMensaje.classList.add('exito');
    }
    divMensaje.textContent = mensaje;

    const existeError = nodo.parentElement.querySelector('.error')

    if(!existeError){
        nodo.insertAdjacentElement('beforebegin', divMensaje);
    }

    setTimeout(() => {
        divMensaje.textContent = ''
        divMensaje.classList.remove('error', 'exito')
    }, 2000); 

    return;
}
