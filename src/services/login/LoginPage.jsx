// src/pages/LoginPage.js

import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/api';
import '../../styles/pages/FormularioCrearProducto.css';

const LoginPage = ({ onLoginSuccess }) => {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await loginUser({ usuario, contrasena });
      console.log('Login exitoso:', response);

      if (response && response.jwt && response.roles && response.roles.length > 0) {
        localStorage.setItem('jwt_token', response.jwt); 
        localStorage.setItem('isAuthenticated', 'true'); 
        localStorage.setItem('userRole', response.roles[0]); 

        if (onLoginSuccess) {
          onLoginSuccess(response.jwt, response.roles[0]); 
        }

        navigate('/'); 
      } else {
        setError("Respuesta de login inválida: token o rol no encontrados.");
        console.error("Login response invalid:", response);
      }

    } catch (err) {
      console.error('Error durante el login:', err);
      setError(err.response?.data?.message || 'Credenciales incorrectas o error de servidor. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrapper">
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Card className="p-4" style={{ width: '400px' }}>
          <h2 className="text-center mb-4">Iniciar Sesión</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Usuario</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese su usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mt-3" disabled={loading}>
              {loading ? (
                <Spinner animation="border" size="sm" className="me-2" />
              ) : (
                'Ingresar'
              )}
            </Button>
            <div className="text-center mt-3">
              <a href="/recuperar-contrasena">¿Olvidaste tu contraseña?</a>
            </div>
          </Form>
        </Card>
      </Container>
    </div>
  );
};

export default LoginPage;