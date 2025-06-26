import React, { useState, useEffect, useCallback } from "react";
import DataTable from "react-data-table-component";
import { Container, Card, Button, Form, Alert, Spinner, Tabs, Tab } from "react-bootstrap"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { getUsuarios, updateUsuario } from "../../services/api";
import "../../styles/pages/ListaUnidadMedida.css"; 

const UsuariosList = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('habilitados'); 

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState({
    idUsuario: "",
    nombre: "",
    usuario: "",
    email: "",
    rol: "",
    habilitado: false,
  });
  const [passwordChange, setPasswordChange] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null);

  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (activeTab === 'habilitados') {
        data = await getUsuarios(true); 
      } else { 
        data = await getUsuarios(null); 
      }
      setUsuarios(data);
    } catch (error) {
      console.error("Error al cargar los usuarios:", error);
      setError("Error al cargar los usuarios. Por favor, inténtelo de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  }, [activeTab]); 
  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]); 

  const handleTabSelect = (key) => {
    setActiveTab(key);
    setMostrarFormulario(false);
    setUsuarioEditando({ idUsuario: "", nombre: "", usuario: "", email: "", rol: "", habilitado: false });
    setPasswordChange('');
    setConfirmPassword('');
    setPasswordError(null);
  };

  const handleEdit = (usuario) => {
    setUsuarioEditando({
      idUsuario: usuario.idUsuario,
      nombre: usuario.nombre,
      usuario: usuario.usuario,
      email: usuario.email,
      rol: usuario.rol,
      habilitado: usuario.habilitado,
    });
    setPasswordChange('');
    setConfirmPassword('');
    setPasswordError(null);
    setMostrarFormulario(true);
  };

  const handleDisable = (usuario) => {
    if (window.confirm(`¿Estás seguro de DESHABILITAR al usuario "${usuario.usuario}"? Esto lo hará inactivo en el sistema.`)) {
      setUsuarioEditando({
        idUsuario: usuario.idUsuario,
        nombre: usuario.nombre,
        usuario: usuario.usuario,
        email: usuario.email,
        rol: usuario.rol,
        habilitado: false,
      });
      setPasswordChange('');
      setConfirmPassword('');
      setPasswordError(null);
      setMostrarFormulario(true);
      alert("Por favor, revise los datos y presione 'Guardar' para confirmar la deshabilitación.");
    }
  };

  const handleCancelarEdicion = () => {
    setMostrarFormulario(false);
    setUsuarioEditando({
      idUsuario: "", nombre: "", usuario: "", email: "", rol: "", habilitado: false
    });
    setPasswordChange('');
    setConfirmPassword('');
    setPasswordError(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUsuarioEditando(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPasswordError(null);

    if (passwordChange) {
      if (passwordChange !== confirmPassword) {
        setPasswordError("Las contraseñas no coinciden.");
        setLoading(false);
        return;
      }
      if (passwordChange.length < 6) {
        setPasswordError("La nueva contraseña debe tener al menos 6 caracteres.");
        setLoading(false);
        return;
      }
    }

    try {
      const usuarioParaActualizar = { ...usuarioEditando };

      if (passwordChange) {
        usuarioParaActualizar.contrasena = passwordChange;
      } else {
        delete usuarioParaActualizar.contrasena;
        delete usuarioParaActualizar.contrasenaHash;
      }

      await updateUsuario(usuarioParaActualizar);

      fetchUsuarios();

      setMostrarFormulario(false);
      setPasswordChange('');
      setConfirmPassword('');
      alert("Los cambios se guardaron correctamente");
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      setError(error.response?.data?.message || "Hubo un error al guardar los cambios.");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { name: "ID", selector: (row) => row.idUsuario, sortable: true, width: "60px" },
    { name: "Nombre Completo", selector: (row) => row.nombre, sortable: true },
    { name: "Usuario", selector: (row) => row.usuario, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    { name: "Rol", selector: (row) => row.rol, sortable: true },
    { name: "Habilitado", selector: (row) => (row.habilitado ? "Sí" : "No"), sortable: true, width: "100px" },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="button-group">
          <Button variant="primary" className="bg-primary" size="sm" onClick={() => handleEdit(row)}>
            <FontAwesomeIcon icon={faPencil} />
          </Button>
          <Button variant="warning" className="bg-warning" size="sm" onClick={() => handleDisable(row)} title="Deshabilitar Usuario">
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "120px"
    },
  ];

  if (loading) { return <p>Cargando usuarios...</p>; }
  if (error) { return <Alert variant="danger">{error}</Alert>; }

  const containerStyle = { display: 'flex', flexDirection: 'row', gap: '20px', width: '100%' };
  const tableStyle = { flex: mostrarFormulario ? '1 1 65%' : '1 1 100%' };
  const formStyle = { flex: '0 0 30%', minWidth: '300px' };

  return (
    <div className="form-wrapper">
      <Container fluid className="mt-4">
        <h2 className="mb-3">Gestión de Usuarios</h2>

        <Tabs
          id="usuario-tabs"
          activeKey={activeTab}
          onSelect={handleTabSelect}
          className="mb-3"
        >
          <Tab eventKey="habilitados" title="Usuarios Habilitados">
            <div style={containerStyle}>
              <div style={tableStyle}>
                <Card>
                  <DataTable
                    columns={columns}
                    data={usuarios}
                    pagination
                    highlightOnHover
                    responsive
                  />
                </Card>
              </div>

              {mostrarFormulario && (
                <div style={formStyle}>
                  <Card className="p-3">
                    <h4 className="mb-3">Editar Usuario</h4>
                    {passwordError && <Alert variant="danger">{passwordError}</Alert>}
                    <Form onSubmit={handleSaveChanges}>
                      <Form.Group className="mb-3">
                        <Form.Label>Nombre Completo</Form.Label>
                        <Form.Control type="text" name="nombre" value={usuarioEditando.nombre || ""} onChange={handleInputChange} required />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Usuario (Login)</Form.Label>
                        <Form.Control type="text" name="usuario" value={usuarioEditando.usuario || ""} onChange={handleInputChange} required readOnly />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" value={usuarioEditando.email || ""} onChange={handleInputChange} required />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Rol</Form.Label>
                        <Form.Control as="select" name="rol" value={usuarioEditando.rol || ""} onChange={handleInputChange} required>
                          <option value="">Seleccione un rol</option>
                          <option value="ADMIN">ADMIN</option>
                          <option value="VENDEDOR">VENDEDOR</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Check type="checkbox" label="Habilitado" name="habilitado" checked={usuarioEditando.habilitado} onChange={handleInputChange} />
                      </Form.Group>
                      <h5 className="mt-4">Cambiar Contraseña (Opcional)</h5>
                      <Form.Group className="mb-3">
                        <Form.Label>Nueva Contraseña</Form.Label>
                        <Form.Control type="password" name="passwordChange" value={passwordChange} onChange={(e) => setPasswordChange(e.target.value)} placeholder="Dejar en blanco para no cambiar" />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Confirmar Nueva Contraseña</Form.Label>
                        <Form.Control type="password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repetir nueva contraseña" />
                      </Form.Group>

                      <div className="d-flex justify-content-end gap-2">
                        <Button variant="secondary" onClick={handleCancelarEdicion} disabled={loading}>
                          <FontAwesomeIcon icon={faTimes} className="me-1" /> Cancelar
                        </Button>
                        <Button variant="success" type="submit" disabled={loading}>
                          {loading ? (
                            <Spinner animation="border" size="sm" className="me-2" />
                          ) : (
                            <>
                              <FontAwesomeIcon icon={faSave} className="me-1" /> Guardar
                            </>
                          )}
                        </Button>
                      </div>
                    </Form>
                  </Card>
                </div>
              )}
            </div>
          </Tab>

          <Tab eventKey="todos" title="Todos los Usuarios">
            <div style={containerStyle}>
              <div style={tableStyle}>
                <Card>
                  <DataTable
                    columns={columns}
                    data={usuarios}
                    pagination
                    highlightOnHover
                    responsive
                  />
                </Card>
              </div>

              {mostrarFormulario && (
                <div style={formStyle}>
                  <Card className="p-3">
                    <h4 className="mb-3">Editar Usuario</h4>
                    {passwordError && <Alert variant="danger">{passwordError}</Alert>}
                    <Form onSubmit={handleSaveChanges}>
                      <Form.Group className="mb-3">
                        <Form.Label>Nombre Completo</Form.Label>
                        <Form.Control type="text" name="nombre" value={usuarioEditando.nombre || ""} onChange={handleInputChange} required />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Usuario (Login)</Form.Label>
                        <Form.Control type="text" name="usuario" value={usuarioEditando.usuario || ""} onChange={handleInputChange} required readOnly />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" value={usuarioEditando.email || ""} onChange={handleInputChange} required />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Rol</Form.Label>
                        <Form.Control as="select" name="rol" value={usuarioEditando.rol || ""} onChange={handleInputChange} required>
                          <option value="">Seleccione un rol</option>
                          <option value="ADMIN">ADMIN</option>
                          <option value="VENDEDOR">VENDEDOR</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Check type="checkbox" label="Habilitado" name="habilitado" checked={usuarioEditando.habilitado} onChange={handleInputChange} />
                      </Form.Group>
                      <h5 className="mt-4">Cambiar Contraseña (Opcional)</h5>
                      <Form.Group className="mb-3">
                        <Form.Label>Nueva Contraseña</Form.Label>
                        <Form.Control type="password" name="passwordChange" value={passwordChange} onChange={(e) => setPasswordChange(e.target.value)} placeholder="Dejar en blanco para no cambiar" />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Confirmar Nueva Contraseña</Form.Label>
                        <Form.Control type="password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repetir nueva contraseña" />
                      </Form.Group>

                      <div className="d-flex justify-content-end gap-2">
                        <Button variant="secondary" onClick={handleCancelarEdicion} disabled={loading}>
                          <FontAwesomeIcon icon={faTimes} className="me-1" /> Cancelar
                        </Button>
                        <Button variant="success" type="submit" disabled={loading}>
                          {loading ? (
                            <Spinner animation="border" size="sm" className="me-2" />
                          ) : (
                            <>
                              <FontAwesomeIcon icon={faSave} className="me-1" /> Guardar
                            </>
                          )}
                        </Button>
                      </div>
                    </Form>
                  </Card>
                </div>
              )}
            </div>
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
};

export default UsuariosList;