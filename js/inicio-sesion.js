
const datosCliente = window.JSON.parse(localStorage.getItem('cliente-sesion'))
iniciarCuenta(datosCliente)

function iniciarCuenta(clienteObjeto){
    // document.location = "/paginas/inicio-sesion.html"
    console.log('cliente objeto', clienteObjeto)
    
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