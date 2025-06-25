import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import "../../styles/pages/FormularioCrearProducto.css";
import { createCategoria } from "../../services/api"; 

const CreateCategoriaForm = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await createCategoria(formData);
      console.log("Categoria creado con éxito:", response);

      setFormData({
        nombre: "",
        descripcion: "",
      });
    } catch (error) {
      console.error("Error al crear la categoria:", error);
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
        <h2 className="form-title">Crear Categoria</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="nombre" className="mb-3">
            <Form.Label>Nombre Categoria</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
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

          <Button variant="primary" type="submit" className="custom-button">
            Crear Categoria
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default CreateCategoriaForm;
