import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';

// Componentes de Layout
import LayoutSidebar from './components/LayoutSidebar';
// Páginas
import Home from './pages/Home';
import LoginPage from './services/login/LoginPage'; // Asumo que LoginPage está en ./pages/LoginPage
//import RecuperarContrasena from './pages/RecuperarContrasena'; // Si ya tienes esta página
// Componentes de Servicios (ajusta las rutas si no son correctas)
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
import UsuariosList from './services/usuario/UsuariosList'; // La página de creación de usuario

// Asegúrate de tener los estilos CSS de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
// Si tienes estilos globales o específicos, impórtalos aquí

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [checkedAuth, setCheckedAuth] = useState(false); // Para esperar a que se verifique el localStorage

  useEffect(() => {
    // Verifica el estado de autenticación al cargar la aplicación
    const storedToken = localStorage.getItem('jwt_token');
    const storedRole = localStorage.getItem('userRole');

    if (storedToken && storedRole) {
      // Aquí podrías añadir lógica para validar el token (ej. si ha expirado)
      // Por ahora, asumimos que si el token existe, el usuario está autenticado
      setIsAuthenticated(true);
      setUserRole(storedRole);
    }
    setCheckedAuth(true); // Indica que la verificación inicial ha terminado
  }, []);

  const handleLoginSuccess = (token, role) => {
    localStorage.setItem('jwt_token', token);
    localStorage.setItem('isAuthenticated', 'true'); // Opcional, el token ya es suficiente
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
    // No necesitamos un `Maps('/login')` aquí, ya que el `PrivateRoute` lo hará automáticamente.
  };

  // Componente de Ruta Protegida
  // Este componente asegura que solo los usuarios autenticados (y con el rol correcto, opcional)
  // puedan acceder a ciertas rutas.
  const PrivateRoute = ({ children, allowedRoles }) => {
    if (!checkedAuth) {
      // Muestra un mensaje de carga mientras se verifica el token en localStorage
      return <div>Cargando autenticación...</div>;
    }
    if (!isAuthenticated) {
      // Si no está autenticado, redirige a la página de login
      return <Navigate to="/login" replace />;
    }
    // Lógica de control de roles (descomentar y usar si necesitas restringir por rol)
    // if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    //   // Si el usuario no tiene los roles permitidos, redirige a una página de no autorizado
    //   return <Navigate to="/unauthorized" replace />;
    // }
    return children;
  };

  // Muestra un spinner o mensaje de carga mientras el estado de autenticación inicial se verifica
  if (!checkedAuth) {
    return <div>Cargando aplicación...</div>;
  }

  return (
    <Router>
      {/* Botón de logout (opcional, puedes integrarlo en tu LayoutSidebar) */}
      {isAuthenticated && (
        <div style={{ padding: '10px', background: '#f8f9fa', borderBottom: '1px solid #e9ecef', textAlign: 'right' }}>
          <span>Usuario: {userRole} | </span>
          <button onClick={handleLogout} style={{ marginLeft: '10px' }}>Cerrar Sesión</button>
        </div>
      )}

      <Routes>
        {/* Ruta para la página de login */}
        {/* Si el usuario ya está autenticado, redirige a la ruta principal ("/") */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage onLoginSuccess={handleLoginSuccess} />}
        />

        {/* Rutas públicas (ej. registro de usuario, recuperación de contraseña) */}
        {/* Estas rutas NO necesitan estar dentro de PrivateRoute */}
        {/* <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />*/}
        {/* <Route path="/usuario/create" element={<CrearUsuarioForm />} /> {/* Puedes dejar esta pública si es un formulario de registro abierto */}


        {/* Rutas Protegidas que utilizan LayoutSidebar */}
        {/* La ruta "/" es ahora una PrivateRoute. Si el usuario no está autenticado,
            será redirigido al /login. Si lo está, mostrará LayoutSidebar con Home. */}
        <Route path="/" element={<PrivateRoute><LayoutSidebar /></PrivateRoute>}>
          {/* Rutas anidadas dentro de LayoutSidebar */}
          <Route index element={<Home />} /> {/* La página de inicio predeterminada */}
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
          {/* Si /usuario/create debe ser accesible solo PARA ADMINS despues del login,
               entonces esta ruta debe ser movida aquí y protegida por PrivateRoute */}
        </Route>

        {/* Opcional: Ruta para acceso no autorizado (si implementas control de roles) */}
        {/* <Route path="/unauthorized" element={<div>Acceso Denegado. No tienes permisos para ver esta página.</div>} /> */}

        {/* Ruta catch-all para cualquier otra URL no definida (páginas 404) */}
        <Route path="*" element={
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>404 - Página no encontrada</h2>
                <p>La URL a la que intentas acceder no existe.</p>
                <Link to="/">Volver al inicio</Link> {/* Asegúrate de importar Link de react-router-dom */}
            </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;