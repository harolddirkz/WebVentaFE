// src/pages/ListarEntidades.jsx
import React, { useState } from 'react';
import { Container, Nav, Tab, Card } from 'react-bootstrap';
import ClientesTabContent from '../../components/tabs/ClientesTabContent';    
import ProveedoresTabContent from '../../components/tabs/ProveedoresTabContent'; 
import '../../styles/pages/ListaUnidadMedida.css'; 

const ListarEntidades = () => {
  const [key, setKey] = useState('clientes'); 

  return (
    <div className="form-wrapper"> 
      <Container fluid className="mt-4"> 
        <h2 className="mb-3">Gestión de Clientes y Proveedores</h2>

        <Card className="mt-4">
          <Card.Header>
            <Nav variant="tabs" defaultActiveKey="clientes" onSelect={(k) => setKey(k)}>
              <Nav.Item>
                <Nav.Link eventKey="clientes">Clientes</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="proveedores">Proveedores</Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>
          <Card.Body>
            <Tab.Content>
              <Tab.Pane eventKey="clientes" active={key === 'clientes'}>
                <ClientesTabContent />
              </Tab.Pane>
              <Tab.Pane eventKey="proveedores" active={key === 'proveedores'}>
                <ProveedoresTabContent />
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default ListarEntidades;