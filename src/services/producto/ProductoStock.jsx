import React, { useState, useEffect } from "react";
import { getMyProductos, getMiProductoById, updateMiProducto } from "../api";
import "../../styles/pages/ProductoStock.css";

const ProductoStock = () => {
  const [productos, setProductos] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editData, setEditData] = useState({
    cantidadStock: "",
    ultimoPrecioUnitario: "",
    ultimoPrecioVenta: "",
  });
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const productsData = await getMyProductos();
        setProductos(productsData);
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
      }
    };

    fetchInitialData();
  }, []);

  const filteredProducts = productos.filter((producto) =>
    producto.nombreProducto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditarProducto = async (idProducto) => {
    try {
      const detailedProduct = await getMiProductoById(idProducto);
      setSelectedProduct(detailedProduct);
      setEditData({
        cantidadStock: detailedProduct.cantidadStock,
        ultimoPrecioUnitario: detailedProduct.ultimoPrecioUnitario,
        ultimoPrecioVenta: detailedProduct.ultimoPrecioVenta,
      });
      setMostrarEditar(true);
      setUpdateSuccess(false);
      setUpdateError(null);
    } catch (error) {
      console.error("Error al obtener detalles del producto:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleCerrarEditar = () => {
    setSelectedProduct(null);
    setMostrarEditar(false);
  };

  const handleGuardarCambios = async () => {
    if (!selectedProduct) return;

  const productoActualizado = {
    idProducto: selectedProduct.idProducto,
    cantidadStock: parseInt(editData.cantidadStock, 10),
    ultimoPrecioUnitario: parseFloat(editData.ultimoPrecioUnitario),
    ultimoPrecioVenta: parseFloat(editData.ultimoPrecioVenta),
  };

  try {
    await updateMiProducto(productoActualizado);
    setUpdateSuccess(true);
    setUpdateError(null);

    setProductos(prevProductos =>
      prevProductos.map(producto =>
        producto.idProducto === selectedProduct.idProducto
          ? {
              ...producto,
              cantidadStock: parseInt(editData.cantidadStock, 10),
              ultimoPrecioUnitario: parseFloat(editData.ultimoPrecioUnitario),
              ultimoPrecioVenta: parseFloat(editData.ultimoPrecioVenta),
            }
          : producto
      )
    );
    handleCerrarEditar();
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    setUpdateError("Error al actualizar el producto. Por favor, inténtalo de nuevo.");
    setUpdateSuccess(false);
  }
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
          <h2 className="title">Datos de Venta</h2>
          <div className="products-grid">
            {filteredProducts.map((producto) => (
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
                  <p className="product-stock">
                    Stock: {producto.cantidadStock}
                  </p>
                  <p className="product-purchase">
                    P.Compra: S/.{producto.ultimoPrecioUnitario}
                  </p>
                  <p className="product-sales">
                    P.Venta: S/. {producto.ultimoPrecioVenta}
                  </p>
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

        {mostrarEditar && selectedProduct && (
          <div className="selected-products-column">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Editar Producto</h3>
              <button className="button-cerrar" onClick={handleCerrarEditar}>
                X
              </button>
            </div>
            <div className="edit-form">
              <div className="form-group">
                <label htmlFor="nombreProducto">Nombre:</label>
                <input
                  type="text"
                  id="nombreProducto"
                  value={selectedProduct.nombreProducto}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label htmlFor="marca">Marca:</label>
                <input
                  type="text"
                  id="marca"
                  value={selectedProduct.marca}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label htmlFor="presentacion">Presentación:</label>
                <input
                  type="text"
                  id="presentacion"
                  value={selectedProduct.presentacion}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label htmlFor="cantidadStock">Stock:</label>
                <input
                  type="number"
                  id="cantidadStock"
                  name="cantidadStock"
                  value={editData.cantidadStock}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="ultimoPrecioUnitario">P.Compra:</label>
                <input
                  type="number"
                  id="ultimoPrecioUnitario"
                  name="ultimoPrecioUnitario"
                  value={editData.ultimoPrecioUnitario}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="ultimoPrecioVenta">P.Venta:</label>
                <input
                  type="number"
                  id="ultimoPrecioVenta"
                  name="ultimoPrecioVenta"
                  value={editData.ultimoPrecioVenta}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductoStock;