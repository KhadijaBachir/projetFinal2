import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card, Carousel, Navbar, Nav } from "react-bootstrap";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import './Recompenses.css';

const HomePage = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const checkScreenSize = () => {
    setIsSmallScreen(window.innerWidth <= 768);
  };

  useEffect(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div style={{ backgroundColor: "#ff6f61", minHeight: "100vh", overflowX: "hidden" }}>
      {/* Navbar */}
      <Navbar expand="lg" className="shadow-sm" style={{ backgroundColor: "#ff8c7f", padding: "10px 0" }}>
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img
              src="/im18.avif"
              alt="Logo"
              style={{
                height: isSmallScreen ? "100px" : "150px",
                borderRadius: "90px",
                animation: "spin 6s linear infinite",
                marginLeft: isSmallScreen ? "-20px" : "-90px",
              }}
            />
          </Navbar.Brand>

          <Navbar.Brand
            as={Link}
            to="/"
            style={{
              fontSize: isSmallScreen ? "1.8rem" : "2.5rem",
              fontWeight: "bold",
              fontFamily: "'Comic Sans MS', cursive, sans-serif",
              color: "#fff",
              marginLeft: isSmallScreen ? "5px" : "20px",
              marginRight: "20px",
            }}
          >
            GoChallenges
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ border: "none" }} />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto" style={{ alignItems: "center", marginRight: "5px" }}>
              {[
                { name: "Accueil", path: "/" },
                { name: "Dashbord", path: "/deadline" },
                { name: "Défis", path: "/categories-defis" },
                { name: "Récompenses", path: "/recompenses" },
                { name: "Suggestions", path: "/suggestion" },
                { name: "Profile", path: "/profile" },
              ].map((link, index) => (
                <Nav.Link
                  key={index}
                  as={Link}
                  to={link.path}
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "500",
                    color: "#fff",
                    margin: "0 10px",
                    transition: "all 0.3s ease",
                    fontFamily: "'Comic Sans MS', cursive, sans-serif",
                    padding: "8px 12px",
                    borderRadius: "5px",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "rgba(255, 165, 0, 0.5)";
                    e.target.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#fff";
                  }}
                >
                  {link.name}
                </Nav.Link>
              ))}
              <Nav.Link
                as={Link}
                to="/auth"
                style={{
                  backgroundColor: "#ff4500",
                  borderRadius: "5px",
                  padding: "12px 18px",
                  color: "#fff",
                  fontWeight: "500",
                  transition: "background-color 0.3s",
                  margin: "0 0px",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#ff9900")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff4500")}
              >
                Connexion
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>

        <style>
          {`
            @keyframes spin {
              0% { transform: rotateY(0deg); }
              100% { transform: rotateY(360deg); }
            }
          `}
        </style>
      </Navbar>

      {/* Contenu principal */}
      <Container className="text-center pt-5" style={{ paddingTop: "100px" }}>
        {/* Carrousel avec transition de 2 secondes */}
        <Carousel 
          className="mb-4"
          interval={2000}  // Changement toutes les 2 secondes
          fade={true}     // Effet de fondu
        >
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/imm.jpg"
              alt="Défi et motivation"
              style={{ maxHeight: "700px", objectFit: "cover", borderRadius: "15px" }}
            />
            <Carousel.Caption>
              <h3 style={{ fontSize: "2rem", fontWeight: "bold", color: "#fff" }}>Relevez des défis</h3>
              <p style={{ fontSize: "1.2rem", color: "#fff" }}>Testez vos compétences et dépassez vos limites !</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/im8.jpg"
              alt="Défi et motivation"
              style={{ maxHeight: "700px", objectFit: "cover", borderRadius: "15px" }}
            />
            <Carousel.Caption>
              <h3 style={{ fontSize: "2rem", fontWeight: "bold", color: "#fff" }}>Relevez des défis</h3>
              <p style={{ fontSize: "1.2rem", color: "#fff" }}>Testez vos compétences et dépassez vos limites !</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/im3.jpg"
              alt="Gagnez des récompenses"
              style={{ maxHeight: "700px", objectFit: "cover", borderRadius: "15px" }}
            />
            <Carousel.Caption>
              <h3 style={{ fontSize: "2rem", fontWeight: "bold", color: "#fff" }}>Gagnez des récompenses</h3>
              <p style={{ fontSize: "1.2rem", color: "#fff" }}>Accumulez des points et débloquez des prix exclusifs.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/im16.jpg"
              alt="Défi et motivation"
              style={{ maxHeight: "700px", objectFit: "cover", borderRadius: "15px" }}
            />
            <Carousel.Caption>
              <h3 style={{ fontSize: "2rem", fontWeight: "bold", color: "#fff" }}>Relevez des défis</h3>
              <p style={{ fontSize: "1.2rem", color: "#fff" }}>Testez vos compétences et dépassez vos limites !</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/im15.jpg"
              alt="Défi et motivation"
              style={{ maxHeight: "700px", objectFit: "cover", borderRadius: "15px" }}
            />
            <Carousel.Caption>
              <h3 style={{ fontSize: "2rem", fontWeight: "bold", color: "#fff" }}>Relevez des défis</h3>
              <p style={{ fontSize: "1.2rem", color: "#fff" }}>Testez vos compétences et dépassez vos limites !</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="/im4.jpg"
              alt="Défi et motivation"
              style={{ maxHeight: "700px", objectFit: "cover", borderRadius: "15px" }}
            />
            <Carousel.Caption>
              <h3 style={{ fontSize: "2rem", fontWeight: "bold", color: "#fff" }}>Relevez des défis</h3>
              <p style={{ fontSize: "1.2rem", color: "#fff" }}>Testez vos compétences et dépassez vos limites !</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>

        {/* Contenu principal */}
        <Row className="justify-content-center">
          <Col md={8}>
            <h1 className="mb-4" style={{ fontSize: "3rem", fontWeight: "bold", color: "#fff" }}>
              Bienvenue sur GoChallenges
            </h1>
            <p className="lead" style={{ fontSize: "1.5rem", color: "#fff" }}>
              Défiez-vous, gagnez des points et débloquez des récompenses !
            </p>
            <Link to="/auth">
              <Button
                variant="light"
                size="lg"
                style={{
                  fontSize: "1.2rem",
                  padding: "12px 24px",
                  backgroundColor: "#ffcc00",
                  border: "none",
                  transition: "0.3s",
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#ff9900")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#ffcc00")}
              >
                Commencer l'aventure
              </Button>
            </Link>
          </Col>
        </Row>

        {/* Cartes des fonctionnalités */}
        <Row className="mt-5 g-4">
          {[
            { title: "Des défis passionnants", text: "Découvrez une large gamme de défis pour tester vos compétences." },
            { title: "Gagnez des récompenses", text: "Accumulez des points et échangez-les contre des récompenses uniques." },
            { title: "Ameliore ta vie quotidienne", text: "Accomplits vos tâches et ameliore votre vie tout en vous amusant." },
          ].map((item, index) => (
            <Col key={index} xs={12} md={4}>
              <Card
                className="shadow-sm card-hover h-100"
                style={{
                  borderRadius: "15px",
                  transition: "transform 0.3s ease-in-out",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <Card.Body>
                  <Card.Title style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                    {item.title}
                  </Card.Title>
                  <Card.Text style={{ fontSize: "1.2rem" }}>{item.text}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Footer */}
      <footer style={{ backgroundColor: "#333", padding: "20px", marginTop: "50px" }}>
        <Container className="text-center">
          <p style={{ color: "#fff", fontSize: "1.2rem" }}>Suivez-nous sur :</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook size={30} color="#ffffff" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter size={30} color="#ffffff" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram size={30} color="#ffffff" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin size={30} color="#ffffff" />
            </a>
          </div>
          <p style={{ color: "#fff", marginTop: "10px" }}>© 2025 GoChallenges. Tous droits réservés.</p>
        </Container>
      </footer>
    </div>
  );
};

export default HomePage;