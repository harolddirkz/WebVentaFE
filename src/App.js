import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import LayoutSidebar from './components/LayoutSidebar';
import Home from './pages/Home';
import LoginPage from './services/login/LoginPage';
import FormularioCrearProducto from './services/producto/FormularioCrearProducto';
import ListaProducto from './services/producto/ListaProducto';
import FormularioMisProductos from './services/producto/FormularioMisProductos';
import ProductoStock from './services/producto/ProductoStock';
import FormCategoria from './services/categoria/FormularioCrearCategoria';
import ListaCategorias from './services/categoria/ListaCategorias';
import FormUnidadMedida from './services/unidadMedida/FormularioCrearUnidadMedida';
import ListaUnidadMedida from './services/unidadMedida/ListaUnidadMedida';
import FormularioCrearUbicacion from './services/ubicacion/FormularioCrearUbicacion';
import ListUbicaciones from './services/ubicacion/ListaUbicaciones';
import CompraForm from './services/compra/CompraForm';
import ReporteFecha from './services/venta/ReporteFecha';
import CreateClienteForm from './services/cliente/FormularioCrearCliente';
import ListarEntidades from './services/cliente/ListarEntidades';
import CrearUsuarioForm from './services/usuario/CrearUsuarioForm';
import UsuariosList from './services/usuario/UsuariosList';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReporteStockColor from './services/venta/ReporteStockColor';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [checkedAuth, setCheckedAuth] = useState(false); 

  useEffect(() => {
    const storedToken = localStorage.getItem('jwt_token');
    const storedRole = localStorage.getItem('userRole');

    if (storedToken && storedRole) {
      setIsAuthenticated(true);
      setUserRole(storedRole);
    }
    setCheckedAuth(true);
  }, []);

  const handleLoginSuccess = (token, role) => {
    localStorage.setItem('jwt_token', token);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', role);
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUserRole(null);
  };

  const PrivateRoute = ({ children, allowedRoles }) => {
    if (!checkedAuth) {
      return <div>Cargando autenticación...</div>;
    }
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  if (!checkedAuth) {
    return <div>Cargando aplicación...</div>;
  }

  return (
    <Router>
      {isAuthenticated && (
        <div style={{ padding: '10px', background: '#f8f9fa', borderBottom: '1px solid #e9ecef', textAlign: 'right' }}>
          <span>Usuario: {userRole} | </span>
          <button onClick={handleLogout} style={{ marginLeft: '10px' }}>Cerrar Sesión</button>
        </div>
      )}

      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage onLoginSuccess={handleLoginSuccess} />}
        />
        <Route path="/" element={<PrivateRoute><LayoutSidebar /></PrivateRoute>}>
          <Route index element={<Home />} /> 
          <Route path="products/create" element={<FormularioCrearProducto />} />
          <Route path="products/list" element={<ListaProducto />} />
          <Route path="products/list-my-products" element={<FormularioMisProductos />} />
          <Route path="categoria/createCategoria" element={<FormCategoria />} />
          <Route path="categoria/list" element={<ListaCategorias />} />
          <Route path="unidad-medida/createUnidadMedida" element={<FormUnidadMedida />} />
          <Route path="unidad-medida/list" element={<ListaUnidadMedida />} />
          <Route path="ubicacion/create" element={<FormularioCrearUbicacion />} />
          <Route path="ubicacion/list" element={<ListUbicaciones />} />
          <Route path="buys/register" element={<CompraForm />} />
          <Route path="productos/update-stock" element={<ProductoStock />} />
          <Route path="sales/report" element={<ReporteFecha />} />
          <Route path="cliente/create" element={<CreateClienteForm />} />
          <Route path="cliente/list" element={<ListarEntidades />} />
          <Route path="usuario/create" element={<CrearUsuarioForm />} />
          <Route path="usuario/list" element={<UsuariosList />} />
          <Route path="reporte/stock" element={<ReporteStockColor />} />
        </Route>
        <Route path="*" element={
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>404 - Página no encontrada</h2>
                <p>La URL a la que intentas acceder no existe.</p>
                <Link to="/">Volver al inicio</Link>
            </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;