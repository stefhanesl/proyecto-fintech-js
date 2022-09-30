//-------- Variables

const btnmontoTarjeta = document.querySelector('#btn-cantidad-recargada')

const formRecarga = document.querySelector('.form-recarga')
const formTransferencia = document.querySelector('.form-transferir-dinero')
const tablaMovimientos = document.querySelector('#balance-cuenta tbody')

let saldoAgregado
let movimientosObjeto
let arrayMovimientos = []
let clientesTotales = JSON.parse(localStorage.getItem('clientes')) || []
let clientesCuentas = []
let datosCliente = JSON.parse(localStorage.getItem('cliente-sesion'))

//Add Event Listener
// eventos()
// function eventos(){

//     // document.addEventListener('DOMContentLoaded', (e) => {
//     //     cargarDatosLS()
//     // })

    formRecarga.addEventListener('submit', (e) => {
        e.preventDefault()
        validarDatosTarjeta(e)
    })
    formTransferencia.addEventListener('submit', (e) => {
        e.preventDefault()
        validarDatosTransferencia(e)
    })
// }
class Movimientos{
    constructor(objFecha, objNumCuenta, objDetalle, objMonto, objSaldo){
        this.objFecha= objFecha;
        this.objNumCuenta= objNumCuenta;
        this.objDetalle= objDetalle;
        this.objMonto= objMonto;
        this.objSaldo= objSaldo;
    }
}

// //Funciones
//!----------------------------- INCIAR SESION -----------------------------------
iniciarCuenta( datosCliente )

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
             
        </ul>
    `
    saldoAgregado = saldo
    console.log('0. inicio saldoAgregado', saldoAgregado)
    if(movimientos.length){
        arrayMovimientos = [...movimientos]
        cargarResumenMovimientos(arrayMovimientos)
    }
    

}
//!----------------------------- RECARGA -----------------------------------

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
    console.log(e.target)
    recargarSaldo(e.target[4].value);
}
function recargarSaldo(montoIngresado){
    saldoAgregado += parseFloat(montoIngresado)
    console.log(saldoAgregado)
    arrayMovimientos.push(new Movimientos( Date.now(), 'Propio', 'Dinero de recarga' , montoIngresado, saldoAgregado ))
    console.log('recarga movimientos', arrayMovimientos)
    cargarResumenMovimientos(arrayMovimientos)
}
//!----------------------------- TRANSFERENCIA -----------------------------------

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

    const clienteAccesado = clientesTotales.find( cliente => cliente.numeroCuenta === e.target[0].value )
    if(!clienteAccesado){
        // mostrarModal()
        console.log('La cuenta ingresada no existe.')
        return;
    }
    if(datosCliente.saldo < e.target[1].value){
        // mostrarModal()
        console.log('Usted no cuenta con saldo para realizar esta operación.')
        return;
    }
    console.log('DATOS a transferir',e.target[0].value, e.target[1].value, e.target[2].value)
    Transferir(e.target[0].value, e.target[1].value, e.target[2].value)
}
function Transferir(clienteEncontrado, montoTransferir, motivo){
        montoTransferir = parseFloat(montoTransferir)
        const cambiosTransaccionales = clientesTotales.map( cliente => {
            if(cliente.numeroCuenta === clienteEncontrado){
                cliente.saldo += montoTransferir
                console.log('cliente que recibe', cliente.saldo)
                cliente.movimientos.push(new Movimientos( Date.now(), datosCliente.numeroCuenta, `Dinero recibido: ${motivo}` , montoTransferir, cliente.saldo ))
            }else if(cliente.id === datosCliente.id){
                console.log('cliente que envia antes de la transf', cliente.saldo)
                cliente.saldo -= montoTransferir
                saldoAgregado -= montoTransferir
                console.log('1. cliente que envia transf', cliente.saldo)
                console.log('1. cliente saldoAgregado', saldoAgregado)
                arrayMovimientos.push(new Movimientos( Date.now(), clienteEncontrado, `Dinero transferido: ${motivo}` , montoTransferir, saldoAgregado ))
            }
        })
        localStorage.setItem('clientes', JSON.stringify(...cambiosTransaccionales))
        cargarResumenMovimientos(arrayMovimientos)
}


//!----------------------------- TABLA CARGAR MOVIMIENTOS -----------------------------------
 function cargarResumenMovimientos(movimientosCuenta){
    console.log('1M. arrayMov', arrayMovimientos)


    limpiarMovimientos()
    if(movimientosCuenta){
        const datos = clientesTotales.map( cli => {
            if(cli.id === datosCliente.id){
                cli.saldo = saldoAgregado
                datosCliente.saldo = saldoAgregado
                cli.movimientos = [...arrayMovimientos]
                localStorage.setItem('cliente-sesion', JSON.stringify(cli))
                return cli
            }
            return cli
        })
        localStorage.setItem('clientes', JSON.stringify(datos))
    }
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
}

function limpiarMovimientos(){
    while(tablaMovimientos.firstChild){
        tablaMovimientos.removeChild(tablaMovimientos.firstChild)
    }
}
