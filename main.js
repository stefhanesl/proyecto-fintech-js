//  ---------------------------------  VARIABLES  -------------------------------------
let salir;
let cliente;
let numCuentasBancarias = [];
let cuentasBancarias = [];
//  ---------------------------------  CLASES  -------------------------------------
// 1____Clase Cuenta
class Cuenta{
    constructor(id, nombre){
        this.id = id
        this.nombre = nombre;
        this.numeroCuenta = ''
        this.saldo = 0
        this.transfereciaRealizada = 0;
    }
    generarNumeroCuenta(){
        this.numeroCuenta = String(Math.random(Math.random() * 1000000000000))
        while ( numCuentasBancarias.includes(numero) ){
            this.numeroCuenta = String(Math.random(Math.random() * 1000000000000))
        }
        numCuentasBancarias.push(this.numeroCuenta)
    }
    mostrarMensaje(mensaje){
        alert(mensaje)
    }
    agregarSaldo(cantidad){
        this.saldo += cantidad
    }

}

// 2____Clase de credito
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
        alert(`El monto total a pagar de su crédito es de ${(montoCredito).toFixed(2)}, por ${meses} meses.
               Su pago mensual es de ${(montoCredito/meses).toFixed(2)}.`)
    }
}


// ---------------------------------  FUNCIONES -------------------------------------

// ____Funciones Menu

function mostrarMenuDeOpciones(){
    let opcionSeleccionada = parseInt(prompt(`
        Menú:
        1. Abrir cuenta de ahorros
        2. Ingresar dinero
        3. Realizar transferencia
        4. Simulador de crédito
        5. Salir
    `))

    menuOpciones(opcionSeleccionada);
}

function menuOpciones(opcion){
    switch (opcion) {
        case 1:
            crearCuenta();
        break;
        case 2:
            ingresarDinero();
        break;
        case 3:
            realizarTransferencia()
        break;
        case 4:
            simuladorCredito();
        break;
        case 5:
            salir = false
            alert('👋 Gracias por visitar nuestra Fintech');
        break;
        default:
            alert('Ingrese una opción correcta');
    }
}
while (salir != false){
    mostrarMenuDeOpciones();
}

// 1____Funcion Crear Cuenta

function crearCuenta(){
    const idIngresado = prompt('Ingrese su id: ');
    const nombreIngresado = prompt('Ingrese su nombre: ');

    while ( idIngresado === '' || nombreIngresado === '' ) {
        idIngresado = prompt('Ingrese su id: ');
        nombreIngresado = prompt('Ingrese su nombre: ');
    }
    cliente = new Cuenta(idIngresado, nombreIngresado);
    cuentasBancarias = [ ...cuentasBancarias, cliente]
    console.log(cliente)
    console.log(cuentasBancarias)
    cliente.mostrarMensaje('Su cuenta ha sido creada exitosamente');
}

// 2____Funcion Ingresar Dinero
function ingresarDinero(){
    let dineroIngresado = parseInt(prompt('Ingrese el monto a depositar en su cuenta: '))
    while (dineroIngresado === 0){
        dineroIngresado = parseInt(prompt('Ingrese el monto a depositar en su cuenta: '))
    }
    cliente.agregarSaldo(dineroIngresado)

    const { saldo } = cliente
    cliente.mostrarMensaje(`Su saldo actual es ${saldo}`)
}
// 3____Funcion Realizar transferencia
function realizarTransferencia(){
    
    let montoATransferir = parseInt(prompt('Ingrese el monto a tranferir: '))
    let cuentaDeTransferencia = prompt('Ingrese su numero de cuenta: ')
    let cuentaParaLaTransferencia = prompt('Ingrese el numero de cuenta para la transferencia: ')
    while( montoATransferir === 0 ) {
        montoATransferir = parseInt(prompt('Ingrese el monto a tranferir: '))
    }
    //si la cuenta que recibe la tranferencia existe 
    cuentasBancarias.forEach( cuentaRecibe => {
       if( cuentaRecibe.numeroCuenta === cuentaParaLaTransferencia ){
                //si la cuenta que realiza la tranferencia tiene saldo
            const existeSaldo = cuentasBancarias.map( cuentaEnvia => {
                if(cuentaEnvia.numeroCuenta === cuentaDeTransferencia){
                    if(cuentaEnvia.saldo >= montoATransferir){
                        cuentaEnvia.saldo -= montoATransferir
                        cuentaRecibe.saldo += montoATransferir
                    }
                }
            })
            if ( !existeSaldo ) {
                cliente.mostrarMensaje('Usted no tiene saldo en su cuenta.')
                return;
            }
            cliente.mostrarMensaje('Transferencia enviada exitosamente.')
        }else{
            cliente.mostrarMensaje('La cuenta a la cual quiere transferir dinero, no existe.')
            return;
        }
    })
}

// 4____Funcion Simulador de Credito

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
