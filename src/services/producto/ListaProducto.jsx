import React, { useState, useEffect } from "react";
import { getProductos, getProductoById, updateProducto, getUnidadMedida, getCategorias } from "../api";
import "../../styles/pages/ProductoStock.css";

const ProductList = () => {
  const [productos, setProductos] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [fetchError, setFetchError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [unidadesMedida, setUnidadesMedida] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [actualizarLista, setActualizarLista] = useState(false);


  const [formValues, setFormValues] = useState({
    idProducto: "",
    nombreProducto: "",
    marca: "",
    descripcion: "",
    estado: "",
    fechaActivo: "",
    fechaInactivo: "",
    presentacion: "",
    imagenUrl: "",
    idUnidadMedida: "",
    idCategoria: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productosData = await getProductos();
        const unidadesMedidaData = await getUnidadMedida();
        const categoriasData = await getCategorias();

        setProductos(productosData);
        setUnidadesMedida(unidadesMedidaData);
        setCategorias(categoriasData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setFetchError("Error al cargar los datos.");
      }
    };
    fetchData();
  }, [actualizarLista]);

  const filteredProductos = productos.filter((producto) =>
    producto.nombreProducto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditarProducto = async (idProducto) => {
    try {
      const productoData = await getProductoById(idProducto);
      const fechaActivo = productoData.fechaActivo ? productoData.fechaActivo.split("T")[0] : "";
      const fechaInactivo = productoData.fechaInactivo ? productoData.fechaInactivo.split("T")[0] : "";

      setFormValues({
        idProducto: productoData.idProducto,
        nombreProducto: productoData.nombreProducto,
        marca: productoData.marca,
        descripcion: productoData.descripcion,
        estado: productoData.estado,
        fechaActivo: fechaActivo,
        fechaInactivo: fechaInactivo,
        presentacion: productoData.presentacion,
        imagenUrl: productoData.imagenUrl,
        idUnidadMedida: productoData.idUnidadMedida,
        idCategoria: productoData.idCategoria,
      });
      setSelectedProducto(productoData); 
      setUpdateSuccess(false);
      setUpdateError(null);
      setMostrarEditar(true);
    } catch (error) {
      console.error("Error al obtener el producto para editar:", error);
      alert("Error al cargar los detalles del producto para editar.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleGuardarCambios = async () => {
    if (!selectedProducto) {
      alert("No hay ningún producto seleccionado para guardar.");
      return;
    }

    try {
      await updateProducto(formValues);
      const updatedProductos = productos.map((prod) =>
        prod.idProducto === formValues.idProducto ? { ...prod, ...formValues } : prod
      );
      setProductos(updatedProductos);
      setUpdateSuccess(true);
      setUpdateError(null);
      setMostrarEditar(false);
      setActualizarLista(!actualizarLista);
    } catch (error) {
      console.error("Error al guardar los cambios del producto:", error);
      setUpdateError(
        "Hubo un error al guardar los cambios. Por favor, inténtalo de nuevo."
      );
      setUpdateSuccess(false);
    }
  };

  const handleCerrarEditar = () => {
    setMostrarEditar(false);
    setSelectedProducto(null);
    setFormValues({
      idProducto: "",
      nombreProducto: "",
      marca: "",
      descripcion: "",
      estado: "",
      fechaActivo: "",
      fechaInactivo: "",
      presentacion: "",
      imagenUrl: "",
      idUnidadMedida: "",
      idCategoria: "",
    });
  };

  return (
    <div className="main-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="content-container">
        <div className="products-column" style={{ flex: mostrarEditar ? "0 0 60%" : "1" }}>
          <h2 className="title">Lista de Productos</h2>
          {fetchError && <p className="error-message">{fetchError}</p>}
          <div className="products-grid">
            {filteredProductos.map((producto) => (
              <div key={producto.idProducto} className="product-card">
                <div className="image-container">
                  <img
                    src={producto.imagenUrl}
                    alt={producto.nombreProducto}
                    className="product-image"
                  />
                </div>
                <div className="product-details">
                  <h3 className="product-brand">{producto.marca}</h3>
                  <p className="product-name">{producto.nombreProducto}</p>
                  <p className="product-description">{producto.descripcion}</p>
                  <p className="product-presentation">
                    Presentación: {producto.presentacion}
                  </p>
                  <p className="product-state">Estado: {producto.estado}</p>
                  <button
                    className="select-button"
                    onClick={() => handleEditarProducto(producto.idProducto)}
                  >
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {mostrarEditar && (
          <div className="selected-products-column">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>
                {selectedProducto
                  ? "Editar Producto"
                  : "Selecciona un Producto para Editar"}
              </h3>
              <button className="button-cerrar" onClick={handleCerrarEditar}>
                X
              </button>
            </div>
            {selectedProducto && (
              <div className="edit-form">
                <div className="form-group">
                  <label>Nombre:</label>
                  <input
                    type="text"
                    name="nombreProducto"
                    value={formValues.nombreProducto}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Unidad de Medida:</label>
                  <select
                    name="idUnidadMedida"
                    value={formValues.idUnidadMedida}
                    onChange={handleInputChange}
                  >
                    {unidadesMedida.map((unidad) => (
                      <option
                        key={unidad.idUnidadMedida}
                        value={unidad.idUnidadMedida}
                      >
                        {unidad.nombreUnidadMedida} ({unidad.abreviatura})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Categoría:</label>
                  <select
                    name="idCategoria"
                    value={formValues.idCategoria}
                    onChange={handleInputChange}
                  >
                    {categorias.map((categoria) => (
                      <option
                        key={categoria.idCategoria}
                        value={categoria.idCategoria}
                      >
                        {categoria.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Marca:</label>
                  <input
                    type="text"
                    name="marca"
                    value={formValues.marca}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Descripción:</label>
                  <textarea
                    name="descripcion"
                    value={formValues.descripcion}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Presentación:</label>
                  <input
                    type="text"
                    name="presentacion"
                    value={formValues.presentacion}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Estado:</label>
                  <select
                    name="estado"
                    value={formValues.estado}
                    onChange={handleInputChange}
                  >
                    <option value="ACTIVO">ACTIVO</option>
                    <option value="INACTIVO">INACTIVO</option>
                  </select>
                </div>

                {formValues.estado === "INACTIVO" && (
                  <div className="form-group">
                    <label>Fecha Inactivo:</label>
                    <input
                      type="date"
                      name="fechaInactivo"
                      value={formValues.fechaInactivo}
                      onChange={handleInputChange}
                    />
                  </div>
                )}

                {formValues.estado === "ACTIVO" && (
                  <div className="form-group">
                    <label>Fecha Activo:</label>
                    <input
                      type="date"
                      name="fechaActivo"
                      value={formValues.fechaActivo}
                      onChange={handleInputChange}
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Imagen:</label>
                  <input
                    type="text"
                    name="imagenUrl"
                    value={formValues.imagenUrl}
                    onChange={handleInputChange}
                  />
                </div>
                <button onClick={handleGuardarCambios}>Guardar Cambios</button>
                {updateSuccess && (
                  <p className="success-message">
                    Producto actualizado con éxito
                  </p>
                )}
                {updateError && (
                  <p className="error-message">{updateError}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;

