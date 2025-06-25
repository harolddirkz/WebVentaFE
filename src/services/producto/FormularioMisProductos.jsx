import React, { useState, useEffect } from "react";
import { getMyProductos, registrarVenta, getUsuarios, getClientes, crearClienteRapido, getNumeracionComprobante } from "../api";
import "../../styles/pages/FormularioMisProductos.css";
import Select from 'react-select';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

Modal.setAppElement('#root');

const MyProductList = () => {
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalImporte, setTotalImporte] = useState(0);
  const [ventaRealizada, setVentaRealizada] = useState(false);
  const [errorVenta, setErrorVenta] = useState(null);
  const [formData, setFormData] = useState({
    tipoComprobante: "NOTA_DE_VENTA",
    numeroComprobante: "", 
    cliente: null,
    usuario: "",
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    tipoDocumento: "DNI",
    numeroDocumento: "",
    telefono: "",
  });
  const [errorNuevoCliente, setErrorNuevoCliente] = useState(null);
  const [cargandoNuevoCliente, setCargandoNuevoCliente] = useState(false);
  const [cargandoNumeracion, setCargandoNumeracion] = useState(false);

  const tipoComprobanteOptions = [
    "BOLETA_DE_VENTA",
    "FACTURA",
    "NOTA_DE_VENTA",
    "TICKET",
    "GUIA_DE_REMISION",
    "RECIBO",
    "DESCONOCIDO"
  ];

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const productsData = await getMyProductos();
        setProductos(productsData);
        const usuariosData = await getUsuarios();
        setUsuarios(usuariosData || []);
        const clientesData = await getClientes();
        setClientes(clientesData.map(cliente => ({
          value: cliente.idCliente,
          label: cliente.nombreCliente,
        })));
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchNumeracion = async () => {
      setCargandoNumeracion(true);
      try {
        const numeracionData = await getNumeracionComprobante(formData.tipoComprobante);
        if (numeracionData && numeracionData.serieComprobante) {
          setFormData(prevFormData => ({
            ...prevFormData,
            numeroComprobante: numeracionData.serieComprobante, 
          }));
        } else {
            setFormData(prevFormData => ({
                ...prevFormData,
                numeroComprobante: "",
            }));
        }
      } catch (error) {
        console.error("Error al obtener la numeración del comprobante:", error);
        setFormData(prevFormData => ({
            ...prevFormData,
            numeroComprobante: "Error al cargar",
        }));
      } finally {
        setCargandoNumeracion(false);
      }
    };

    fetchNumeracion();
  }, [formData.tipoComprobante]);

  const filteredProducts = productos.filter((producto) =>
    producto.nombreProducto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectProduct = (producto) => {
    if (!selectedProducts.some((p) => p.idProducto === producto.idProducto)) {
      setSelectedProducts([
        ...selectedProducts,
        { ...producto, cantidad: 1 }
      ]);
    }
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    const parsedQuantity = parseInt(newQuantity, 10);
    setSelectedProducts((prevSelected) =>
      prevSelected.map((product) =>
        product.idProducto === productId
          ? {
              ...product,
              cantidad:
                isNaN(parsedQuantity) || parsedQuantity < 1
                  ? 1
                  : parsedQuantity > product.cantidadStock
                  ? product.cantidadStock
                  : parsedQuantity,
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

  const handleChangeForm = async (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "tipoComprobante") {
      setCargandoNumeracion(true);
      try {
        const numeracionData = await getNumeracionComprobante(value);
        if (numeracionData && numeracionData.serieComprobante) {
          setFormData(prevFormData => ({
            ...prevFormData,
            numeroComprobante: numeracionData.serieComprobante,
          }));
        } else {
            setFormData(prevFormData => ({
                ...prevFormData,
                numeroComprobante: "",
            }));
        }
      } catch (error) {
        console.error("Error al obtener la numeración del comprobante:", error);
        setFormData(prevFormData => ({
            ...prevFormData,
            numeroComprobante: "Error al cargar",
        }));
      } finally {
        setCargandoNumeracion(false);
      }
    }
  };

  const handleClienteChange = (selectedOption) => {
    setFormData({ ...formData, cliente: selectedOption ? selectedOption.value : null });
  };

  const calcularImporte = (producto) => {
    const precio = parseFloat(producto.ultimoPrecioVenta) || 0;
    const cantidad = parseInt(producto.cantidad, 10) || 0;
    const importe = precio * cantidad;
    if (isNaN(importe)) {
      console.error("Error al calcular importe:", producto);
      return '0.00';
    }
    return importe.toFixed(2);
  };

  const calcularUtilidad = (producto) => {
    return (producto.cantidad * (producto.ultimoPrecioVenta - producto.ultimoPrecioUnitario)).toFixed(2);
  };

  useEffect(() => {
    const newTotal = selectedProducts.reduce(
      (sum, product) => sum + parseFloat(calcularImporte(product)),
      0
    );
    setTotalImporte(newTotal);
  }, [selectedProducts]);

  const getTodayDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleRealizarVenta = async () => {
    if (selectedProducts.length === 0) {
      alert("Por favor, selecciona al menos un producto para realizar la venta.");
      return;
    }

    if (!formData.cliente) {
      alert("Por favor, selecciona un cliente.");
      return;
    }

    let serieComprobanteToSend = "";
    let numeroComprobanteToSend = null;

    if (formData.numeroComprobante) {
      const parts = formData.numeroComprobante.split('-');
      if (parts.length === 2) {
        serieComprobanteToSend = parts[0];
        numeroComprobanteToSend = parseInt(parts[1], 10);
        if (isNaN(numeroComprobanteToSend)) {
          console.warn("La parte del número del comprobante no es un número válido. Enviando null.");
          numeroComprobanteToSend = null;
        }
      } else {
        console.warn("El formato de numeroComprobante no es 'SERIE-NUMERO'. Enviando serie vacía y número nulo.");
      }
    }

    const detallesVenta = selectedProducts.map((producto) => ({
      idProducto: producto.idProducto,
      cantidad: producto.cantidad,
      precioVenta: producto.ultimoPrecioVenta,
      precioUnitario: producto.ultimoPrecioUnitario,
      importe: parseFloat(calcularImporte(producto)),
      utilidad: parseFloat(calcularUtilidad(producto)),
    }));

    const ventaData = {
      idCliente: formData.cliente,
      idUsuario: formData.usuario,
      total: parseFloat(totalImporte.toFixed(2)),
      tipoComprobante: formData.tipoComprobante,
      serieComprobante: serieComprobanteToSend,
      numeroComprobante: numeroComprobanteToSend,
      fechaVenta: getTodayDate(),
      metodoPago: "Efectivo",
      detalles: detallesVenta,
    };

    try {
      await registrarVenta(ventaData);
      setVentaRealizada(true);
      setErrorVenta(null);
      setSelectedProducts([]);
      setTotalImporte(0);
      setFormData({ ...formData, numeroComprobante: "", cliente: null }); 
      alert("Venta realizada con éxito!");
      
      try {
        const numeracionData = await getNumeracionComprobante(formData.tipoComprobante);
        if (numeracionData && numeracionData.serieComprobante) {
          setFormData(prevFormData => ({
            ...prevFormData,
            numeroComprobante: numeracionData.serieComprobante,
          }));
        }
      } catch (numError) {
        console.error("Error al obtener la nueva numeración después de la venta:", numError);
      }

    } catch (error) {
      console.error("Error al realizar la venta:", error);
      setErrorVenta("Hubo un error al realizar la venta. Por favor, inténtalo de nuevo.");
      setVentaRealizada(false);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setNuevoCliente({ tipoDocumento: "DNI", numeroDocumento: "", telefono: "" });
    setErrorNuevoCliente(null);
  };

  const handleNuevoClienteChange = (e) => {
    const { name, value } = e.target;
    setNuevoCliente({ ...nuevoCliente, [name]: value });
  };

  const handleCrearClienteRapido = async () => {
    setCargandoNuevoCliente(true);
    setErrorNuevoCliente(null);
    try {
      const nuevoClienteResponse = await crearClienteRapido(nuevoCliente);
      if (nuevoClienteResponse && nuevoClienteResponse.idCliente && nuevoClienteResponse.nombreCliente) {
        const nuevoClienteOption = { value: nuevoClienteResponse.idCliente, label: nuevoClienteResponse.nombreCliente };
        setClientes([...clientes, nuevoClienteOption]);
        setFormData({ ...formData, cliente: nuevoClienteOption.value });
        closeModal();
        alert(`Cliente "${nuevoClienteResponse.nombreCliente}" creado exitosamente.`);
      } else {
        setErrorNuevoCliente("Error al crear el cliente.");
      }
    } catch (error) {
      console.error("Error al crear cliente rápido:", error);
      setErrorNuevoCliente("Error de conexión al crear el cliente.");
    } finally {
      setCargandoNuevoCliente(false);
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
        <div className="products-column">
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
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="selected-products-column">
          <h3>Detalle de Venta</h3>
          <div className="form-fields-above-table">
            <div className="form-group">
              <label>Tipo de Comprobante:</label>
              <select
                name="tipoComprobante"
                value={formData.tipoComprobante}
                onChange={handleChangeForm}
              >
                {tipoComprobanteOptions.map((optionValue) => (
                  <option key={optionValue} value={optionValue}>
                    {optionValue.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Serie y Número:</label>
              <input
                type="text"
                name="numeroComprobante"
                value={cargandoNumeracion ? "Cargando..." : formData.numeroComprobante}
                required
                disabled={true}
              />
              {cargandoNumeracion && <p className="loading-message">Obteniendo numeración...</p>}
            </div>

            <div className="form-group">
              <label>Cliente:</label>
              <Select
                value={clientes.find(option => option.value === formData.cliente)}
                onChange={handleClienteChange}
                options={clientes}
                placeholder="Buscar o seleccionar cliente..."
                isSearchable
              />
              <button type="button" className="button-nuevo-cliente" onClick={openModal}>
                + Nuevo Cliente
              </button>
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

          <h3>Productos Seleccionados</h3>
          <div className="table-container">
            <table className="sales-table-content">
              <thead>
                <tr>
                  <th style={{ width: "50%" }}>Nombre</th>
                  <th style={{ width: "10%" }}>Cant.</th>
                  <th style={{ width: "15%" }}>P.V.</th>
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
                        max={producto.cantidadStock}
                        value={producto.cantidad || 1}
                        onChange={(e) =>
                          handleUpdateQuantity(
                            producto.idProducto,
                            e.target.value
                          )
                        }
                      />
                      {producto.cantidad > producto.cantidadStock && (
                        <p className="stock-warning">
                          Stock disponible: {producto.cantidadStock}
                        </p>
                      )}
                    </td>
                    <td>S/.{producto.ultimoPrecioVenta}</td>
                    <td>S/.{calcularImporte(producto)}</td>
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
          <div className="total-importe">
            <p>Total: S/. {totalImporte.toFixed(2)}</p>
          </div>
          <div className="realizar-venta-container">
            <button className="realizar-venta-button" onClick={handleRealizarVenta}>
              Realizar Venta
            </button>
            {errorVenta && <p className="error-message">{errorVenta}</p>}
            {ventaRealizada && <p className="success-message">Venta realizada</p>}
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Nuevo Cliente"
      >
        <h2>Nuevo Cliente</h2>
        <div className="form-group">
          <label>Tipo de Documento:</label>
          <select
            name="tipoDocumento"
            value={nuevoCliente.tipoDocumento}
            onChange={handleNuevoClienteChange}
          >
            <option value="DNI">DNI</option>
            <option value="RUC">RUC</option>
          </select>
        </div>
        <div className="form-group">
          <label>Número de Documento:</label>
          <input
            type="text"
            name="numeroDocumento"
            value={nuevoCliente.numeroDocumento}
            onChange={handleNuevoClienteChange}
          />
        </div>
        <div className="form-group">
          <label>Teléfono:</label>
          <input
            type="text"
            name="telefono"
            value={nuevoCliente.telefono}
            onChange={handleNuevoClienteChange}
          />
        </div>
        {errorNuevoCliente && <p className="error-message">{errorNuevoCliente}</p>}
        <div className="modal-buttons">
          <button onClick={handleCrearClienteRapido} disabled={cargandoNuevoCliente}>
            {cargandoNuevoCliente ? "Guardando..." : "Guardar Cliente"}
          </button>
          <button onClick={closeModal}>Cancelar</button>
        </div>
      </Modal>
    </div>
  );
};

export default MyProductList;