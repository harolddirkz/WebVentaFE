import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LayoutSidebar from './components/LayoutSidebar';
import Home from './pages/Home';
import FormularioCrearProducto from './services/producto/FormularioCrearProducto';
import ListaProducto from './services/producto/ListaProducto';
import FormularioMisProductos from './services/producto/FormularioMisProductos';
import ProductoStock from './services/producto/ProductoStock';
import FormCategoria from './services/categoria/FormularioCrearCategoria';
import FormUnidadMedida from './services/unidadMedida/FormularioCrearUnidadMedida';
import ListaCategorias from './services/categoria/ListaCategorias';
import ListaUnidadMedida from './services/unidadMedida/ListaUnidadMedida';
import FormularioCrearUbicacion from './services/ubicacion/FormularioCrearUbicacion';
import ListUbicaciones from './services/ubicacion/ListaUbicaciones';
import CompraForm from './services/compra/CompraForm';
import ReporteFecha from './services/venta/ReporteFecha';
import CreateClienteForm from './services/cliente/FormularioCrearCliente';
import ListarEntidades from './services/cliente/ListarEntidades';
import CrearUsuarioForm from './services/usuario/CrearUsuarioForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LayoutSidebar />}>
          <Route index element={<Home />} />
          <Route path="/products/create" element={<FormularioCrearProducto />} />
          <Route path="/products/list" element={<ListaProducto />} />
          <Route path="/products/list-my-products" element={<FormularioMisProductos />} />
          <Route path="/categoria/createCategoria" element={<FormCategoria />} />
          <Route path="/categoria/list" element={<ListaCategorias />} />
          <Route path="/unidad-medida/createUnidadMedida" element={<FormUnidadMedida />} />
          <Route path="/unidad-medida/list" element={<ListaUnidadMedida />} />
          <Route path="/ubicacion/create" element={<FormularioCrearUbicacion />} />
          <Route path="/ubicacion/list" element={<ListUbicaciones />} />
          <Route path="/buys/register" element={<CompraForm />} />
          <Route path="/productos/update-stock" element={<ProductoStock />} />
          <Route path="/sales/report" element={<ReporteFecha />} />
          <Route path="/cliente/create" element={<CreateClienteForm />} />
          <Route path="/cliente/list" element={<ListarEntidades />} />
          <Route path="/usuario/create" element={<CrearUsuarioForm />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;