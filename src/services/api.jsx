import axios from "axios";

const API_URL = "http://localhost:8080";

export const getProductos = async () => {
  try {
    const response = await axios.get(`${API_URL}/producto/list`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    throw error;
  }
};

export const getMyProductos = async () => {
  try {
    const response = await axios.get(`${API_URL}/producto/list-by-stock`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener mis productos:", error);
    throw error;
  }
};

export const getProductosPorEstado = async () => {
  try {
    const response = await axios.get(`${API_URL}/producto/list-by-state`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    throw error;
  }
};

export const getProductoById  = async (idProducto) => {
  try {
    const response = await axios.get(`${API_URL}/producto/editar/${idProducto}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    throw error;
  }
};

export const getMiProductoById  = async (idProducto) => {
  try {
    const response = await axios.get(`${API_URL}/producto/editar/mi-producto/${idProducto}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    throw error;
  }
};

export const requestCompra = async (categoria) => {
  try {
    const response = await axios.post(`${API_URL}/buys/register`, categoria);
    return response.data;
  } catch (error) {
    console.error("Error al registrar la compra:", error);
    throw error;
  }
};

/*export const requestVenta = async (venta) => {
  try {
    const response = await axios.post(`${API_URL}/sales/register`, venta);
    return response.data;
  } catch (error) {
    console.error("Error al registrar la venta:", error);
    throw error;
  }
};*/

export const registrarVenta = async (venta) => {
  try {
    const response = await axios.post(`${API_URL}/sales/registrar`, venta);
    return response.data;
  } catch (error) {
    console.error("Error al registrar la venta:", error);
    throw error;
  }
};

export const getReportePorDia = async (fecha) => {
  try {
    const response = await axios.get(`${API_URL}/sales/report/${fecha}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el reporte", error);
    throw error;
  }
};

export const getReporteEntreFechas = async (fechaInicio, fechaFin) => {
  try {
    const response = await axios.get(`${API_URL}/sales/report/rango`, {
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

export const createProducto = async (producto) => {
  try {
    const response = await axios.post(`${API_URL}/producto/create`, producto);
    return response.data;
  } catch (error) {
    console.error("Error al crear el producto:", error);
    throw error;
  }
};

export const updateProducto = async (producto) => {
  try {
    const response = await axios.put(`${API_URL}/producto/actualizar`, producto, {
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

export const updateMiProducto = async (producto) => {
  try {
    const response = await axios.put(`${API_URL}/producto/actualizar/mi-producto`, producto, {
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

export const createCategoria = async (categoria) => {
  try {
    const response = await axios.post(`${API_URL}/categoria/create`, categoria);
    return response.data;
  } catch (error) {
    console.error("Error al crear la categoria:", error);
    throw error;
  }
};

export const getCategorias = async (categoria) => {
  try {
    const response = await axios.get(`${API_URL}/categoria/list`, categoria);
    return response.data;
  } catch (error) {
    console.error("Error al obtener las categorias:", error);
    throw error;
  }
};

export const updateCategoria= async (categoria) => {
  try {
    const response = await axios.put(`${API_URL}/categoria/edit`, categoria, {
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
    const response = await axios.delete(`${API_URL}/categoria/${idCategoria}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar la categoria:", error);
    throw error;
  }
};


export const createUnidadMedida = async (unidad) => {
  try {
    const response = await axios.post(`${API_URL}/unidad-medida/create`, unidad);
    return response.data;
  } catch (error) {
    console.error("Error al crear la unidad de medida:", error);
    throw error;
  }
};

export const getUnidadMedida = async (unidadMedida) => {
  try {
    const response = await axios.get(`${API_URL}/unidad-medida/list`, unidadMedida);
    return response.data;
  } catch (error) {
    console.error("Error al obtener las unidades de medida:", error);
    throw error;
  }
};

export const updateUnidadMedida = async (unidadMedida) => {
  try {
    const response = await axios.put(`${API_URL}/unidad-medida/edit`, unidadMedida, {
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

export const eliminarUnidadMedida= async (idUnidadMedida) => {
  try {
    const response = await axios.delete(`${API_URL}/unidad-medida/${idUnidadMedida}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar la unidad de medida:", error);
    throw error;
  }
};

export const createUbicaciones = async (ubicacion) => {
  try {
    const response = await axios.post(`${API_URL}/ubicacion/create`, ubicacion);
    return response.data;
  } catch (error) {
    console.error("Error al crear la ubicacion:", error);
    throw error;
  }
};

export const getUbicaciones = async (ubicaciones) => {
  try {
    const response = await axios.get(`${API_URL}/ubicacion/list`, ubicaciones);
    return response.data;
  } catch (error) {
    console.error("Error al obtener las ubicaciones:", error);
    throw error;
  }
};

export const getProveedores = async () => {
  try {
    const response = await axios.get(`${API_URL}/proveedor/list`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los proveedores:", error);
    throw error;
  }
};

export const getUsuarios = async () => {
  try {
    const response = await axios.get(`${API_URL}/usuario/list`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los proveedores:", error);
    throw error;
  }
};

export const getClientes = async () => {
  try {
    const response = await axios.get(`${API_URL}/cliente/list`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los clientes:", error);
    throw error;
  }
};

export const crearClienteRapido = async (cliente) => {
  try {
    const response = await axios.post(`${API_URL}/cliente/create-rapido`, cliente);
    return response.data;
  } catch (error) {
    console.error("Error al crear al cliente:", error);
    throw error;
  }
};

export const updateCliente = async (cliente) => {
  try {
    const response = await axios.put(`${API_URL}/cliente/actualizar`, cliente);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar al cliente:", error);
    throw error;
  }
};

export const eliminarCliente = async (idCliente) => {
  try {
    const response = await axios.delete(`${API_URL}/cliente/${idCliente}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar al cliente:", error);
    throw error;
  }
};

export const crearProveedorRapido = async (ruc) => {
  try {
    const response = await axios.get(`${API_URL}/proveedor/create-proveedor-rapido?ruc=${ruc}`);
    return response.data;
  } catch (error) {
    console.error("Error al crear proveedor:", error);
    throw error;
  }
};

export const updateProveedor = async (proveedor) => {
  try {
    const response = await axios.put(`${API_URL}/proveedor/actualizar`, proveedor);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar al proveedor:", error);
    throw error;
  }
};

export const eliminarProveedor = async (idProveedor) => {
  try {
    const response = await axios.delete(`${API_URL}/proveedor/${idProveedor}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar al proveedor:", error);
    throw error;
  }
};

export const createCliente = async (cliente) => {
  try {
    const response = await axios.post(`${API_URL}/cliente/create`, cliente);
    return response.data;
  } catch (error) {
    console.error("Error al crear cliente:", error);
    throw error;
  }
};

export const getNumeracionComprobante = async (tipoComprobante) => {
  try {
    const response = await axios.get(`${API_URL}/comprobante/proximo?tipo=${tipoComprobante}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener la numeracion del comprobante", error);
    throw error;
  }
};

export const crearUsuario = async (usuario) => {
  try {
    const response = await axios.post(`${API_URL}/usuario/create`, usuario);
    return response.data;
  } catch (error) {
    console.error("Error creando al usuario:", error);
    throw error; 
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};