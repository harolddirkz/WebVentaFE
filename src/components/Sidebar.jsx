import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLayerGroup,
  faBoxOpen,
  faShoppingCart,
  faShop,
  faHouse,
  faListOl,
  faPlus,
  faWeightHanging,
  faTruckField,
  faLocationDot,
  faChevronDown,
  faChevronRight,
  faUserTie,
  faScrewdriverWrench,
  faFileExport,
  faForwardStep,
} from "@fortawesome/free-solid-svg-icons";
import "../styles/components/Sidebar.css";
import logo from "../assets/logo.png";

const Sidebar = () => {
  const [openProducts, setOpenProducts] = useState(false);
  const [openReportes, setOpenReportes] = useState(false);
  const [openCategories, setOpenCategories] = useState(false);
  const [openUnidadesMedida, setOpenUnidadesMedida] = useState(false);
  const [openUbicaciones, setOpenUbicaciones] = useState(false);
  const [openProveedores, setOpenProveedores] = useState(false);
  const [openUsuarios, setOpenUsuarios] = useState(false);

  const toggleProducts = () => {
    setOpenProducts(!openProducts);
  };

  const toggleReportes = () => {
    setOpenReportes(!openReportes);
  };

  const toggleCategories = () => {
    setOpenCategories(!openCategories);
  };

  const toggleUnidadesMedida = () => {
    setOpenUnidadesMedida(!openUnidadesMedida);
  };

  const toggleUbicaciones = () => {
    setOpenUbicaciones(!openUbicaciones);
  };

  const toggleProveedores = () => {
    setOpenProveedores(!openProveedores);
  };

  const toggleUsuarios = () => {
    setOpenUsuarios(!openUsuarios);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="Logo" className="logo-img" />
      </div>
      <Nav defaultActiveKey="/home" className="flex-column">
        <Nav.Link href="/home">
          <FontAwesomeIcon icon={faHouse} /> Inicio
        </Nav.Link>
        <div className="nav-item">
          <div className="nav-link dropdown-toggle" onClick={toggleProducts}>
            <span>
              <FontAwesomeIcon icon={faBoxOpen} /> Productos  
            </span>
            <span className="chevron">
              {openProducts ? (
                <FontAwesomeIcon icon={faChevronDown} />
              ) : (
                <FontAwesomeIcon icon={faChevronRight} />
              )}
            </span>
          </div>
          {openProducts && (
            <div className="sub-menu">
              <Nav.Link href="/products/create" className="sub-item">
                <FontAwesomeIcon icon={faPlus} /> Crear Producto
              </Nav.Link>
              <Nav.Link href="/products/list" className="sub-item">
                <FontAwesomeIcon icon={faListOl} /> Listar Producto
              </Nav.Link>
            </div>
          )}
        </div>
        <Nav.Link href="/products/list-my-products">
          <FontAwesomeIcon icon={faShoppingCart} /> Venta
        </Nav.Link>
        <Nav.Link href="/buys/register">
          <FontAwesomeIcon icon={faShop} /> Compra
        </Nav.Link>

        <div className="nav-item">
          <div className="nav-link dropdown-toggle" onClick={toggleReportes}>
            <span>
              <FontAwesomeIcon icon={faFileExport} /> Reportes  
            </span>
            <span className="chevron">
              {openReportes ? (
                <FontAwesomeIcon icon={faChevronDown} />
              ) : (
                <FontAwesomeIcon icon={faChevronRight} />
              )}
            </span>
          </div>
          {openReportes && (
            <div className="sub-menu">
              <Nav.Link href="/sales/report" className="sub-item">
                <FontAwesomeIcon icon={faForwardStep} /> Reporte Último
              </Nav.Link>
            </div>
          )}
        </div>

        <Nav.Link href="/productos/update-stock">
          <FontAwesomeIcon icon={faScrewdriverWrench} /> Mantenimiento Stock
        </Nav.Link>
        <Nav.Link href="/users">
          <FontAwesomeIcon icon={faUserTie} /> Usuarios
        </Nav.Link>

        <div className="nav-item">
          <div className="nav-link dropdown-toggle" onClick={toggleCategories}>
            <span>
              <FontAwesomeIcon icon={faLayerGroup} /> Categoria  
            </span>
            <span className="chevron">
              {openCategories ? (
                <FontAwesomeIcon icon={faChevronDown} />
              ) : (
                <FontAwesomeIcon icon={faChevronRight} />
              )}
            </span>
          </div>
          {openCategories && (
            <div className="sub-menu">
              <Nav.Link href="/categoria/createCategoria" className="sub-item">
                <FontAwesomeIcon icon={faPlus} /> Crear Categoria
              </Nav.Link>
              <Nav.Link href="/categoria/list" className="sub-item">
                <FontAwesomeIcon icon={faListOl} /> Listar Categoria
              </Nav.Link>
            </div>
          )}
        </div>

        <div className="nav-item">
          <div className="nav-link dropdown-toggle" onClick={toggleUnidadesMedida}>
            <span>
              <FontAwesomeIcon icon={faWeightHanging} /> Unidad de Medida  
            </span>
            <span className="chevron">
              {openUnidadesMedida ? (
                <FontAwesomeIcon icon={faChevronDown} />
              ) : (
                <FontAwesomeIcon icon={faChevronRight} />
              )}
            </span>
          </div>
          {openUnidadesMedida&& (
            <div className="sub-menu">
              <Nav.Link href="/unidad-medida/createUnidadMedida" className="sub-item">
                <FontAwesomeIcon icon={faPlus} /> Crear Unidad Medida
              </Nav.Link>
              <Nav.Link href="/unidad-medida/list" className="sub-item">
                <FontAwesomeIcon icon={faListOl} /> Listar Unidades Medida
              </Nav.Link>
            </div>
          )}
        </div>

        <div className="nav-item">
          <div className="nav-link dropdown-toggle" onClick={toggleProveedores}>
            <span>
              <FontAwesomeIcon icon={faTruckField} /> Proveedores  
            </span>
            <span className="chevron">
              {openProveedores ? (
                <FontAwesomeIcon icon={faChevronDown} />
              ) : (
                <FontAwesomeIcon icon={faChevronRight} />
              )}
            </span>
          </div>
          {openProveedores&& (
            <div className="sub-menu">
              <Nav.Link href="/cliente/create" className="sub-item">
                <FontAwesomeIcon icon={faPlus} /> Crear Cliente/Prov
              </Nav.Link>
              <Nav.Link href="/cliente/list" className="sub-item">
                <FontAwesomeIcon icon={faListOl} /> Listar Cliente/Prov
              </Nav.Link>
            </div>
          )}
        </div>

        <div className="nav-item">
          <div className="nav-link dropdown-toggle" onClick={toggleUbicaciones}>
            <span>
              <FontAwesomeIcon icon={faLocationDot} /> Ubicaciones  
            </span>
            <span className="chevron">
              {openUbicaciones ? (
                <FontAwesomeIcon icon={faChevronDown} />
              ) : (
                <FontAwesomeIcon icon={faChevronRight} />
              )}
            </span>
          </div>
          {openUbicaciones&& (
            <div className="sub-menu">
              <Nav.Link href="/ubicacion/create" className="sub-item">
                <FontAwesomeIcon icon={faPlus} /> Crear Ubicacion
              </Nav.Link>
              <Nav.Link href="/ubicacion/list" className="sub-item">
                <FontAwesomeIcon icon={faListOl} /> Listar Ubicaciones
              </Nav.Link>
            </div>
          )}
        </div>

        <div className="nav-item">
          <div className="nav-link dropdown-toggle" onClick={toggleUsuarios}>
            <span>
              <FontAwesomeIcon icon={faLocationDot} /> Usuarios  
            </span>
            <span className="chevron">
              {openUsuarios ? (
                <FontAwesomeIcon icon={faChevronDown} />
              ) : (
                <FontAwesomeIcon icon={faChevronRight} />
              )}
            </span>
          </div>
          {openUsuarios&& (
            <div className="sub-menu">
              <Nav.Link href="/usuario/create" className="sub-item">
                <FontAwesomeIcon icon={faPlus} /> Crear Usuario
              </Nav.Link>
              <Nav.Link href="/ubicacion/list" className="sub-item">
                <FontAwesomeIcon icon={faListOl} /> Listar Usuario
              </Nav.Link>
            </div>
          )}
        </div>
      </Nav>
    </div>
  );
};

export default Sidebar;
