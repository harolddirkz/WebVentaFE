import React from "react";
import { Table, Button, Form } from "react-bootstrap";

const ProductList = ({ productos, onUpdate, onRemove }) => {
  const productList = Array.isArray(productos) ? productos : [];

  return (
    <div className="product-list">
      <h5 className="text-center mt-3">Productos Seleccionados</h5>
      {productList.length > 0 ? (
        <Table striped bordered hover responsive className="mt-3">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Precio Venta</th>
              <th>Fecha de Vencimiento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productList.map((producto) => (
              <tr key={producto.idProducto}>
                <td>{producto.nombreProducto}</td>
                <td>
                  <Form.Control
                    type="number"
                    value={producto.cantidad}
                    min="1"
                    onChange={(e) => onUpdate(producto.idProducto, "cantidad", e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={producto.precioUnitario}
                    onChange={(e) => onUpdate(producto.idProducto, "precioUnitario", e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    step="0.01"
                    value={producto.precioVenta || 0.0} 
                    onChange={(e) =>
                      onUpdate(
                        producto.idProducto,
                        "precioVenta",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <Form.Control
                    type="date"
                    value={producto.fechaVencimiento}
                    onChange={(e) => onUpdate(producto.idProducto, "fechaVencimiento", e.target.value)}
                  />
                </td>
                <td className="text-center">
                  <Button variant="danger" size="sm" onClick={() => onRemove(producto.idProducto)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-center text-muted mt-3">No hay productos seleccionados.</p>
      )}
    </div>
  );
};

export default ProductList;
