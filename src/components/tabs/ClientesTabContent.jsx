import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Card, Button, Form, Spinner, Alert, InputGroup } from "react-bootstrap"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash, faSave, faTimes, faSearch } from "@fortawesome/free-solid-svg-icons"; 
import { getClientes, updateCliente, eliminarCliente } from "../../services/api";
import "../../styles/pages/ListaUnidadMedida.css";

const ClientesTabContent = () => {
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); 

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [clienteEditando, setClienteEditando] = useState({
    idCliente: "",
    tipoDocumento: "",
    numeroDocumento: "",
    nombreCliente: "",
    contacto: "",
    direccion: "",
  });

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const data = await getClientes();
        setClientes(data);
        setFilteredClientes(data); 
      } catch (error) {
        setError("Error al cargar los clientes");
        console.error("Error al cargar clientes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const newData = clientes.filter(cliente => {
      return (
        (cliente.numeroDocumento && cliente.numeroDocumento.toLowerCase().includes(lowercasedFilter)) ||
        (cliente.nombreCliente && cliente.nombreCliente.toLowerCase().includes(lowercasedFilter)) ||
        (cliente.contacto && cliente.contacto.toLowerCase().includes(lowercasedFilter)) ||
        (cliente.direccion && cliente.direccion.toLowerCase().includes(lowercasedFilter))
      );
    });
    setFilteredClientes(newData);
  }, [searchTerm, clientes]);

  const handleEdit = (cliente) => {
    setClienteEditando(cliente);
    setMostrarFormulario(true);
  };

  const handleDelete = async (cliente) => {
    if (window.confirm(`¿Estás seguro de eliminar al cliente "${cliente.nombreCliente}"?`)) {
      try {
        await eliminarCliente(cliente.idCliente);
        setClientes((prev) => prev.filter((c) => c.idCliente !== cliente.idCliente));
        alert("Cliente eliminado correctamente.");
      } catch (error) {
        console.error("Error al eliminar cliente:", error);
        alert("Hubo un error al eliminar el cliente.");
      }
    }
  };

  const handleCancelarEdicion = () => {
    setMostrarFormulario(false);
    setClienteEditando({
      idCliente: "",
      tipoDocumento: "",
      numeroDocumento: "",
      nombreCliente: "",
      contacto: "",
      direccion: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClienteEditando((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      await updateCliente(clienteEditando);

      setClientes((prev) =>
        prev.map((c) =>
          c.idCliente === clienteEditando.idCliente ? clienteEditando : c
        )
      );

      setMostrarFormulario(false);
      alert("Los cambios del cliente se guardaron correctamente.");
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      alert("Hubo un error al guardar los cambios del cliente.");
    }
  };

  const columns = [
    { name: "Nº Doc.", selector: (row) => row.numeroDocumento, sortable: true },
    { name: "Nombre Cliente", selector: (row) => row.nombreCliente, sortable: true },
    { name: "Contacto", selector: (row) => row.contacto, sortable: true },
    { name: "Dirección", selector: (row) => row.direccion || 'N/A', sortable: true },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="button-group">
          <Button variant="primary" className="bg-primary" size="sm" onClick={() => handleEdit(row)}>
            <FontAwesomeIcon icon={faPencil} />
          </Button>
          <Button variant="danger" className="bg-danger" size="sm" onClick={() => handleDelete(row)}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando clientes...</span>
        </Spinner>
        <p>Cargando clientes...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  const containerStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: '20px',
    width: '100%',
  };

  const tableStyle = {
    flex: mostrarFormulario ? '1 1 65%' : '1 1 100%',
  };

  const formStyle = {
    flex: '0 0 30%',
    minWidth: '300px',
  };

  return (
    <div style={containerStyle}>
      <div style={tableStyle}>
        <Card>
          <Card.Header>
            <InputGroup className="mb-3">
              <InputGroup.Text>
                <FontAwesomeIcon icon={faSearch} />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Buscar clientes por DNI, Nombre, Contacto o Dirección..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Card.Header>
          <DataTable
            columns={columns}
            data={filteredClientes}
            pagination
            highlightOnHover
            responsive
            noDataComponent="No hay clientes para mostrar."
          />
        </Card>
      </div>

      {mostrarFormulario && (
        <div style={formStyle}>
          <Card className="p-3">
            <h4 className="mb-3">Editar Cliente</h4>
            <Form onSubmit={handleSaveChanges}>
              <Form.Group className="mb-3">
                <Form.Label>Tipo Documento</Form.Label>
                <Form.Control
                  type="text"
                  name="tipoDocumento"
                  value={clienteEditando.tipoDocumento || ""}
                  onChange={handleInputChange}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Número Documento</Form.Label>
                <Form.Control
                  type="text"
                  name="numeroDocumento"
                  value={clienteEditando.numeroDocumento || ""}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Nombre Cliente</Form.Label>
                <Form.Control
                  type="text"
                  name="nombreCliente"
                  value={clienteEditando.nombreCliente || ""}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Contacto</Form.Label>
                <Form.Control
                  type="text"
                  name="contacto"
                  value={clienteEditando.contacto || ""}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Dirección</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="direccion"
                  value={clienteEditando.direccion || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={handleCancelarEdicion}>
                  <FontAwesomeIcon icon={faTimes} className="me-1" /> Cancelar
                </Button>
                <Button variant="success" type="submit">
                  <FontAwesomeIcon icon={faSave} className="me-1" /> Guardar
                </Button>
              </div>
            </Form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ClientesTabContent;