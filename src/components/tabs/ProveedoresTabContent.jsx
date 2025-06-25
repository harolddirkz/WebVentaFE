import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Card, Button, Form, Spinner, Alert, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash, faSave, faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import { getProveedores, updateProveedor, eliminarProveedor } from "../../services/api";
import "../../styles/pages/ListaUnidadMedida.css";

const ProveedoresTabContent = () => {
  const [proveedores, setProveedores] = useState([]);
  const [filteredProveedores, setFilteredProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [proveedorEditando, setProveedorEditando] = useState({
    idProveedor: "",
    ruc: "",
    razonSocial: "",
    nombreComercial: "",
    direccion: "",
    telefono: "",
  });

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const data = await getProveedores();
        setProveedores(data);
        setFilteredProveedores(data);
      } catch (error) {
        setError("Error al cargar los proveedores");
        console.error("Error al cargar proveedores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProveedores();
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const newData = proveedores.filter(proveedor => {
      return (
        (proveedor.ruc && proveedor.ruc.toLowerCase().includes(lowercasedFilter)) ||
        (proveedor.razonSocial && proveedor.razonSocial.toLowerCase().includes(lowercasedFilter)) ||
        (proveedor.nombreComercial && proveedor.nombreComercial.toLowerCase().includes(lowercasedFilter)) ||
        (proveedor.direccion && proveedor.direccion.toLowerCase().includes(lowercasedFilter)) ||
        (proveedor.telefono && proveedor.telefono.toLowerCase().includes(lowercasedFilter))
      );
    });
    setFilteredProveedores(newData);
  }, [searchTerm, proveedores]);

  const handleEdit = (proveedor) => {
    setProveedorEditando(proveedor);
    setMostrarFormulario(true);
  };

  const handleDelete = async (proveedor) => {
    if (window.confirm(`¿Estás seguro de eliminar al proveedor "${proveedor.razonSocial}"?`)) {
      try {
        await eliminarProveedor(proveedor.idProveedor);
        setProveedores((prev) => prev.filter((p) => p.idProveedor !== proveedor.idProveedor));
        alert("Proveedor eliminado correctamente.");
      } catch (error) {
        console.error("Error al eliminar proveedor:", error);
        alert("Hubo un error al eliminar el proveedor.");
      }
    }
  };

  const handleCancelarEdicion = () => {
    setMostrarFormulario(false);
    setProveedorEditando({
      idProveedor: "",
      ruc: "",
      razonSocial: "",
      nombreComercial: "",
      direccion: "",
      telefono: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProveedorEditando((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      await updateProveedor(proveedorEditando);

      setProveedores((prev) =>
        prev.map((p) =>
          p.idProveedor === proveedorEditando.idProveedor ? proveedorEditando : p
        )
      );

      setMostrarFormulario(false);
      alert("Los cambios del proveedor se guardaron correctamente.");
    } catch (error) {
      console.error("Error al actualizar proveedor:", error);
      alert("Hubo un error al guardar los cambios del proveedor.");
    }
  };

  const columns = [
    { name: "RUC", selector: (row) => row.ruc, sortable: true },
    { name: "Razón Social", selector: (row) => row.razonSocial, sortable: true },
    { name: "Nombre Comercial", selector: (row) => row.nombreComercial || 'N/A', sortable: true },
    { name: "Dirección", selector: (row) => row.direccion || 'N/A', sortable: true },
    { name: "Teléfono", selector: (row) => row.telefono || 'N/A', sortable: true },
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
          <span className="visually-hidden">Cargando proveedores...</span>
        </Spinner>
        <p>Cargando proveedores...</p>
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
                placeholder="Buscar proveedores por RUC, Razón Social, Dirección o Teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Card.Header>
          <DataTable
            columns={columns}
            data={filteredProveedores} 
            pagination
            highlightOnHover
            responsive
            noDataComponent="No hay proveedores para mostrar."
          />
        </Card>
      </div>

      {mostrarFormulario && (
        <div style={formStyle}>
          <Card className="p-3">
            <h4 className="mb-3">Editar Proveedor</h4>
            <Form onSubmit={handleSaveChanges}>
              <Form.Group className="mb-3">
                <Form.Label>RUC</Form.Label>
                <Form.Control
                  type="text"
                  name="ruc"
                  value={proveedorEditando.ruc || ""}
                  onChange={handleInputChange}
                  required
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Razón Social</Form.Label>
                <Form.Control
                  type="text"
                  name="razonSocial"
                  value={proveedorEditando.razonSocial || ""}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Nombre Comercial</Form.Label>
                <Form.Control
                  type="text"
                  name="nombreComercial"
                  value={proveedorEditando.nombreComercial || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Dirección</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="direccion"
                  value={proveedorEditando.direccion || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="text"
                  name="telefono"
                  value={proveedorEditando.telefono || ""}
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

export default ProveedoresTabContent;