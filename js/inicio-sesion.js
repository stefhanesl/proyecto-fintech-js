//-------- Variables
const btnmontoTarjeta = document.querySelector('#btn-cantidad-recargada')
const formRecarga = document.querySelector('.form-recarga')
const formTransferencia = document.querySelector('.form-transferir-dinero')
const tablaMovimientos = document.querySelector('#balance-cuenta tbody')
const botonSalir = document.querySelector('#btn-salir-sesion')

let saldoAgregado
let movimientosObjeto
let arrayMovimientos = []
let clientesTotales = JSON.parse(localStorage.getItem('clientes')) || []
let clientesCuentas = []
let datosCliente = JSON.parse(localStorage.getItem('cliente-sesion'))


// eventos
formRecarga.addEventListener('submit', (e) => {
    e.preventDefault()
    validarDatosTarjeta(e)
})
formTransferencia.addEventListener('submit', (e) => {
    e.preventDefault()
    validarDatosTransferencia(e)
})
botonSalir.addEventListener('click', (e) => {
    localStorage.removeItem('cliente-sesion')
})

class Movimientos {
    constructor(objFecha, objNumCuenta, objDetalle, objMonto, objSaldo) {
        this.objFecha = objFecha;
        this.objNumCuenta = objNumCuenta;
        this.objDetalle = objDetalle;
        this.objMonto = objMonto;
        this.objSaldo = objSaldo;
    }
}

//Funciones
//!----------------------------- INCIAR SESION -----------------------------------
iniciarCuenta(datosCliente)

function iniciarCuenta(clienteObjeto) {
    const mensajeBienvenida = document.querySelector('.mensaje-bienvenida')

    const infoCliente = document.querySelector('.informacion-cliente')

    const { id, nombre, apellido, nacimiento, numeroCuenta, saldo, transfereciaRealizada, movimientos } = clienteObjeto


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

    if (movimientos.length) {
        arrayMovimientos = [...movimientos]
        cargarResumenMovimientos(arrayMovimientos)
    }


}
//!----------------------------- RECARGA -----------------------------------

function validarDatosTarjeta(e) {
    if (e.target[0].value == '' || e.target[1].value == '' || e.target[2].value == '' || e.target[3].value == '' || e.target[4].value == '') {
        // mostrarModal()
        mostrarMensajeSweet('Error', 'error', false, 2000, 'Ingrese todos los campos.')
        return;
    }
    if (e.target[4].value <= 1) {
        // mostrarModal()
        mostrarMensajeSweet('Error', 'error', false, 2000, 'Ingrese un monto mayor a $1 USD.')
        return;
    }

    recargarSaldo(e.target[4].value);
}
function recargarSaldo(montoIngresado) {
    saldoAgregado += parseFloat(montoIngresado)
    arrayMovimientos.push(new Movimientos(Date.now(), 'Propio', 'Dinero de recarga', montoIngresado, saldoAgregado))

    mostrarMensajeSweet('Recarga', 'success', false, 2000, 'La recarga ha sido exitosa.')
    cargarResumenMovimientos(arrayMovimientos)
}
//!----------------------------- TRANSFERENCIA -----------------------------------

function validarDatosTransferencia(e) {
    if (e.target[0].value == '' || e.target[1].value == '' || e.target[2].value == '') {
        // mostrarModal()
        mostrarMensajeSweet('Error', 'error', false, 2000, 'Ingrese todos los campos.')
        return;
    }
    if (e.target[1].value <= 1) {
        // mostrarModal()
        mostrarMensajeSweet('Error', 'error', false, 2000, 'Ingrese un monto mayor a $1 USD.')
        return;
    }

    const clienteAccesado = clientesTotales.find(cliente => cliente.numeroCuenta === e.target[0].value)
    if (!clienteAccesado) {
        // mostrarModal()
        mostrarMensajeSweet('Error', 'error', false, 2000, 'La cuenta ingresada no existe.')
        return;
    }
    if (datosCliente.saldo < e.target[1].value) {
        // mostrarModal()
        mostrarMensajeSweet('Error', 'error', false, 2000, 'Usted no cuenta con saldo para realizar esta operación.')
        return;
    }

    Transferir(e.target[0].value, e.target[1].value, e.target[2].value)
}
function Transferir(clienteEncontrado, montoTransferir, motivo) {
    montoTransferir = parseFloat(montoTransferir)
    const cambiosTransaccionales = clientesTotales.map(cliente => {
        if (cliente.numeroCuenta === clienteEncontrado) {
            cliente.saldo += montoTransferir

            cliente.movimientos.push(new Movimientos(Date.now(), datosCliente.numeroCuenta, `Dinero recibido: ${motivo}`, montoTransferir, cliente.saldo))
        } else if (cliente.id === datosCliente.id) {

            cliente.saldo -= montoTransferir
            saldoAgregado -= montoTransferir

            arrayMovimientos.push(new Movimientos(Date.now(), clienteEncontrado, `Dinero transferido: ${motivo}`, montoTransferir, saldoAgregado))
        }
    })
    localStorage.setItem('clientes', JSON.stringify(...cambiosTransaccionales))
    mostrarMensajeSweet('Transferencia', 'success', false, 3000, `La transferencia de $${montoTransferir} ha sido exitosa.`)
    cargarResumenMovimientos(arrayMovimientos)
}


//!----------------------------- TABLA CARGAR MOVIMIENTOS -----------------------------------
function cargarResumenMovimientos(movimientosCuenta) {

    limpiarMovimientos()

    if (movimientosCuenta) {
        const datos = clientesTotales.map(cli => {
            if (cli.id === datosCliente.id) {
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
    movimientosCuenta.forEach(detalleMovimientos => {
        const { objFecha, objNumCuenta, objDetalle, objMonto, objSaldo } = detalleMovimientos

        const DateTime = luxon.DateTime
        const fechaAhora = DateTime.now()

        const trFila = document.createElement('tr')
        trFila.innerHTML = `
                <th scope="row">${fechaAhora.c.day}/${fechaAhora.c.month}/${fechaAhora.c.year}  -  ${fechaAhora.c.hour}h:${fechaAhora.c.minute}m</th>
                <td>${objNumCuenta}</td>
                <td>${objDetalle}</td>
                <td>${objMonto}</td>
                <td>${objSaldo}</td>
        `
        tablaMovimientos.appendChild(trFila)
    });
}

function limpiarMovimientos() {
    while (tablaMovimientos.firstChild) {
        tablaMovimientos.removeChild(tablaMovimientos.firstChild)
    }
}

function mostrarMensajeSweet(title, icon, showConfirmButton, timer, text) {
    Swal.fire({
        title: title,
        icon: icon,
        showConfirmButton: showConfirmButton,
        timer: 2000,
        text: text,
    })

}