import axios from "axios";

const API_URL = "http://localhost:8080"; 

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('jwt_token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn("Token inválido o expirado. Redirigiendo al login...");
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('isAuthenticated'); 
      localStorage.removeItem('userRole'); 
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, credentials); 
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

// inicio Funciones para manejar usuarios

export const crearUsuario = async (usuario) => {
  try {
    const response = await api.post(`/usuario/create`, usuario); 
    return response.data;
  } catch (error) {
    console.error("Error creando al usuario:", error);
    throw error;
  }
};

export const getUsuarios = async (habilitado = null) => { 
  try {
    let url = `/usuario/list`;
    if (habilitado !== null) { 
      url += `?habilitado=${habilitado}`;
    }
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los usuarios", error);
    throw error;
  }
};

export const updateUsuario = async (usuario) => {
  try {
    const response = await api.put(`/usuario/actualizar`,usuario); 
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el usuario", error); 
    throw error;
  }
};

// fin Funciones para manejar usuarios



//inicio Funciones cliente - proveedor
export const createCliente = async (cliente) => {
  try {
    const response = await api.post(`/cliente/create`, cliente); 
    return response.data;
  } catch (error) {
    console.error("Error al crear cliente:", error);
    throw error;
  }
};

export const getClientes = async () => {
  try {
    const response = await api.get(`/cliente/list`); 
    return response.data;
  } catch (error) {
    console.error("Error al obtener los clientes:", error);
    throw error;
  }
};

export const crearClienteRapido = async (cliente) => {
  try {
    const response = await api.post(`/cliente/create-rapido`, cliente); 
    return response.data;
  } catch (error) {
    console.error("Error al crear al cliente:", error);
    throw error;
  }
};

export const updateCliente = async (cliente) => {
  try {
    const response = await api.put(`/cliente/actualizar`, cliente); 
    return response.data;
  } catch (error) {
    console.error("Error al actualizar al cliente:", error);
    throw error;
  }
};

export const eliminarCliente = async (idCliente) => {
  try {
    const response = await api.delete(`/cliente/${idCliente}`); 
    return response.data;
  } catch (error) {
    console.error("Error al eliminar al cliente:", error);
    throw error;
  }
};

export const getProveedores = async () => {
  try {
    const response = await api.get(`/proveedor/list`); 
    return response.data;
  } catch (error) {
    console.error("Error al obtener los proveedores:", error);
    throw error;
  }
};

export const crearProveedorRapido = async (ruc) => {
  try {
    const response = await api.get(`/proveedor/create-proveedor-rapido?ruc=${ruc}`); 
    return response.data;
  } catch (error) {
    console.error("Error al crear proveedor:", error);
    throw error;
  }
};

export const updateProveedor = async (proveedor) => {
  try {
    const response = await api.put(`/proveedor/actualizar`, proveedor); 
    return response.data;
  } catch (error) {
    console.error("Error al actualizar al proveedor:", error);
    throw error;
  }
};

export const eliminarProveedor = async (idProveedor) => {
  try {
    const response = await api.delete(`/proveedor/${idProveedor}`); 
    return response.data;
  } catch (error) {
    console.error("Error al eliminar al proveedor:", error);
    throw error;
  }
};
//fin Funciones cliente - proveedor

//inicio Funciones Categoria
export const createCategoria = async (categoria) => {
  try {
    const response = await api.post(`/categoria/create`, categoria); 
    return response.data;
  } catch (error) {
    console.error("Error al crear la categoria:", error);
    throw error;
  }
};

export const getCategorias = async () => { 
  try {
    const response = await api.get(`/categoria/list`); 
    return response.data;
  } catch (error) {
    console.error("Error al obtener las categorias:", error);
    throw error;
  }
};

