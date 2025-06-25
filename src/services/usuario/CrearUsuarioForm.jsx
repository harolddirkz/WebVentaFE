import React, { useState } from "react";
import { Form, Button, Container, Alert, Spinner } from "react-bootstrap";
import { crearUsuario } from "../../services/api"; 
import "../../styles/pages/FormularioCrearProducto.css"; 

const CrearUsuarioForm = () => {
  const [nombre, setNombre] = useState("");
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [email, setEmail] = useState(""); 
  const [rol, setRol] = useState("VENDEDOR"); 
  const [mensaje, setMensaje] = useState(null); 
  const [isLoading, setIsLoading] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null); 
    setIsLoading(true);

    if (contrasena !== confirmarContrasena) {
      setMensaje({ type: "danger", text: "Las contraseñas no coinciden." });
      setIsLoading(false);
      return;
    }

    if (contrasena.length < 6) { 
      setMensaje({ type: "danger", text: "La contraseña debe tener al menos 6 caracteres." });
      setIsLoading(false);
      return;
    }

    const nuevoUsuario = {
      nombre,
      usuario,
      contrasena,
      email, 
      rol,
    };

    try {
      const response = await crearUsuario(nuevoUsuario);
      setMensaje({ type: "success", text: `Usuario ${response.nombre || response.usuario} creado con éxito!` });
      setNombre("");
      setUsuario("");
      setContrasena("");
      setConfirmarContrasena("");
      setEmail("");
      setRol("VENDEDOR"); 
    } catch (error) {
      console.error("Error al crear usuario:", error);
      const errorMessage = error.response?.data?.message || "Error al crear el usuario. Verifique los datos.";
      setMensaje({ type: "danger", text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-wrapper">
      <Container>
        <h2 className="form-title">Crear Nuevo Usuario</h2>

        {mensaje && (
          <Alert variant={mensaje.type} onClose={() => setMensaje(null)} dismissible>
            {mensaje.text}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="nombreUsuario" className="mb-3">
            <Form.Label>Nombre Completo</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="custom-input"
              placeholder="Ingrese el nombre completo del usuario"
            />
          </Form.Group>

          <Form.Group controlId="usuarioLogin" className="mb-3">
            <Form.Label>Nombre de Usuario</Form.Label>
            <Form.Control
              type="text"
              name="usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
              className="custom-input"
              placeholder="Ingrese el nombre de usuario (ej. jsmith)"
            />
          </Form.Group>
          <Form.Group controlId="emailUsuario" className="mb-3">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="custom-input"
              placeholder="Ingrese el correo electrónico del usuario"
            />
          </Form.Group>
          <Form.Group controlId="contrasenaUsuario" className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="contrasena"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
              className="custom-input"
              placeholder="Ingrese una contraseña"
            />
          </Form.Group>

          <Form.Group controlId="confirmarContrasenaUsuario" className="mb-3">
            <Form.Label>Confirmar Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="confirmarContrasena"
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
              required
              className="custom-input"
              placeholder="Confirme la contraseña"
            />
          </Form.Group>

          <Form.Group controlId="rolUsuario" className="mb-3">
            <Form.Label>Rol</Form.Label>
            <Form.Select
              name="rol"
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              required
              className="custom-input"
            >
              <option value="VENDEDOR">Vendedor</option>
              <option value="ADMIN">Administrador</option>
            </Form.Select>
          </Form.Group>

          <Button variant="success" type="submit" className="custom-button mt-3" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" /> Creando...
              </>
            ) : (
              'Crear Usuario'
            )}
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default CrearUsuarioForm;