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

  const [validationErrors, setValidationErrors] = useState({});

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
        setErrorCompra("Error al cargar los datos iniciales. Por favor, intente recargar la página.");
      } finally {
        setLoading(false);
      }
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
      setSelectedProducts((prevSelected) => [
        ...prevSelected,
        {
          ...producto,
          cantidad: 1,
          // Si el producto es "Servicio Mecanico", inicializar precioUnitario en 0
          precioUnitario: producto.nombreProducto === "Servicio Mecanico" ? 0 : (producto.ultimoPrecioUnitario || 0),
          precioVenta: producto.ultimoPrecioVenta || 0,
          importe: (1 * (producto.nombreProducto === "Servicio Mecanico" ? 0 : (producto.ultimoPrecioUnitario || 0))).toFixed(2),
        },
      ]);
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.selectedProducts;
        return newErrors;
      });
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
              cantidad: isNaN(parsedQuantity) || parsedQuantity < 1 ? "" : parsedQuantity,
              importe: calculateImporte(
                isNaN(parsedQuantity) || parsedQuantity < 1 ? 0 : parsedQuantity,
                product.precioUnitario
              ),
            }
          : product
      )
    );
  };

  const handleUpdateField = (productId, field, value) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.map((product) => {
        const parsedValue = parseNumber(value);
        let updatedProduct = {
          ...product,
          [field]: value
        };

        if (field === "precioUnitario" || field === "cantidad") {
          updatedProduct.importe = calculateImporte(
            field === "cantidad" ? parsedValue : product.cantidad,
            field === "precioUnitario" ? parsedValue : product.precioUnitario
          );
        }
        return updatedProduct;
      })
    );
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.filter((product) => product.idProducto !== productId)
    );
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      if (selectedProducts.length - 1 === 0) {
        newErrors.selectedProducts = "Debe seleccionar al menos un producto.";
      } else {
        delete newErrors.selectedProducts;
      }
      return newErrors;
    });
  };

  const handleChangeForm = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  };

  const calculateImporte = (cantidad, precioUnitario) => {
    const qty = parseNumber(cantidad);
    const pu = parseNumber(precioUnitario);
    return (qty * pu).toFixed(2);
  };

  useEffect(() => {
    const newTotal = selectedProducts.reduce(
      (sum, product) => sum + parseNumber(calculateImporte(product.cantidad, product.precioUnitario)),
      0
    );
    setTotalImporteCompra(newTotal.toFixed(2));
  }, [selectedProducts]);


  // --- Función de Validación Modificada ---
  const validateForm = () => {
    const errors = {};

    // Validar campos principales del formulario
    if (!formData.numeroComprobante.trim()) {
      errors.numeroComprobante = "El número de comprobante es requerido.";
    }
    if (!formData.proveedor) {
      errors.proveedor = "Debe seleccionar un proveedor.";
    }
    if (!formData.usuario) {
      errors.usuario = "Debe seleccionar un usuario.";
    }

    // Validar productos seleccionados
    if (selectedProducts.length === 0) {
      errors.selectedProducts = "Debe seleccionar al menos un producto para la compra.";
    } else {
      selectedProducts.forEach((product, index) => {
        if (!product.cantidad || parseNumber(product.cantidad) < 1) {
          errors[`cantidad_${product.idProducto}`] = `La cantidad de ${product.nombreProducto} debe ser al menos 1.`;
        }

        // Lógica de validación del precio unitario:
        // Si el nombre del producto es "Servicio Mecanico", se permite 0 o mayor.
        // De lo contrario, debe ser mayor que 0.
        if (product.nombreProducto.trim().toLowerCase() === "servicio mecanico") {
          if (parseNumber(product.precioUnitario) < 0) {
              errors[`precioUnitario_${product.idProducto}`] = `El precio unitario de ${product.nombreProducto} no puede ser negativo.`;
          }
        } else {
          // Para todos los demás productos, debe ser estrictamente mayor que 0
          if (!product.precioUnitario || parseNumber(product.precioUnitario) <= 0) {
            errors[`precioUnitario_${product.idProducto}`] = `El precio unitario de ${product.nombreProducto} debe ser mayor que 0.`;
          }
        }

        if (!product.precioVenta || parseNumber(product.precioVenta) <= 0) {
          errors[`precioVenta_${product.idProducto}`] = `El precio de venta de ${product.nombreProducto} debe ser mayor que 0.`;
        }
      });
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const handleSubmit = async () => {
    setCompraRegistrada(false);
    setErrorCompra(null);

    if (!validateForm()) {
      alert("Por favor, corrige los errores en el formulario antes de continuar.");
      return;
    }

    const detallesCompra = selectedProducts.map(
      ({ idProducto, cantidad, precioUnitario, precioVenta }) => ({
        idProducto,
        cantidad: parseInt(cantidad, 10),
        precioUnitario: parseNumber(precioUnitario),
        precioVenta: parseNumber(precioVenta),
        importe: parseNumber(calculateImporte(cantidad, precioUnitario)),
      })
    );

    const compraData = {
      idProveedor: formData.proveedor,
      idUsuario: formData.usuario,
      tipoComprobante: formData.tipoComprobante,
      numeroComprobante: formData.numeroComprobante,
      total: parseNumber(totalImporteCompra),
      detalles: detallesCompra,
    };

    setLoading(true);
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
      setValidationErrors({});
      alert("Compra registrada exitosamente!");
    } catch (error) {
      console.error("Error al registrar la compra:", error);
      setErrorCompra(error.response?.data?.message || "Hubo un error al registrar la compra. Por favor, inténtalo de nuevo.");
      setCompraRegistrada(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container compra-form-container">
      <h2>Registrar Compra</h2>

      {errorCompra && <p className="error-message alert alert-danger">{errorCompra}</p>}
      {compraRegistrada && <p className="success-message alert alert-success">Compra registrada exitosamente!</p>}

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
                      Ultimo .P.U.: S/.{producto.ultimoPrecioUnitario ? producto.ultimoPrecioUnitario.toFixed(2) : '0.00'}
                    </p>
                    <p className="product-sales">
                      Ultimo .P.V.: S/. {producto.ultimoPrecioVenta ? producto.ultimoPrecioVenta.toFixed(2) : '0.00'}
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
                className={validationErrors.numeroComprobante ? 'input-error' : ''}
              />
              {validationErrors.numeroComprobante && (
                <p className="error-message">{validationErrors.numeroComprobante}</p>
              )}
            </div>

            <div className="form-group">
              <label>Proveedor:</label>
              <select
                name="proveedor"
                value={formData.proveedor}
                onChange={handleChangeForm}
                className={validationErrors.proveedor ? 'input-error' : ''}
              >
                <option value="">Seleccione un proveedor</option>
                {proveedores.map((proveedor) => (
                  <option key={proveedor.idProveedor} value={proveedor.idProveedor}>
                    {proveedor.razonSocial}
                  </option>
                ))}
              </select>
              {validationErrors.proveedor && (
                <p className="error-message">{validationErrors.proveedor}</p>
              )}
            </div>

            <div className="form-group">
              <label>Usuario:</label>
              <select
                name="usuario"
                value={formData.usuario}
                onChange={handleChangeForm}
                className={validationErrors.usuario ? 'input-error' : ''}
              >
                <option value="">Seleccione un usuario</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.idUsuario} value={usuario.idUsuario}>
                    {usuario.nombre}
                  </option>
                ))}
              </select>
              {validationErrors.usuario && (
                <p className="error-message">{validationErrors.usuario}</p>
              )}
            </div>
          </div>

          {validationErrors.selectedProducts && (
            <p className="error-message alert alert-danger">{validationErrors.selectedProducts}</p>
          )}

          <div className="table-container">
            <table className="purchase-table-content">
              <thead>
                <tr>
                  <th style={{ width: "40%" }}>Nombre</th>
                  <th style={{ width: "10%" }}>Cant.</th>
                  <th style={{ width: "15%" }}>P. Unitario</th>
                  <th style={{ width: "15%" }}>P. Venta</th>
                  <th style={{ width: "15%" }}>Importe</th>
                  <th style={{ width: "5%" }}></th>
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
                        value={producto.cantidad}
                        onChange={(e) =>
                          handleUpdateQuantity(
                            producto.idProducto,
                            e.target.value
                          )
                        }
                        className={validationErrors[`cantidad_${producto.idProducto}`] ? 'input-error' : ''}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        // El atributo min puede variar, la validación principal es en JS
                        value={producto.precioUnitario}
                        onChange={(e) =>
                          handleUpdateField(
                            producto.idProducto,
                            "precioUnitario",
                            e.target.value
                          )
                        }
                        className={validationErrors[`precioUnitario_${producto.idProducto}`] ? 'input-error' : ''}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={producto.precioVenta}
                        onChange={(e) =>
                          handleUpdateField(
                            producto.idProducto,
                            "precioVenta",
                            e.target.value
                          )
                        }
                        className={validationErrors[`precioVenta_${producto.idProducto}`] ? 'input-error' : ''}
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
                {selectedProducts.map(product => (
                  <React.Fragment key={`errors-${product.idProducto}`}>
                    {validationErrors[`cantidad_${product.idProducto}`] && (
                      <tr>
                        <td colSpan="6" className="error-message product-error-row">
                          {validationErrors[`cantidad_${product.idProducto}`]}
                        </td>
                      </tr>
                    )}
                    {validationErrors[`precioUnitario_${product.idProducto}`] && (
                      <tr>
                        <td colSpan="6" className="error-message product-error-row">
                          {validationErrors[`precioUnitario_${product.idProducto}`]}
                        </td>
                      </tr>
                    )}
                    {validationErrors[`precioVenta_${product.idProducto}`] && (
                      <tr>
                        <td colSpan="6" className="error-message product-error-row">
                          {validationErrors[`precioVenta_${product.idProducto}`]}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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
              disabled={loading}
            >
              {loading ? "Registrando Compra..." : "Registrar Compra"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompraForm;