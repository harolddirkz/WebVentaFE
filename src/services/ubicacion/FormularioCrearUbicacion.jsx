import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import "../../styles/pages/FormularioCrearProducto.css";
import { createUbicaciones } from "../../services/api"; 

const CreateUbicacionForm = () => {
  const [formData, setFormData] = useState({
    codigoUbicacion: "",
    descripcionUbicacion: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await createUbicaciones(formData);
      console.log("Ubicacion creado con éxito:", response);

      setFormData({
        codigoUbicacion: "",
        descripcionUbicacion: "",
      });
    } catch (error) {
      console.error("Error al crear la ubicacion:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="form-wrapper">
      <Container>
        <h2 className="form-title">Crear Ubicacion</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="codigoUbicacion" className="mb-3">
            <Form.Label>Codigo Ubicacion</Form.Label>
              <Form.Control
                type="text"
                name="codigoUbicacion"
                value={formData.codigoUbicacion}
                onChange={handleChange}
                required
                className="custom-input"
              />
          </Form.Group>


          <Form.Group controlId="descripcionUbicacion" className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="descripcionUbicacion"
                  value={formData.descripcionUbicacion}
                  onChange={handleChange}
                  required
                  className="custom-textarea"
                />
          </Form.Group>

          <Button variant="primary" type="submit" className="custom-button">
            Crear Ubicacion
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default CreateUbicacionForm;
