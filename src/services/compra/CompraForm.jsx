import React, { useState, useEffect, useMemo } from "react";
import { getProductosPorEstado, getProveedores, getUsuarios, requestCompra } from "../api";
import "../../styles/pages/CompraForm.css";

const CompraForm = () => {
  const [productos, setProductos] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [proveedores, setProveedores] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [compraRegistrada, setCompraRegistrada] = useState(false);
  const [errorCompra, setErrorCompra] = useState(null);
  const [formData, setFormData] = useState({
    tipoComprobante: "BOLETA DE VENTA",
    numeroComprobante: "",
    proveedor: "",
    usuario: "",
  });
  const [totalImporteCompra, setTotalImporteCompra] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const productosData = await getProductosPorEstado();
        setProductos(productosData);
        const proveedoresData = await getProveedores();
        setProveedores(proveedoresData || []);
        const usuariosData = await getUsuarios();
        setUsuarios(usuariosData || []);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setErrorCompra("Error al cargar los datos iniciales.");
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    return productos.filter((producto) =>
      producto.nombreProducto.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [productos, searchTerm]);

  const handleSelectProduct = (producto) => {
    if (!selectedProducts.some((p) => p.idProducto === producto.idProducto)) {
      setSelectedProducts([
        ...selectedProducts,
        {
          ...producto,
          cantidad: 1,
          precioUnitario: producto.precioUnitario || 0,
          importe: (producto.precioUnitario || 0).toFixed(2),
        },
      ]);
    }
  };

  const parseNumber = (value) => {
    const number = parseFloat(value);
    return isNaN(number) ? 0 : number;
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    const parsedQuantity = parseInt(newQuantity, 10);
    setSelectedProducts((prevSelected) =>
      prevSelected.map((product) =>
        product.idProducto === productId
          ? {
              ...product,
              cantidad: isNaN(parsedQuantity) || parsedQuantity < 1 ? 1 : parsedQuantity,
              importe: calculateImporte(
                isNaN(parsedQuantity) || parsedQuantity < 1 ? 1 : parsedQuantity,
                product.precioUnitario
              ), 
            }
          : product
      )
    );
  };

  const handleUpdateField = (productId, field, value) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.map((product) =>
        product.idProducto === productId
          ? {
              ...product,
              [field]: value,
              ...(field === "precioUnitario" && {
                importe: calculateImporte(product.cantidad, value), 
              }),
            }
          : product
      )
    );
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.filter((product) => product.idProducto !== productId)
    );
  };

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const calculateImporte = (cantidad, precioUnitario) => {
    if (cantidad && precioUnitario) {
      return (parseFloat(cantidad) * parseFloat(precioUnitario)).toFixed(2);
    }
    return "0.00";
  };

  useEffect(() => {
    const newTotal = selectedProducts.reduce(
      (sum, product) => sum + parseFloat(calculateImporte(product.cantidad, product.precioUnitario)),
      0
    );
    setTotalImporteCompra(newTotal.toFixed(2));
  }, [selectedProducts]);

  const handleSubmit = async () => {
    if (selectedProducts.length === 0) {
      alert("Por favor, selecciona al menos un producto para realizar la compra.");
      return;
    }

    const detallesCompra = selectedProducts.map(
      ({ idProducto, cantidad, precioUnitario, precioVenta, importe }) => ({
        idProducto,
        cantidad: parseInt(cantidad, 10), 
        precioUnitario: parseNumber(precioUnitario), 
        precioVenta: parseFloat(precioVenta), 
        importe: parseFloat(importe), 
      })
    );

    const compraData = {
      idProveedor: formData.proveedor,
      idUsuario: formData.usuario,
      tipoComprobante: formData.tipoComprobante,
      numeroComprobante: formData.numeroComprobante,
      total: parseFloat(totalImporteCompra), 
      detalles: detallesCompra,
    };

    try {
      await requestCompra(compraData);
      setCompraRegistrada(true);
      setErrorCompra(null);
      setSelectedProducts([]);
      setFormData({
        tipoComprobante: "BOLETA DE VENTA",
        numeroComprobante: "",
        proveedor: "",
        usuario: "",
      });
      setTotalImporteCompra(0); 
      alert("Compra registrada exitosamente!");
    } catch (error) {
      console.error("Error al registrar la compra:", error);
      setErrorCompra("Hubo un error al registrar la compra. Por favor, inténtalo de nuevo.");
      setCompraRegistrada(false);
    }
  };

  return (
    <div className="main-container compra-form-container">
      <h2>Registrar Compra</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="content-container">
        <div className="products-column">
          <h3 className="title">Lista de Productos</h3>
          <div className="products-grid compra-grid">
            {loading ? (
              <p>Cargando productos...</p>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((producto) => (
                <div key={producto.idProducto} className="product-card compra-card">
                  <div className="image-container">
                    <img
                      src={producto.imagenUrl}
                      alt={producto.nombreProducto}
                      className="product-image"
                    />
                    <button
                      className="select-button"
                      onClick={() => handleSelectProduct(producto)}
                    >
                      Seleccionar
                    </button>
                  </div>
                  <div className="product-details">
                    <h3 className="product-brand">{producto.marca}</h3>
                    <p className="product-name">{producto.nombreProducto}</p>
                    <p className="product-presentation">
                      Presentación: {producto.presentacion}
                    </p>
                    <p className="product-purchase">
                    Ultimo .P.U.: S/.{producto.ultimoPrecioUnitario}
                    </p>
                    <p className="product-sales">
                    Ultimo .P.V.: S/. {producto.ultimoPrecioVenta}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>{loading ? "" : "No se encontraron productos."}</p>
            )}
          </div>
        </div>

        <div className="selected-products-column">
          <h3>Detalle de Compra</h3>
          <div className="form-fields-above-table">
            <div className="form-group">
              <label>Tipo de Comprobante:</label>
              <select
                name="tipoComprobante"
                value={formData.tipoComprobante}
                onChange={handleChangeForm}
              >
                <option value="BOLETA DE VENTA">BOLETA DE VENTA</option>
                <option value="FACTURA">FACTURA</option>
              </select>
            </div>

            <div className="form-group">
              <label>Número de Comprobante:</label>
              <input
                type="text"
                name="numeroComprobante"
                value={formData.numeroComprobante}
                onChange={handleChangeForm}
                required
              />
            </div>

            <div className="form-group">
              <label>Proveedor:</label>
              <select name="proveedor" value={formData.proveedor} onChange={handleChangeForm} required>
                <option value="">Seleccione un proveedor</option>
                {proveedores.map((proveedor) => (
                  <option key={proveedor.idProveedor} value={proveedor.idProveedor}>
                    {proveedor.razonSocial}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Usuario:</label>
              <select name="usuario" value={formData.usuario} onChange={handleChangeForm} required>
                <option value="">Seleccione un usuario</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.idUsuario} value={usuario.idUsuario}>
                    {usuario.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="table-container">
            <table className="purchase-table-content">
              <thead>
                <tr>
                  <th style={{ width: "50%" }}>Nombre</th>
                  <th style={{ width: "5%" }}>Cant.</th>
                  <th style={{ width: "15%" }}>P. Unitario</th>
                  <th style={{ width: "15%" }}>P. Venta</th>
                  <th style={{ width: "15%" }}>Importe</th>
                  <th style={{ width: "10%" }}></th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((producto) => (
                  <tr key={producto.idProducto}>
                    <td
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {producto.nombreProducto}
                    </td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={producto.cantidad || 1}
                        onChange={(e) =>
                          handleUpdateQuantity(
                            producto.idProducto,
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        value={producto.precioUnitario || 0}
                        onChange={(e) =>
                          handleUpdateField(
                            producto.idProducto,
                            "precioUnitario",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        value={producto.precioVenta || 0}
                        onChange={(e) =>
                          handleUpdateField(
                            producto.idProducto,
                            "precioVenta",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      S/.{calculateImporte(producto.cantidad, producto.precioUnitario)}
                    </td>
                    <td>
                      <button onClick={() => handleRemoveProduct(producto.idProducto)}>
                        X
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="total-importe-compra">
            <p>Total Compra: S/. {totalImporteCompra}</p>
          </div>

          <div className="realizar-compra-container">
            <button
              className="realizar-compra-button"
              onClick={handleSubmit}
              disabled={selectedProducts.length === 0 || loading}
            >
              {loading ? "Registrando Compra..." : "Registrar Compra"}
            </button>
            {errorCompra && <p className="error-message">{errorCompra}</p>}
            {compraRegistrada && <p className="success-message">Compra registrada</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompraForm;