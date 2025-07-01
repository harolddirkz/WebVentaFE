import React, { useState, useEffect } from "react";
import { getMyProductos, registrarVenta, getClientes, crearClienteRapido, getNumeracionComprobante, getLoggedInUser } from "../api";
import "../../styles/pages/FormularioMisProductos.css";
import Select from 'react-select';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '20px',
        borderRadius: '8px',
    },
};

Modal.setAppElement('#root');

const MyProductList = () => {
    const [productos, setProductos] = useState([]);
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
        fechaVenta: new Date(),
    });

    const [validationErrors, setValidationErrors] = useState({});
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [nuevoCliente, setNuevoCliente] = useState({
        tipoDocumento: "DNI",
        numeroDocumento: "",
        telefono: "",
    });
    const [errorNuevoCliente, setErrorNuevoCliente] = useState(null);
    const [validationErrorsNuevoCliente, setValidationErrorsNuevoCliente] = useState({});
    const [cargandoNuevoCliente, setCargandoNuevoCliente] = useState(false);

    const [cargandoNumeracion, setCargandoNumeracion] = useState(false);
    const [loading, setLoading] = useState(false);

    const [currentUser, setCurrentUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [userError, setUserError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setShowModal(true);
    };

    const closeModalImage = () => {
        setShowModal(false);
        setSelectedImage('');
    };
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
            setLoading(true);
            setUserError(null);
            try {
                const productsData = await getMyProductos();
                setProductos(productsData);
                setLoadingUser(true);
                const loggedInUser = await getLoggedInUser();
                setCurrentUser(loggedInUser);
                setFormData(prevData => ({
                    ...prevData,
                    usuario: loggedInUser.idUsuario,
                }));
                setLoadingUser(false);
                const clientesData = await getClientes();
                setClientes(clientesData.map(cliente => ({
                    value: cliente.idCliente,
                    label: cliente.nombreCliente,
                })));
            } catch (error) {
                console.error("Error al cargar datos iniciales:", error);
                if (error.response && error.response.status === 401) {
                    setUserError("Sesión expirada o no autorizado. Por favor, inicie sesión nuevamente.");
                } else {
                    setUserError("Error al cargar los datos iniciales.");
                }
                setErrorVenta("Error al cargar los datos. Por favor, recargue la página.");
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        const fetchNumeracion = async () => {
            setCargandoNumeracion(true);
            setValidationErrors(prevErrors => ({ ...prevErrors, numeroComprobante: null }));
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
                setValidationErrors(prevErrors => ({ ...prevErrors, numeroComprobante: "No se pudo obtener la numeración." }));
            } finally {
                setCargandoNumeracion(false);
            }
        };
        fetchNumeracion();
    }, [formData.tipoComprobante]);

    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                closeModalImage();
            }
        };

        if (showModal) {
            document.addEventListener('keydown', handleEscapeKey);
        } else {
            document.removeEventListener('keydown', handleEscapeKey);
        }

        // Función de limpieza: se ejecuta cuando el componente se desmonta o cuando showModal cambia a false
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [showModal]);

    const filteredProducts = productos.filter((producto) =>
        producto.nombreProducto.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectProduct = (producto) => {
        if (!selectedProducts.some((p) => p.idProducto === producto.idProducto)) {
            setSelectedProducts([
                ...selectedProducts,
                { ...producto, cantidad: 1 }
            ]);
            setValidationErrors(prevErrors => ({ ...prevErrors, selectedProducts: null }));
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
        setValidationErrors(prevErrors => ({ ...prevErrors, productQuantities: null }));
    };

    const handleRemoveProduct = (productId) => {
        setSelectedProducts((prevSelected) =>
            prevSelected.filter((product) => product.idProducto !== productId)
        );
        setValidationErrors(prevErrors => ({ ...prevErrors, selectedProducts: null }));
    };

    const handleChangeForm = async (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setValidationErrors(prevErrors => ({ ...prevErrors, [name]: null }));
    };

    const handleDateChange = (date) => {
        setFormData(prevData => ({
            ...prevData,
            fechaVenta: date,
        }));
        setValidationErrors(prevErrors => ({ ...prevErrors, fechaVenta: null }));
    };

    const handleClienteChange = (selectedOption) => {
        setFormData({ ...formData, cliente: selectedOption ? selectedOption.value : null });
        setValidationErrors(prevErrors => ({ ...prevErrors, cliente: null }));
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

    const validateVentaForm = () => {
        let errors = {};
        let isValid = true;

        if (selectedProducts.length === 0) {
            errors.selectedProducts = "Debe seleccionar al menos un producto.";
            isValid = false;
        } else {
            selectedProducts.forEach(product => {
                if (!product.cantidad || product.cantidad < 1 || product.cantidad > product.cantidadStock) {
                    errors.productQuantities = "Verifique las cantidades de los productos seleccionados. Deben ser al menos 1 y no exceder el stock disponible.";
                    isValid = false;
                }
            });
        }
        if (!formData.tipoComprobante) {
            errors.tipoComprobante = "El tipo de comprobante es requerido.";
            isValid = false;
        }
        if (!formData.numeroComprobante || formData.numeroComprobante === "Error al cargar") {
            errors.numeroComprobante = "La numeración del comprobante es requerida y debe ser válida.";
            isValid = false;
        }
        if (!formData.cliente) {
            errors.cliente = "Debe seleccionar un cliente.";
            isValid = false;
        }
        if (!formData.usuario) {
            errors.usuario = "El usuario de la venta es requerido.";
            isValid = false;
        }
        if (!formData.fechaVenta) {
            errors.fechaVenta = "La fecha de venta es requerida.";
            isValid = false;
        } else if (formData.fechaVenta > new Date()) { 
            errors.fechaVenta = "La fecha de venta no puede ser en el futuro.";
            isValid = false;
        }
        if (totalImporte <= 0) {
            errors.totalImporte = "El importe total debe ser mayor a 0.";
            isValid = false;
        }
        setValidationErrors(errors);
        return isValid;
    };

    const handleRealizarVenta = async () => {
        setErrorVenta(null);
        setVentaRealizada(false);

        if (!validateVentaForm()) {
            console.error("Formulario de venta inválido.");
            setErrorVenta("Por favor, corrige los errores en el formulario.");
            return;
        }

        let serieComprobanteToSend = "";
        let numeroComprobanteToSend = null;

        const parts = formData.numeroComprobante.split('-');
        if (parts.length === 2) {
            serieComprobanteToSend = parts[0];
            numeroComprobanteToSend = parseInt(parts[1], 10);
        }

        const formattedDate = formData.fechaVenta.toISOString().split('T')[0];
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
            fechaVenta: formattedDate, 
            metodoPago: "Efectivo",
            detalles: detallesVenta,
        };

        try {
            await registrarVenta(ventaData);
            setVentaRealizada(true);
            setErrorVenta(null);
            setSelectedProducts([]);
            setTotalImporte(0);
            setFormData(prevData => ({
                ...prevData,
                numeroComprobante: "",
                cliente: null,
                fechaVenta: new Date(), 
            }));
            alert("Venta realizada con éxito!");

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
            } catch (numError) {
                console.error("Error al obtener la nueva numeración después de la venta:", numError);
                setValidationErrors(prevErrors => ({ ...prevErrors, numeroComprobante: "No se pudo obtener la nueva numeración." }));
            }

        } catch (error) {
            console.error("Error al realizar la venta:", error);
            setErrorVenta(error.response?.data?.message || "Hubo un error al realizar la venta. Por favor, inténtalo de nuevo.");
            setVentaRealizada(false);
        }
    };

    const openModal = () => {
        setModalIsOpen(true);
        setErrorNuevoCliente(null);
        setValidationErrorsNuevoCliente({});
        setNuevoCliente({
            nombreCliente: "",
            tipoDocumento: "DNI",
            numeroDocumento: "",
            telefono: "",
        });
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setNuevoCliente({ nombreCliente: "", tipoDocumento: "DNI", numeroDocumento: "", telefono: "" });
        setErrorNuevoCliente(null);
        setValidationErrorsNuevoCliente({});
    };

    const handleNuevoClienteChange = (e) => {
    const { name, value } = e.target

    if (name === "numeroDocumento") {
      const maxLength = nuevoCliente.tipoDocumento === "DNI" ? 8 : 11
      const numericValue = value.replace(/\D/g, "").slice(0, maxLength)
      setNuevoCliente({ ...nuevoCliente, [name]: numericValue })
    } else if (name === "telefono") {
      const numericValue = value.replace(/\D/g, "").slice(0, 9)
      setNuevoCliente({ ...nuevoCliente, [name]: numericValue })
    } else {
      setNuevoCliente({ ...nuevoCliente, [name]: value })
    }
    setValidationErrorsNuevoCliente((prevErrors) => ({ ...prevErrors, [name]: "" }))
  }

    const validateNuevoClienteForm = () => {
        let errors = {};
        let isValid = true;
        if (!nuevoCliente.tipoDocumento) {
            errors.tipoDocumento = "El tipo de documento es requerido.";
            isValid = false;
        }
        if (!nuevoCliente.numeroDocumento.trim()) {
            errors.numeroDocumento = "El número de documento es requerido.";
            isValid = false;
        } else {
            if (nuevoCliente.tipoDocumento === "DNI" && nuevoCliente.numeroDocumento.trim().length !== 8) {
                errors.numeroDocumento = "El DNI debe tener 8 dígitos.";
                isValid = false;
            } else if (nuevoCliente.tipoDocumento === "RUC" && nuevoCliente.numeroDocumento.trim().length !== 11) {
                errors.numeroDocumento = "El RUC debe tener 11 dígitos.";
                isValid = false;
            }
            if (!/^\d+$/.test(nuevoCliente.numeroDocumento.trim())) {
                errors.numeroDocumento = "El número de documento solo debe contener dígitos.";
                isValid = false;
            }
        }
        if (nuevoCliente.telefono.trim() && nuevoCliente.telefono.trim().length > 9) {
            errors.telefono = "El teléfono no puede tener más de 9 dígitos.";
            isValid = false;
        }
        setValidationErrorsNuevoCliente(errors);
        return isValid;
    };

    const handleCrearClienteRapido = async () => {
        if (!validateNuevoClienteForm()) {
            console.error("Formulario de nuevo cliente inválido.");
            return;
        }
        setCargandoNuevoCliente(true);
        setErrorNuevoCliente(null);
        try {
            const nuevoClienteResponse = await crearClienteRapido(nuevoCliente);
            if (nuevoClienteResponse && nuevoClienteResponse.idCliente && nuevoClienteResponse.nombreCliente) {
                const nuevoClienteOption = { value: nuevoClienteResponse.idCliente, label: nuevoClienteResponse.nombreCliente };
                setClientes(prevClientes => [...prevClientes, nuevoClienteOption]);
                setFormData(prevData => ({ ...prevData, cliente: nuevoClienteOption.value }));
                closeModal();
                alert(`Cliente "${nuevoClienteResponse.nombreCliente}" creado exitosamente.`);
            } else {
                setErrorNuevoCliente("Error al crear el cliente. No se recibieron datos esperados.");
            }
        } catch (error) {
            console.error("Error al crear cliente rápido:", error);
            setErrorNuevoCliente(error.response?.data?.message || "Error de conexión al crear el cliente.");
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
                    <h2 className="title">Productos Disponibles</h2>
                    <div className="products-grid">
                        {loading ? (
                            <p>Cargando productos...</p>
                        ) : productos.length === 0 ? (
                            <p>No hay productos disponibles.</p>
                        ) : (
                            filteredProducts.map((producto) => (
                                <div key={producto.idProducto} className="product-card">
                                    <div className="image-container">
                                        <img
                                            src={producto.imagenUrl}
                                            alt={producto.nombreProducto}
                                            className="product-image"
                                            onClick={() => handleImageClick(producto.imagenUrl)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                        <button
                                            className="select-button"
                                            onClick={() => handleSelectProduct(producto)}
                                            disabled={producto.cantidadStock <= 0}
                                        >
                                            {producto.cantidadStock <= 0 ? "Sin Stock" : "Seleccionar"}
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
                            ))
                        )}
                    </div>
                </div>
                <div className="selected-products-column">
                    <h3>Detalle de Venta</h3>
                    <div className="form-fields-above-table">
                        <div className="form-group">
                            <label htmlFor="tipoComprobante">Tipo de Comprobante:</label>
                            <select
                                id="tipoComprobante"
                                name="tipoComprobante"
                                value={formData.tipoComprobante}
                                onChange={handleChangeForm}
                                className={validationErrors.tipoComprobante ? 'input-error' : ''}
                            >
                                {tipoComprobanteOptions.map((optionValue) => (
                                    <option key={optionValue} value={optionValue}>
                                        {optionValue.replace(/_/g, ' ')}
                                    </option>
                                ))}
                            </select>
                            {validationErrors.tipoComprobante && <p className="error-message">{validationErrors.tipoComprobante}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="numeroComprobante">Serie y Número:</label>
                            <input
                                id="numeroComprobante"
                                type="text"
                                name="numeroComprobante"
                                value={cargandoNumeracion ? "Cargando..." : formData.numeroComprobante}
                                disabled={true}
                                className={validationErrors.numeroComprobante ? 'input-error' : ''}
                            />
                            {cargandoNumeracion && <p className="loading-message">Obteniendo numeración...</p>}
                            {validationErrors.numeroComprobante && <p className="error-message">{validationErrors.numeroComprobante}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="clienteSelect">Cliente:</label>
                            <Select
                                id="clienteSelect"
                                value={clientes.find(option => option.value === formData.cliente)}
                                onChange={handleClienteChange}
                                options={clientes}
                                placeholder="Buscar o seleccionar cliente..."
                                isSearchable
                                classNamePrefix="react-select"
                                className={validationErrors.cliente ? 'input-error-select' : ''}
                            />
                            {validationErrors.cliente && <p className="error-message">{validationErrors.cliente}</p>}
                            <button type="button" className="button-nuevo-cliente" onClick={openModal}>
                                + Nuevo Cliente
                            </button>
                        </div>
                        <div className="form-group">
                            <label htmlFor="usuarioNombreInput">Usuario:</label>
                            <input
                                id="usuarioNombreInput"
                                type="text"
                                value={
                                    loadingUser
                                        ? 'Cargando usuario...'
                                        : userError
                                            ? 'Error al cargar usuario'
                                            : currentUser
                                                ? currentUser.nombre
                                                : 'No hay usuario'
                                }
                                disabled={true}
                                className={validationErrors.usuario ? 'input-error' : ''}
                            />
                            {userError && <p className="error-message">{userError}</p>}
                            {validationErrors.usuario && <p className="error-message">{validationErrors.usuario}</p>}
                            <input
                                type="hidden"
                                name="usuario"
                                value={formData.usuario}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="fechaVenta">Fecha de Venta:</label>
                            <DatePicker
                                id="fechaVenta"
                                selected={formData.fechaVenta} 
                                onChange={handleDateChange} 
                                dateFormat="yyyy-MM-dd" 
                                maxDate={new Date()} 
                                showYearDropdown 
                                scrollableYearDropdown 
                                yearDropdownItemNumber={15} 
                                className={`react-datepicker-input ${validationErrors.fechaVenta ? 'input-error' : ''}`} 
                            />
                            {validationErrors.fechaVenta && <p className="error-message">{validationErrors.fechaVenta}</p>}
                        </div>
                    </div>

                    <h3>Productos Seleccionados</h3>
                    {validationErrors.selectedProducts && <p className="error-message">{validationErrors.selectedProducts}</p>}
                    {validationErrors.productQuantities && <p className="error-message">{validationErrors.productQuantities}</p>}
                    <div className="table-container">
                        <table className="sales-table-content">
                            <thead>
                                <tr>
                                    <th style={{ width: "50%" }}>Nombre</th>
                                    <th style={{ width: "15%" }}>Cant.</th>
                                    <th style={{ width: "15%" }}>P.V.</th>
                                    <th style={{ width: "15%" }}>Importe</th>
                                    <th style={{ width: "8%" }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: "center" }}>
                                            No hay productos seleccionados.
                                        </td>
                                    </tr>
                                ) : (
                                    selectedProducts.map((producto) => (
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
                                                    className={validationErrors.productQuantities ? 'input-error' : ''}
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
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="total-importe">
                        <p>Total: S/. {totalImporte.toFixed(2)}</p>
                        {validationErrors.totalImporte && <p className="error-message">{validationErrors.totalImporte}</p>}
                    </div>
                    <div className="realizar-venta-container">
                        <button className="realizar-venta-button" onClick={handleRealizarVenta}>
                            Realizar Venta
                        </button>
                        {errorVenta && <p className="error-message">{errorVenta}</p>}
                        {ventaRealizada && <p className="success-message">Venta realizada con éxito!</p>}
                    </div>
                </div>
            </div>

            {/* Componente Modal de Imagen */}
            {showModal && (
                <div className="image-modal-overlay" onClick={closeModalImage}>
                    <div className="image-modal-content" onClick={e => e.stopPropagation()}>
                        <span className="close-button" onClick={closeModalImage}>&times;</span>
                        <img src={selectedImage} alt="Full Size" className="full-size-image" />
                    </div>
                </div>
            )}

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Nuevo Cliente"
            >
                <h2>Registrar Nuevo Cliente</h2>
                <div className="form-group">
                    <label htmlFor="tipoDocumento">Tipo de Documento:</label>
                    <select
                        id="tipoDocumento"
                        name="tipoDocumento"
                        value={nuevoCliente.tipoDocumento}
                        onChange={handleNuevoClienteChange}
                        className={validationErrorsNuevoCliente.tipoDocumento ? 'input-error' : ''}
                    >
                        <option value="DNI">DNI</option>
                        <option value="RUC">RUC</option>
                    </select>
                    {validationErrorsNuevoCliente.tipoDocumento && <p className="error-message">{validationErrorsNuevoCliente.tipoDocumento}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="numeroDocumento">Número de Documento:</label>
                    <input
                        id="numeroDocumento"
                        type="text"
                        name="numeroDocumento"
                        value={nuevoCliente.numeroDocumento}
                        onChange={handleNuevoClienteChange}
                        className={validationErrorsNuevoCliente.numeroDocumento ? 'input-error' : ''}
                    />
                    {validationErrorsNuevoCliente.numeroDocumento && <p className="error-message">{validationErrorsNuevoCliente.numeroDocumento}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="telefono">Teléfono:
                        <span className="text-xs text-gray-500 ml-2">(opcional, máx. 9 dígitos)</span>
                    </label>
                    <input
                        id="telefono"
                        type="text"
                        name="telefono"
                        value={nuevoCliente.telefono}
                        onChange={handleNuevoClienteChange}
                        placeholder="123456789"
                        className={validationErrorsNuevoCliente.telefono ? 'input-error' : ''}
                    />
                    {validationErrorsNuevoCliente.telefono && <p className="error-message">{validationErrorsNuevoCliente.telefono}</p>}
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