import { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
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
  const [formData, setFormData] = useState({
    nombreProducto: "",
    idUnidadMedida: "",
    marca: "",
    descripcion: "",
    presentacion: "",
    idCategoria: "",
    estado: "ACTIVO",
    fechaActivo: obtenerFechaActual(),
    imagenUrl: "",
  });

  const [categorias, setCategorias] = useState([]);
  const [unidadesMedida, setUnidadesMedida] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriasData = await getCategorias();
        setCategorias(categoriasData || []);

        const unidadesData = await getUnidadMedida();
        setUnidadesMedida(unidadesData || []);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "idCategoria" || name === "idUnidadMedida" ? (value ? Number(value) : "") : value,
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
  
    try {
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${API_KEY_IMGBB}`,
        formData
      );
      const imageUrl = response.data.data.url;

      setFormData((prevData) => ({
        ...prevData,
        imagenUrl: imageUrl,
      }));
  
      setUploading(false);
    } catch (error) {
      console.error("Error al subir imagen:", error);
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Datos enviados al backend:", formData);

    try {
      const response = await createProducto(formData);
      console.log("Producto creado con éxito:", response);

      setFormData({
        nombreProducto: "",
        idUnidadMedida: "",
        marca: "",
        descripcion: "",
        presentacion: "",
        idCategoria: "",
        estado: "",
        fechaActivo: "",
        imagenUrl: "",
      });
    } catch (error) {
      console.error("Error al crear el producto:", error);
    }
  };

  return (
    <div className="form-wrapper">
      <Container>
        <h2 className="form-title">Crear Producto</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="nombreProducto" className="mb-3">
            <Form.Label>Nombre del Producto</Form.Label>
              <Form.Control
                type="text"
                name="nombreProducto"
                value={formData.nombreProducto}
                onChange={handleChange}
                required
                className="custom-input"
              />
          </Form.Group>
          <Form.Group controlId="idUnidadMedida" className="mb-3">
            <Form.Label>Unidad de Medida</Form.Label>
            <Form.Select
              name="idUnidadMedida" 
              value={formData.idUnidadMedida}
              onChange={handleChange}
              required
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
          </Form.Group>
          <Form.Group controlId="marca" className="mb-3">
                <Form.Label>Marca</Form.Label>
                <Form.Control
                  type="text"
                  name="marca"
                  value={formData.marca}
                  onChange={handleChange}
                  required
                  className="custom-input"
                />
          </Form.Group>

          <Form.Group controlId="descripcion" className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  required
                  className="custom-textarea"
                />
          </Form.Group>

          <Form.Group controlId="presentacion" className="mb-3">
                <Form.Label>Presentación</Form.Label>
                <Form.Control
                  type="text"
                  name="presentacion"
                  value={formData.presentacion}
                  onChange={handleChange}
                  required
                  className="custom-input"
                />
          </Form.Group>

          <Form.Group controlId="estado" className="mb-3">
            <Form.Label>Estado</Form.Label>
            <Form.Select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              required
              className="custom-select"
            >
              <option value="ACTIVO">ACTIVO</option>
              <option value="INACTIVO">INACTIVO</option>
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="fechaActivo" className="mb-3">
            <Form.Label>Fecha Activo</Form.Label>
            <Form.Control
              type="date"
              name="fechaActivo"
              value={formData.fechaActivo}
              onChange={handleChange}
              required
              className="custom-input"
            />
          </Form.Group>

          <Form.Group controlId="idCategoria" className="mb-3">
            <Form.Label>Categoría</Form.Label>
            <Form.Select
              name="idCategoria" 
              value={formData.idCategoria} 
              onChange={handleChange}
              required
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
          </Form.Group>

          <Form.Group controlId="imagen" className="mb-3">
            <Form.Label>Imagen del Producto</Form.Label>
            <Form.Control type="file" onChange={handleImageUpload} accept="image/*" required />
            {uploading && <p>Subiendo imagen...</p>}
            {formData.imagenUrl && (
              <img src={formData.imagenUrl} alt="Imagen subida" width={100} />
            )}
          </Form.Group>

          <Button variant="primary" type="submit" className="custom-button">
            Crear Producto
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default CreateProductForm;
