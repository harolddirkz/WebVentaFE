import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; 
import { loginUser } from '../api'; 
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
      const userRole = response.split('Rol: ')[1]; 
      localStorage.setItem('userRole', userRole); 
      localStorage.setItem('isAuthenticated', 'true'); 

      if (onLoginSuccess) {
        onLoginSuccess(true, userRole); 
      }
      navigate('/'); 
    } catch (err) {
      console.error('Error durante el login:', err);
      setError(err.response?.data || 'Credenciales incorrectas. Inténtalo de nuevo.');
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