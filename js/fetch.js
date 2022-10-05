export const getFetch = async(ruta) => {

    const data = await fetch(ruta)

    const respuesta = data.json()

    return respuesta;

}
