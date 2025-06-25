import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Container, Card, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil,faTrash,faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { getCategorias,updateCategoria, eliminarCategoria } from "../../services/api";
import "../../styles/pages/ListaUnidadMedida.css";

const CategoriasList = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [categoriaEditando, setCategoriaEditando] = useState({
      idCategoria: "",
      nombre: "",
      descripcion: ""
    });

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await getCategorias();
        setCategorias(data);
      } catch (error) {
        setError("Error al cargar las categorías");
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  const handleEdit = (categoria) => {
    setCategoriaEditando(categoria);
    setMostrarFormulario(true);
  };

  const handleDelete = async (categoria) => {
    if (window.confirm(`¿Estás seguro de eliminar "${categoria.nombre}"?`)) {
          try {
            await eliminarCategoria(categoria.idCategoria); 
            setCategorias((prev) =>
              prev.filter((u) => u.idCategoria !== categoria.idCategoria)
            );
          } catch (error) {
            console.error("Error al eliminar:", error);
            alert("Hubo un error al eliminar la unidad.");
          }
        }
  };

  const handleCancelarEdicion = () => {
    setMostrarFormulario(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoriaEditando(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async (e) => {
      e.preventDefault();
      try {
        await updateCategoria(categoriaEditando);
        
        setCategorias(prev => 
          prev.map(categoria => 
            categoria.idCategoria === categoriaEditando.idCategoria 
              ? categoriaEditando 
              : categoria
          )
        );
        
        setMostrarFormulario(false);
        alert("Los cambios se guardaron correctamente");
      } catch (error) {
        console.error("Error al actualizar:", error);
        alert("Hubo un error al guardar los cambios.");
      }
    };

  const columns = [
    {
      name: "Nombre Categoria",
      selector: (row) => row.nombre,
      sortable: true,
    },
    {
      name: "Descripcion Categoria",
      selector: (row) => row.descripcion,
      sortable: true,
    },
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
    return <p>Cargando categorias...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const containerStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: '20px',
    width: '100%'
  };

  const tableStyle = {
    flex: mostrarFormulario ? '1 1 65%' : '1 1 100%'
  };

  const formStyle = {
    flex: '0 0 30%',
    minWidth: '300px'
  };

  return (
    <Container fluid className="mt-4">
      <h2 className="mb-3">Lista de categorias</h2>
      
      <div style={containerStyle}>
        <div style={tableStyle}>
          <Card>
            <DataTable
              columns={columns}
              data={categorias}
              pagination
              highlightOnHover
              responsive
            />
          </Card>
        </div>
        
        {mostrarFormulario && (
          <div style={formStyle}>
            <Card className="p-3">
              <h4 className="mb-3">Editar Unidad de Medida</h4>
              <Form onSubmit={handleSaveChanges}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre Unidad Medida</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={categoriaEditando.nombre || ""}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Abreviatura</Form.Label>
                  <Form.Control
                    type="text"
                    name="descripcion"
                    value={categoriaEditando.descripcion || ""}
                    onChange={handleInputChange}
                    required
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
    </Container>
  );
};

export default CategoriasList;