import React, { useState } from "react";
import { getReportePorDia, getReporteEntreFechas } from "../api";
import "../../styles/pages/ReporteFecha.css";

const ReporteFecha = () => {
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleReporteDelDia = async () => {
    const fechaHoy = getTodayDate();
    setLoading(true);
    setError(null);
    try {
      const data = await getReportePorDia(fechaHoy);
      setReporte(data);
    } catch (err) {
      console.error("Error al obtener reporte del día:", err);
      setError("No se pudo cargar el reporte del día.");
    } finally {
      setLoading(false);
    }
  };

  const handleReporteEntreFechas = async () => {
    if (!fechaDesde || !fechaHasta) {
      alert("Por favor, selecciona ambas fechas.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getReporteEntreFechas(fechaDesde, fechaHasta);
      setReporte(data);
    } catch (err) {
      console.error("Error al obtener reporte entre fechas:", err);
      setError("No se pudo cargar el reporte entre fechas.");
    } finally {
      setLoading(false);
    }
  };

  const {
    sumaTotalPrecioUnitario = 0,
    sumaTotalPrecioVenta = 0,
    sumaTotalUtilidad = 0,
    sumaTotalDeTotales = 0,
    ventas = []
  } = reporte || {};

  const fechaFormateada = ventas.length > 0
    ? new Date(ventas[0].fechaVenta).toLocaleDateString("es-PE", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    : "";

  return (
    <div className="reportes-screen">
      <h2>Generar Reportes de Ventas {fechaFormateada && `- ${fechaFormateada}`}</h2>

      <div className="botones-reportes">
        <button onClick={handleReporteDelDia} disabled={loading}>
          {loading ? "Cargando..." : "Reporte del Día"}
        </button>

        <div className="rango-fechas">
          <label>
            Desde:
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
            />
          </label>
          <label>
            Hasta:
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
            />
          </label>
          <button onClick={handleReporteEntreFechas} disabled={loading}>
            {loading ? "Cargando..." : "Generar Reporte"}
          </button>
        </div>
      </div>

      {loading && <p>Cargando reporte...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && reporte && (
        <div className="totales-generales">
          <p><strong>Total Precio Unitario:</strong> S/. {sumaTotalPrecioUnitario.toFixed(2)}</p>
          <p><strong>Total Precio Venta:</strong> S/. {sumaTotalPrecioVenta.toFixed(2)}</p>
          <p><strong>Total Utilidad:</strong> S/. {sumaTotalUtilidad.toFixed(2)}</p>
          <p><strong>Total General de Venta:</strong> S/. {sumaTotalDeTotales.toFixed(2)}</p>
        </div>
      )}


{!loading && ventas.length > 0 && (
  <div className="tabla-reportes">
    <h3>Ventas Encontradas</h3>

    {Object.entries(
      ventas.reduce((acc, venta) => {
        const fecha = new Date(venta.fechaVenta).toLocaleDateString("es-PE", {
          year: "numeric",
          month: "long",
          day: "numeric"
        });
        if (!acc[fecha]) acc[fecha] = [];
        acc[fecha].push(venta);
        return acc;
      }, {})
    ).map(([fecha, ventasDelDia], index) => (
      <div key={index}>
        <h4>Fecha: {fecha}</h4>
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Venta</th>
              <th>Precio Unitario</th>
              <th>Utilidad</th>
              <th>Importe</th>
            </tr>
          </thead>
          <tbody>
            {ventasDelDia.map((venta, idx) => (
              <tr key={idx}>
                <td>{venta.nombreProducto}</td>
                <td>{venta.cantidad}</td>
                <td>S/.{venta.precioVenta.toFixed(2)}</td>
                <td>S/.{venta.precioUnitario.toFixed(2)}</td>
                <td>S/.{venta.utilidad.toFixed(2)}</td>
                <td>S/.{(venta.precioVenta * venta.cantidad).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ))}
  </div>
)}


      {!loading && reporte && ventas.length === 0 && (
        <p>No hay ventas encontradas.</p>
      )}
    </div>
  );
};

export default ReporteFecha;