export const updateCategoria = async (categoria) => {
  try {
    const response = await api.put(`/categoria/edit`, categoria, {  
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la categoria:", error);
    throw error;
  }
};

export const eliminarCategoria = async (idCategoria) => {
  try {
    const response = await api.delete(`/categoria/${idCategoria}`); 
    return response.data;
  } catch (error) {
    console.error("Error al eliminar la categoria:", error);
    throw error;
  }
};
//fin Funciones Categoria

// inicio Funciones Unidad de Medida
export const createUnidadMedida = async (unidad) => {
  try {
    const response = await api.post(`/unidad-medida/create`, unidad); 
    return response.data;
  } catch (error) {
    console.error("Error al crear la unidad de medida:", error);
    throw error;
  }
};

export const getUnidadMedida = async () => { 
  try {
    const response = await api.get(`/unidad-medida/list`); 
    return response.data;
  } catch (error) {
    console.error("Error al obtener las unidades de medida:", error);
    throw error;
  }
};

export const updateUnidadMedida = async (unidadMedida) => {
  try {
    const response = await api.put(`/unidad-medida/edit`, unidadMedida, { 
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la unidad de medida:", error);
    throw error;
  }
};

export const eliminarUnidadMedida = async (idUnidadMedida) => {
  try {
    const response = await api.delete(`/unidad-medida/${idUnidadMedida}`); 
    return response.data;
  } catch (error) {
    console.error("Error al eliminar la unidad de medida:", error);
    throw error;
  }
};
// fin funiciones Unidad de Medida

// inicio Funciones Producto
export const createProducto = async (producto) => {
  try {
    const response = await api.post(`/producto/create`, producto); 
    return response.data;
  } catch (error) {
    console.error("Error al crear el producto:", error);
    throw error;
  }
};

export const getProductos = async () => {
  try {
    const response = await api.get(`/producto/list`); 
    return response.data;
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    throw error;
  }
};

export const getProductoById = async (idProducto) => {
  try {
    const response = await api.get(`/producto/editar/${idProducto}`); 
    return response.data;
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    throw error;
  }
};

export const updateProducto = async (producto) => {
  try {
    const response = await api.put(`/producto/actualizar`, producto, { 
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    throw error;
  }
};

export const getProductosPorEstado = async () => {
  try {
    const response = await api.get(`/producto/list-by-state`); 
    return response.data;
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    throw error;
  }
};

export const getMyProductos = async () => {
  try {
    const response = await api.get(`/producto/list-by-stock`); 
    return response.data;
  } catch (error) {
    console.error("Error al obtener mis productos:", error);
    throw error;
  }
};

export const getMiProductoById = async (idProducto) => {//actualizar el stock de mi producto
  try {
    const response = await api.get(`/producto/editar/mi-producto/${idProducto}`); 
    return response.data;
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    throw error;
  }
};

export const updateMiProducto = async (producto) => {//actualizar el stock de mi producto
  try {
    const response = await api.put(`/producto/actualizar/mi-producto`, producto, { 
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    throw error;
  }
};
// fin Funciones Producto

// inicio Funciones Venta
export const registrarVenta = async (venta) => {
  try {
    const response = await api.post(`/sales/registrar`, venta); 
    return response.data;
  } catch (error) {
    console.error("Error al registrar la venta:", error);
    throw error;
  }
};

export const getReportePorDia = async (fecha) => {
  try {
    const response = await api.get(`/sales/report/${fecha}`); 
    return response.data;
  } catch (error) {
    console.error("Error al obtener el reporte", error);
    throw error;
  }
};

export const getReporteEntreFechas = async (fechaInicio, fechaFin) => {
  try {
    const response = await api.get(`/sales/report/rango`, { 
      params: {
        fechaInicio,
        fechaFin,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener el reporte entre fechas", error);
    throw error;
  }
};
// fin Funciones Venta


// inicio Funciones Compra
export const requestCompra = async (compraData) => { 
  try {
    const response = await api.post(`/buys/register`, compraData); 
    return response.data;
  } catch (error) {
    console.error("Error al registrar la compra:", error);
    throw error;
  }
};
// fin Funciones Compra

// inicio Funciones Ubicacion
export const createUbicaciones = async (ubicacion) => {
  try {
    const response = await api.post(`/ubicacion/create`, ubicacion); 
    return response.data;
  } catch (error) {
    console.error("Error al crear la ubicacion:", error);
    throw error;
  }
};

export const getUbicaciones = async () => { 
  try {
    const response = await api.get(`/ubicacion/list`); 
    return response.data;
  } catch (error) {
    console.error("Error al obtener las ubicaciones:", error);
    throw error;
  }
};
//fin funciones Ubicacion


export const getNumeracionComprobante = async (tipoComprobante) => {
  try {
    const response = await api.get(`/comprobante/proximo?tipo=${tipoComprobante}`); 
    return response.data;
  } catch (error) {
    console.error("Error al obtener la numeracion del comprobante", error);
    throw error;
  }
};