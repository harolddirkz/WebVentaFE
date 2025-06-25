import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Container, Card,Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil,faTrash } from "@fortawesome/free-solid-svg-icons";
import { getUbicaciones } from "../../services/api";



const UbicacionList = () => {
  const [ubicaciones, setUbicaciones] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUbicaciones = async () => {
      try {
        const data = await getUbicaciones();
        setUbicaciones(data);
      } catch (error) {
        setError("Error al cargar las categorías");
      } finally {
        setLoading(false);
      }
    };

    fetchUbicaciones();
  }, []);

  const handleEdit = (producto) => {
    console.log("Editar:", producto);
  };

  const handleDelete = (producto) => {
    console.log("Eliminar:", producto);
  };

  const columns = [
    {
      name: "Codigo Ubicacion",
      selector: (row) => row.codigoUbicacion,
      sortable: true,
    },
    {
      name: "Descripcion Ubicacion",
      selector: (row) => row.descripcionUbicacion,
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div>
          <Button variant="primary" size="sm" onClick={() => handleEdit(row)}>
             <FontAwesomeIcon icon={faPencil} />
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDelete(row)}>
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
    return <p>Cargando ubicaciones...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Container>
      <h2 className="mt-4">Lista de Ubicaciones</h2>
      <Card>
        <DataTable
          columns={columns}
          data={ubicaciones} 
          pagination
          highlightOnHover
          responsive
        />
      </Card>
    </Container>
  );
};

export default UbicacionList;