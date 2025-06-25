import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import "../../styles/pages/FormularioCrearProducto.css";
import { createUnidadMedida } from "../../services/api"; 

const CreateUnidadMedidaForm = () => {
  const [formData, setFormData] = useState({
    nombreUnidadMedida: "",
    abreviatura: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await createUnidadMedida(formData);
      console.log("Unidad de medida creado con éxito:", response);

      setFormData({
        nombreUnidadMedida: "",
        abreviatura: "",
      });
    } catch (error) {
      console.error("Error al crear la unidad de medida:", error);
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
        <h2 className="form-title">Crear Unidad de Medida</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="nombreUnidadMedida" className="mb-3">
            <Form.Label>Nombre Unidad Medida</Form.Label>
              <Form.Control
                type="text"
                name="nombreUnidadMedida"
                value={formData.nombreUnidadMedida}
                onChange={handleChange}
                required
                className="custom-input"
              />
          </Form.Group>


          <Form.Group controlId="abreviatura" className="mb-3">
                <Form.Label>Abreviatura</Form.Label>
                <Form.Control
                  type="text"
                  name="abreviatura"
                  value={formData.abreviatura}
                  onChange={handleChange}
                  required
                  className="custom-input"
                />
          </Form.Group>

          <Button variant="primary" type="submit" className="custom-button">
            Crear Unidad Medida
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default CreateUnidadMedidaForm;
