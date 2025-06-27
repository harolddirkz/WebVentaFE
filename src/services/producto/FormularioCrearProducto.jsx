import { useState, useEffect } from "react";

import { Form, Button, Container, Alert, Row, Col } from "react-bootstrap";
import "../../styles/pages/FormularioCrearProducto.css";
import { createProducto, getCategorias, getUnidadMedida } from "../api";
import axios from "axios";

const API_KEY_IMGBB = "4388c7d43ba3d77a601dd5aa45ae1576";

const obtenerFechaActual = () => {
  const fecha = new Date();
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${año}-${mes}-${dia}`;
};

const CreateProductForm = () => {
  const initialState = {
    nombreProducto: "",
    idUnidadMedida: "",
    marca: "",
    descripcion: "",
    presentacion: "",
    idCategoria: "",
    estado: "ACTIVO",
    fechaActivo: obtenerFechaActual(), 
    imagenUrl: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [categorias, setCategorias] = useState([]);
  const [unidadesMedida, setUnidadesMedida] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriasData = await getCategorias();
        setCategorias(categoriasData || []);

        const unidadesData = await getUnidadMedida();
        setUnidadesMedida(unidadesData || []);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setSubmitMessage("Error al cargar las opciones de categorías y unidades de medida.");
        setIsSuccess(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "idCategoria" || name === "idUnidadMedida" ? (value ? Number(value) : "") : value,
    }));

    setValidationErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[name];
      return newErrors;
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      setFormData((prevData) => ({ ...prevData, imagenUrl: "" })); 
      setValidationErrors((prevErrors) => ({ ...prevErrors, imagenUrl: "La imagen del producto es requerida." }));
      return;
    }

    setUploading(true);
    setSubmitMessage(null); 
    setValidationErrors((prevErrors) => { 
        const newErrors = { ...prevErrors };
        delete newErrors.imagenUrl;
        return newErrors;
    });

    const formDataToUpload = new FormData(); 
    formDataToUpload.append("image", file);

    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${API_KEY_IMGBB}`,
        formDataToUpload
      );
      const imageUrl = response.data.data.url;

      setFormData((prevData) => ({
        ...prevData,
        imagenUrl: imageUrl,
      }));

    } catch (error) {
      console.error("Error al subir imagen:", error);
      setSubmitMessage("Error al subir la imagen. Por favor, inténtalo de nuevo.");
      setIsSuccess(false);
      setFormData((prevData) => ({ ...prevData, imagenUrl: "" })); 
      setValidationErrors((prevErrors) => ({ ...prevErrors, imagenUrl: "Error al subir la imagen. Inténtalo de nuevo." }));
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.nombreProducto.trim()) {
      errors.nombreProducto = "El nombre del producto es requerido.";
    }
    if (!formData.idUnidadMedida) {
      errors.idUnidadMedida = "Debe seleccionar una unidad de medida.";
    }
    if (!formData.marca.trim()) {
      errors.marca = "La marca es requerida.";
    }
    if (!formData.presentacion.trim()) {
      errors.presentacion = "La presentación es requerida.";
    }
    if (!formData.idCategoria) {
      errors.idCategoria = "Debe seleccionar una categoría.";
    }
    if (!formData.estado.trim()) {
      errors.estado = "El estado es requerido.";
    }
    if (!formData.fechaActivo) {
      errors.fechaActivo = "La fecha activo es requerida.";
    }
    if (!formData.imagenUrl) {
      errors.imagenUrl = "La imagen del producto es requerida.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitMessage(null); 
    setIsSuccess(false);

    if (!validateForm()) {
      setSubmitMessage("Por favor, corrige los errores en el formulario.");
      setIsSuccess(false);
      return;
    }

    const dataToSend = {
      ...formData,
      idCategoria: Number(formData.idCategoria),
      idUnidadMedida: Number(formData.idUnidadMedida),
    };

    console.log("Datos enviados al backend:", dataToSend);

    try {
      const response = await createProducto(dataToSend);
      console.log("Producto creado con éxito:", response);

      setSubmitMessage("Producto registrado exitosamente.");
      setIsSuccess(true);

      setFormData(initialState);
      setValidationErrors({});
      
    } catch (error) {
      console.error("Error al crear el producto:", error);
      const errorMessage = error.response?.data?.message || "Error al crear el producto. Por favor, inténtalo de nuevo.";
      setSubmitMessage(errorMessage);
      setIsSuccess(false);
    }
  };

  return (
    <div className="form-wrapper">
      <Container>
        <h2 className="form-title">Crear Producto</h2>

        {submitMessage && (
          <Alert variant={isSuccess ? "success" : "danger"} onClose={() => setSubmitMessage(null)} dismissible>
            {submitMessage}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {/* Se usa Row y Col para una mejor alineación de labels y campos */}
          <Row className="mb-3 align-items-center"> {/* align-items-center para centrar verticalmente */}
            <Form.Group as={Col} xs={12} md={4} controlId="nombreProductoLabel">
              <Form.Label>Nombre del Producto</Form.Label>
            </Form.Group>
            <Form.Group as={Col} xs={12} md={8} controlId="nombreProducto">
              <Form.Control
                type="text"
                name="nombreProducto"
                value={formData.nombreProducto}
                onChange={handleChange}
                isInvalid={!!validationErrors.nombreProducto}
                className="custom-input"
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.nombreProducto}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3 align-items-center">
            <Form.Group as={Col} xs={12} md={4} controlId="idUnidadMedidaLabel">
              <Form.Label>Unidad de Medida</Form.Label>
            </Form.Group>
            <Form.Group as={Col} xs={12} md={8} controlId="idUnidadMedida">
              <Form.Select
                name="idUnidadMedida"
                value={formData.idUnidadMedida}
                onChange={handleChange}
                isInvalid={!!validationErrors.idUnidadMedida}
                className="custom-select"
              >
                <option value="">Seleccione...</option>
                {unidadesMedida.map((unidad) =>
                  unidad && unidad.idUnidadMedida ? (
                    <option key={unidad.idUnidadMedida} value={unidad.idUnidadMedida.toString()}>
                      {unidad.nombreUnidadMedida}
                    </option>
                  ) : null
                )}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {validationErrors.idUnidadMedida}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3 align-items-center">
            <Form.Group as={Col} xs={12} md={4} controlId="marcaLabel">
              <Form.Label>Marca</Form.Label>
            </Form.Group>
            <Form.Group as={Col} xs={12} md={8} controlId="marca">
              <Form.Control
                type="text"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                isInvalid={!!validationErrors.marca}
                className="custom-input"
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.marca}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3 align-items-center">
            <Form.Group as={Col} xs={12} md={4} controlId="descripcionLabel">
              <Form.Label>Descripción</Form.Label>
            </Form.Group>
            <Form.Group as={Col} xs={12} md={8} controlId="descripcion">
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="custom-textarea"
              />
              {/* No feedback para descripcion ya que no es requerido */}
            </Form.Group>
          </Row>

          <Row className="mb-3 align-items-center">
            <Form.Group as={Col} xs={12} md={4} controlId="presentacionLabel">
              <Form.Label>Presentación</Form.Label>
            </Form.Group>
            <Form.Group as={Col} xs={12} md={8} controlId="presentacion">
              <Form.Control
                type="text"
                name="presentacion"
                value={formData.presentacion}
                onChange={handleChange}
                isInvalid={!!validationErrors.presentacion}
                className="custom-input"
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.presentacion}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3 align-items-center">
            <Form.Group as={Col} xs={12} md={4} controlId="estadoLabel">
              <Form.Label>Estado</Form.Label>
            </Form.Group>
            <Form.Group as={Col} xs={12} md={8} controlId="estado">
              <Form.Select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                isInvalid={!!validationErrors.estado}
                className="custom-select"
              >
                <option value="ACTIVO">ACTIVO</option>
                <option value="INACTIVO">INACTIVO</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {validationErrors.estado}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3 align-items-center">
            <Form.Group as={Col} xs={12} md={4} controlId="fechaActivoLabel">
              <Form.Label>Fecha Activo</Form.Label>
            </Form.Group>
            <Form.Group as={Col} xs={12} md={8} controlId="fechaActivo">
              <Form.Control
                type="date"
                name="fechaActivo"
                value={formData.fechaActivo}
                onChange={handleChange}
                isInvalid={!!validationErrors.fechaActivo}
                className="custom-input"
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.fechaActivo}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3 align-items-center">
            <Form.Group as={Col} xs={12} md={4} controlId="idCategoriaLabel">
              <Form.Label>Categoría</Form.Label>
            </Form.Group>
            <Form.Group as={Col} xs={12} md={8} controlId="idCategoria">
              <Form.Select
                name="idCategoria"
                value={formData.idCategoria}
                onChange={handleChange}
                isInvalid={!!validationErrors.idCategoria}
                className="custom-select"
              >
                <option value="">Seleccione...</option>
                {categorias.map((categoria) =>
                  categoria && categoria.idCategoria ? (
                    <option key={categoria.idCategoria} value={categoria.idCategoria.toString()}>
                      {categoria.nombre}
                    </option>
                  ) : null
                )}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {validationErrors.idCategoria}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3 align-items-center">
            <Form.Group as={Col} xs={12} md={4} controlId="imagenLabel">
              <Form.Label>Imagen del Producto</Form.Label>
            </Form.Group>
            <Form.Group as={Col} xs={12} md={8} controlId="imagen">
              <Form.Control
                key={formData.imagenUrl || 'no-image'} // Clave para resetear el input de tipo file
                type="file"
                onChange={handleImageUpload}
                accept="image/*"
                isInvalid={!!validationErrors.imagenUrl}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.imagenUrl}
              </Form.Control.Feedback>
              {uploading && <p>Subiendo imagen...</p>}
              {formData.imagenUrl && (
                <img src={formData.imagenUrl} alt="Imagen subida" width={100} className="mt-2" />
              )}
            </Form.Group>
          </Row>

          <Button variant="primary" type="submit" className="custom-button" disabled={uploading}>
            {uploading ? "Cargando imagen..." : "Crear Producto"}
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default CreateProductForm;