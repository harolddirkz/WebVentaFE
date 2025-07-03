import React from 'react';
import { Carousel, Container, Row, Col, Card, Button } from 'react-bootstrap';
import './StylesHome.css';

const Home = () => {
  return (
    <div>

      {/* Carrusel Hero */}
      <section className="hero-carousel text-white text-center">
        <div className="hero-overlay">
          <h1>Mantenimiento, reparación y cuidado profesional para tu motocicleta</h1>
          <div className="mt-4">
            <Button variant="warning" className="me-3">📅 Agendar Cita</Button>
            <Button variant="outline-light">🔧 Ver Servicios</Button>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="servicios py-5 bg-white">
        <Container>
          <h2 className="text-center fw-bold mb-3">Nuestros Servicios</h2>
          <p className="text-center text-muted mb-5">
            Ofrecemos servicios completos de mantenimiento y reparación para todo tipo de motocicletas
          </p>
          <Row className="g-4">
            {[
              {
                icon: "🛠️",
                title: "Mantenimiento General",
                desc: "Cambio de aceite, filtros, bujías y revisión completa de tu moto",
              },
              {
                icon: "⚙️",
                title: "Reparaciones Mecánicas",
                desc: "Motor, transmisión, frenos y sistema de suspensión",
              },
              {
                icon: "🔌",
                title: "Sistema Eléctrico",
                desc: "Diagnóstico y reparación de sistemas eléctricos y electrónicos",
              },
              {
                icon: "🛡️",
                title: "Revisión Técnico-Mecánica",
                desc: "Preparación para la revisión técnico-mecánica obligatoria",
              },
            ].map((serv, idx) => (
              <Col md={6} lg={3} key={idx}>
                <Card className="servicio-card text-center p-3">
                  <div className="servicio-icon mb-2">{serv.icon}</div>
                  <Card.Title>{serv.title}</Card.Title>
                  <Card.Text className="text-muted">{serv.desc}</Card.Text>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Contacto */}
      <section className="contacto py-5 bg-light">
        <Container>
          <h2 className="text-center fw-bold mb-3">Contáctanos</h2>
          <p className="text-center text-muted mb-5">¿Necesitas ayuda con tu moto? Estamos aquí para ayudarte</p>
          <Row className="g-4 text-center">
            <Col md={4}>
              <Card className="contact-card p-4">
                <div className="contact-icon">📞</div>
                <h5>Llámanos</h5>
                <p className="text-muted">Agenda tu cita por teléfono</p>
                <Button variant="warning">+51 935 874 344</Button>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="contact-card p-4">
                <div className="contact-icon">📧</div>
                <h5>Escríbenos</h5>
                <p className="text-muted">Envíanos un correo electrónico</p>
                <Button variant="outline-secondary">Enviar Email</Button>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="contact-card p-4">
                <div className="contact-icon">📍</div>
                <h5>Visítanos</h5>
                <p className="text-muted">Ven a nuestro taller</p>
                <Button variant="outline-secondary">Ver Ubicación</Button>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="footer bg-white py-4 border-top">
        <Container>
          <Row>
            <Col md={4} className="mb-4">
              <h5 className="fw-bold text-orange">🔧 MotoTaller D & F</h5>
              <p className="text-muted">Tu taller de confianza para el cuidado y mantenimiento de tu motocicleta.</p>
              <div className="social-icons">
                <a href="#"><i className="bi bi-facebook me-3"></i></a>
                <a href="#"><i className="bi bi-instagram"></i></a>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <h6 className="fw-bold">Servicios</h6>
              <ul className="list-unstyled text-muted">
                <li>Mantenimiento</li>
                <li>Reparaciones</li>
                <li>Sistema Eléctrico</li>
                <li>Revisión Técnica</li>
              </ul>
            </Col>
            <Col md={4}>
              <h6 className="fw-bold">Contacto</h6>
              <ul className="list-unstyled text-muted">
                <li>📞 +51 935 874 344</li>
                <li>✉️ dyfmotors@gmail.com</li>
                <li>📍 Av. San Francisco , San Juan Bautista, Ayacucho</li>
              </ul>
            </Col>
          </Row>
          <p className="text-center text-muted mt-4 mb-0">© 2025 MotoTaller D&F. Todos los derechos reservados.</p>
        </Container>
      </footer>
    </div>
  );
};

export default Home;
