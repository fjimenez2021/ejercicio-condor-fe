var listaProductos = [];

const load = async () => {
    let btSave = document.getElementById("btSave");
    btSave.addEventListener("click", save);
    await listarProductos();
}
document.addEventListener("DOMContentLoaded", load);

const listarProductos = async () => {
    try {
        const response = await axios.post('http://localhost:3000/graphql', {
            query: `
                {
                    listarProductos{
                    _id
                    referencia,
                    nombre,
                    precio
                    }
                }
            `
        });
        listaProductos = response.data.data.listarProductos;
        buildTable();
    } catch (e) {
        // Handle Error Here
        console.error(e);
    }   
}

const save = async (e) => {
    try {
        if (validarFormulario()) {
            let producto = getProducto();
            const response = await axios.post('http://localhost:3000/graphql', {
                query: `
                    mutation {
                        crearProducto(input:{
                            referencia:"${producto.referencia}"
                            nombre: "${producto.nombre}"
                            precio: ${producto.precio}
                          }){
                            _id
                            referencia,
                            nombre,
                            precio
                        }
                    }
                `
            });
            listaProductos.push(response.data.data.crearProducto);
            buildTable();
            document.getElementById("formProducto").reset();
        }
    } catch (e) {
        // Handle Error Here
        console.error(e);
    }
}

const getProducto = () => {
    let producto = new Producto();
    producto.referencia = document.getElementById("formProducto").referencia.value;
    producto.nombre = document.getElementById("formProducto").nombre.value;
    producto.precio = document.getElementById("formProducto").precio.value;
    return producto;
}

const isNumber = (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

const validarFormulario = () => {
    let formProducto = document.getElementById("formProducto");
    let referencia = formProducto.referencia;
    let nombre = formProducto.nombre;
    let precio = formProducto.precio;

    if (referencia.value.trim() === "") {
        alert("Digite referencia del producto");
        referencia.focus();
        return false;
    } else if (nombre.value.trim() === "") {
        alert("Digite nombre del producto");
        nombre.focus();
        return false;
    } else if (precio.value.trim() === "") {
        alert("Digite precio del producto");
        precio.focus();
        return false;
    }
    if (!isNumber(precio.value)) {
        alert("Precio del producto no es un valor valido");
        precio.focus();
        return false;
    }
    return true;
}

const buildTable = () => {
    let tbody = document.getElementById('tbody');
    tbody.innerHTML = "";
    for (const producto of listaProductos) {
        addRow(producto);
    }
}

const addRow = (producto) => {
    let tbody = document.getElementById('tbody');
    let trProducto = document.createElement("tr");

    let tdReferencia = document.createElement("td");
    tdReferencia.innerText = producto.referencia;
    trProducto.appendChild(tdReferencia);

    let tdNombre = document.createElement("td");
    tdNombre.innerText = producto.nombre;
    trProducto.appendChild(tdNombre);

    let tdPrecio = document.createElement("td");
    tdPrecio.innerText = producto.precio;
    trProducto.appendChild(tdPrecio);

    tbody.appendChild(trProducto);

}

class Producto {
    constructor() {
        this._id = null;
        this.referencia = null;
        this.nombre = null;
        this.precio = null;
    }
}