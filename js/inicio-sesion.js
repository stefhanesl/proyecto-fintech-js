//-------- Variables

const btnmontoTarjeta = document.querySelector('#btn-cantidad-recargada')

const formRecarga = document.querySelector('.form-recarga')
const formTransferencia = document.querySelector('.form-transferir-dinero')
const tablaMovimientos = document.querySelector('#balance-cuenta tbody')

let saldoAgregado
let movimientosObjeto
let arrayMovimientos = []
let clientesTotales = JSON.parse(localStorage.getItem('clientes')) 

let datosCliente = JSON.parse(localStorage.getItem('cliente-sesion'))

//Add Event Listener
eventos()
function eventos(){

    // document.addEventListener('DOMContentLoaded', (e) => {
    //     cargarDatosLS()
    // })

    formRecarga.addEventListener('submit', (e) => {
        e.preventDefault()
        validarDatosTarjeta(e)
    })
    formTransferencia.addEventListener('submit', (e) => {
        e.preventDefault()
        validarDatosTransferencia(e)
    })
}
class Movimientos{
    constructor(objFecha, objNumCuenta, objDetalle, objMonto, objSaldo){
        this.objFecha= objFecha;
        this.objNumCuenta= objNumCuenta;
        this.objDetalle= objDetalle;
        this.objMonto= objMonto;
        this.objSaldo= objSaldo;
    }
}

//Funciones
iniciarCuenta(datosCliente)

function iniciarCuenta(clienteObjeto){
    
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
    arrayMovimientos = [...movimientos]
    saldoAgregado = saldo
    cargarResumenMovimientos(arrayMovimientos)
}
function validarDatosTarjeta(e){
    if(e.target[0].value == '' || e.target[1].value == '' || e.target[2].value == '' || e.target[3].value == '' || e.target[4].value == ''){
        // mostrarModal()
        console.log('Ingrese todos los campos.')
        return;
    }
    if(e.target[4].value <= 1){
        // mostrarModal()
        console.log('Ingrese un monto mayor a $1 USD.')
        return;
    }
    recargarSaldo(e.target[4].value);
}
function recargarSaldo(montoIngresado){
    datosCliente.saldo += parseFloat(montoIngresado)
    arrayMovimientos.push(new Movimientos( Date.now(), 'Propio', 'Dinero de recarga' , montoIngresado, datosCliente.saldo ))
    console.log(arrayMovimientos)
    cargarResumenMovimientos(arrayMovimientos)
}
function validarDatosTransferencia(e){
    if(e.target[0].value == '' || e.target[1].value == '' || e.target[2].value == ''){
        // mostrarModal()
        console.log('Ingrese todos los campos.')
        return;
    }
    if(e.target[1].value <= 1){
        // mostrarModal()
        console.log('Ingrese un monto mayor a $1 USD.')
        return;
    }
    const clienteEncontrado = clientesTotales.find( cliente => cliente.numeroCuenta === e.target[0].value )
    if(!clienteEncontrado){
        // mostrarModal()
        console.log('La cuenta ingresada no existe.')
        return;
    }
    if(datosCliente.saldo < e.target[1].value){
        // mostrarModal()
        console.log('Usted no cuenta con saldo para realizar esta operación.')
        return;
    }
    Transferir(e.target[0].value, e.target[1].value, e.target[2].value)
}
function Transferir(clienteEncontrado, montoTransferir, motivo){

        const cambiosTransaccionales = clientesTotales.map( cliente => {
            if(cliente.id === clienteEncontrado.id){
                cliente.saldo += montoTransferir
                cliente.movimientos.push(new Movimientos( Date.now(), datosCliente.numeroCuenta, 'Dinero recibido transferencia' , montoTransferir, cliente.saldo ))
            }else if(cliente.id === datosCliente.id){
                cliente.saldo -= montoTransferir
                datosCliente.saldo -= montoTransferir
                arrayMovimientos.push(new Movimientos( Date.now(), clienteEncontrado.numeroCuenta, 'Dinero transferido' , montoTransferir, cliente.saldo ))
            }
        })
        localStorage.setItem('clientes', JSON.stringify(...cambiosTransaccionales))
        cargarResumenMovimientos(arrayMovimientos)
}
 function cargarResumenMovimientos(movimientosCuenta){

    limpiarMovimientos()

    movimientosCuenta.forEach( detalleMovimientos => {
        const {objFecha, objNumCuenta, objDetalle, objMonto, objSaldo} = detalleMovimientos 
        
        const trFila = document.createElement('tr')
        trFila.innerHTML = `
                <th scope="row">${objFecha}</th>
                <td>${objNumCuenta}</td>
                <td>${objDetalle}</td>
                <td>${objMonto}</td>
                <td>${objSaldo}</td>
        `
        tablaMovimientos.appendChild(trFila)
    });
    console.log(clientesTotales)
    const clientes = clientesTotales.map( cliente => {
        if( cliente.id === datosCliente.id ){
            cliente.movimientos = [...arrayMovimientos]
        }
    })
    localStorage.setItem('clientes', JSON.stringify(clientes))
}

function limpiarMovimientos(){
    while(tablaMovimientos.firstChild){
        tablaMovimientos.removeChild(tablaMovimientos.firstChild)
    }
}
function guardarDatosLS(){
    localStorage.setItem('clientes', JSON.stringify( clientesTotales ))
}
function cargarDatosLS(){
    JSON.parse(localStorage.getItem('clientes'))
}