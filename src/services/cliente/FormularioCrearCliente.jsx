import React, { useState } from "react";
import { Form, Button, Container, Alert, Card } from "react-bootstrap";
import { crearClienteRapido, crearProveedorRapido } from "../api";
import "../../styles/pages/FormularioCrearProducto.css";

const CrearEntidadForm = () => {
  const [tipoEntidad, setTipoEntidad] = useState("cliente"); 
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [contacto, setContacto] = useState(""); 
  const [mensaje, setMensaje] = useState(null); 
  const [datosEntidadCreada, setDatosEntidadCreada] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);

  const handleTipoEntidadChange = (e) => {
    const newTipoEntidad = e.target.value;
    setTipoEntidad(newTipoEntidad);
    setNumeroDocumento("");
    setContacto("");
    setMensaje(null);
    setDatosEntidadCreada(null);
    setIsLoading(false);
  };

  const handleNumeroDocumentoChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      if (tipoEntidad === "cliente" && value.length <= 8) {
        setNumeroDocumento(value);
      } else if (tipoEntidad === "proveedor" && value.length <= 11) {
        setNumeroDocumento(value);
      }
    }
  };

  const handleContactoChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setContacto(value);
    }
  };

  const handleBuscarRUC = async () => {
    setMensaje(null);
    setDatosEntidadCreada(null);
    setIsLoading(true);

    if (numeroDocumento.length !== 11 || !/^\d+$/.test(numeroDocumento)) {
      setMensaje({ type: "danger", text: "El RUC debe tener exactamente 11 dígitos numéricos." });
      setIsLoading(false);
      return;
    }

    try {
      const response = await crearProveedorRapido(numeroDocumento);
      setMensaje({ type: "success", text: "Proveedor creado/encontrado con éxito." });
      setDatosEntidadCreada(response);
    } catch (error) {
      console.error("Error al buscar/crear proveedor:", error);
      const errorMessage = error.response?.data?.message || "Error al buscar/crear el proveedor. Verifique el RUC.";
      setMensaje({ type: "danger", text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCrearCliente = async () => {
    setMensaje(null);
    setDatosEntidadCreada(null);
    setIsLoading(true);

    if (numeroDocumento.length !== 8 || !/^\d+$/.test(numeroDocumento)) {
      setMensaje({ type: "danger", text: "El DNI debe tener exactamente 8 dígitos numéricos." });
      setIsLoading(false);
      return;
    }

    if (contacto.length > 0 && contacto.length !== 9) {
      setMensaje({ type: "danger", text: "Si ingresa un número de contacto, debe tener exactamente 9 dígitos." });
      setIsLoading(false);
      return;
    }

    try {
      const response = await crearClienteRapido({
        tipoDocumento: "DNI", 
        numeroDocumento,
        contacto, 
      });
      setMensaje({ type: "success", text: "Cliente creado/encontrado con éxito." });
      setDatosEntidadCreada(response);
    } catch (error) {
      console.error("Error al crear cliente:", error);
      const errorMessage = error.response?.data?.message || "Error al crear el cliente. Verifique el DNI y el contacto.";
      setMensaje({ type: "danger", text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    if (tipoEntidad === "cliente") {
      await handleCrearCliente();
    } else {
      await handleBuscarRUC();
    }
  };

  return (
    <div className="form-wrapper">
      <Container>
        <h2 className="form-title">Crear Cliente o Proveedor</h2>

        {mensaje && (
          <Alert variant={mensaje.type} onClose={() => setMensaje(null)} dismissible>
            {mensaje.text}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="tipoEntidad" className="mb-3">
            <Form.Label>¿Qué desea crear?</Form.Label>
            <Form.Select
              name="tipoEntidad"
              value={tipoEntidad}
              onChange={handleTipoEntidadChange}
              className="custom-input"
            >
              <option value="cliente">Cliente</option>
              <option value="proveedor">Proveedor</option>
            </Form.Select>
          </Form.Group>

          {tipoEntidad === "cliente" && (
            <>
              <Form.Group controlId="tipoDocumentoCliente" className="mb-3">
                <Form.Label>Tipo de Documento</Form.Label>
                <Form.Control
                  type="text"
                  value="DNI"
                  readOnly
                  className="custom-input"
                />
              </Form.Group>

              <Form.Group controlId="numeroDocumentoCliente" className="mb-3">
                <Form.Label>Número de DNI</Form.Label>
                <Form.Control
                  type="text"
                  name="numeroDocumento"
                  value={numeroDocumento}
                  onChange={handleNumeroDocumentoChange}
                  required
                  className="custom-input"
                  placeholder="Ingrese DNI (8 dígitos)"
                  maxLength={8}
                />
              </Form.Group>

              <Form.Group controlId="contactoCliente" className="mb-3">
                <Form.Label>Teléfono de Contacto (Opcional)</Form.Label>
                <Form.Control
                  type="text"
                  name="contacto"
                  value={contacto}
                  onChange={handleContactoChange}
                  className="custom-input"
                  placeholder="Ingrese teléfono (solo números, 9 dígitos si se ingresa)" 
                  maxLength={9} 
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="custom-button mt-3" disabled={isLoading}>
                {isLoading ? 'Creando Cliente...' : 'Crear Cliente'}
              </Button>
            </>
          )}

          {tipoEntidad === "proveedor" && (
            <>
              <Form.Group controlId="tipoDocumentoProveedor" className="mb-3">
                <Form.Label>Tipo de Documento</Form.Label>
                <Form.Control
                  type="text"
                  value="RUC" 
                  readOnly
                  className="custom-input"
                />
              </Form.Group>

              <Form.Group controlId="numeroDocumentoProveedor" className="mb-3">
                <Form.Label>Número de RUC</Form.Label>
                <Form.Control
                  type="text"
                  name="numeroDocumento"
                  value={numeroDocumento}
                  onChange={handleNumeroDocumentoChange}
                  required
                  className="custom-input"
                  placeholder="Ingrese RUC (11 dígitos)"
                  maxLength={11}
                />
              </Form.Group>

              <Button variant="info" type="submit" className="custom-button mt-3" disabled={isLoading}>
                {isLoading ? 'Buscando RUC...' : 'Buscar y Crear Proveedor'}
              </Button>
            </>
          )}
        </Form>

        {datosEntidadCreada && (
          <Card className="mt-4 p-3 result-card">
            <Card.Header>
              <Card.Title>Datos de la Entidad Creada:</Card.Title>
            </Card.Header>
            <Card.Body>
              {tipoEntidad === "cliente" && (
                <>
                  <p><strong>Número de Documento:</strong> {datosEntidadCreada.numeroDocumento}</p>
                  <p><strong>Nombre del Cliente:</strong> {datosEntidadCreada.nombreCliente}</p>
                  <p><strong>Contacto:</strong> {datosEntidadCreada.contacto || 'N/A'}</p> 
                </>
              )}
              {tipoEntidad === "proveedor" && (
                <>
                  <p><strong>RUC:</strong> {datosEntidadCreada.ruc}</p>
                  <p><strong>Razón Social:</strong> {datosEntidadCreada.razonSocial}</p>
                </>
              )}
            </Card.Body>
          </Card>
        )}
      </Container>
    </div>
  );
};

export default CrearEntidadForm;