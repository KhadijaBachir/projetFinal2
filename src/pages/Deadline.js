import React, { useState, useEffect } from "react";
import { Rocket, Award, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Container, Navbar, Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Deadline = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.successMessage) {
      toast.success(location.state.successMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, [location.state]);

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const checkScreenSize = () => {
    setIsSmallScreen(window.innerWidth <= 768);
  };

  useEffect(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Animations pour les cartes
  const cardVariants = {
    hidden: { 
      y: 50,
      opacity: 0,
      scale: 0.95 
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    },
    hover: {
      y: -10,
      scale: 1.03,
      boxShadow: "0 15px 30px -5px rgba(0,0,0,0.2)",
      transition: {
        type: "spring",
        stiffness: 300
      }
    }
  };

  const iconVariants = {
    hover: {
      rotate: [0, 15, -15, 0],
      scale: 1.1,
      transition: {
        duration: 0.6
      }
    }
  };

  // Styles des cartes
  const cardStyles = {
    primary: {
      background: "linear-gradient(145deg, #ff9a8b, #ff6f61)",
      color: "white",
      borderRadius: "25px"
    },
    warning: {
      background: "linear-gradient(145deg, #ffb347, #ff8c00)",
      color: "white",
      borderRadius: "25px"
    },
    success: {
      background: "linear-gradient(145deg, #56ab2f, #a8e063)",
      color: "white",
      borderRadius: "25px"
    }
  };

  const buttonStyles = {
    primary: {
      background: "rgba(255,255,255,0.2)",
      backdropFilter: "blur(5px)",
      border: "1px solid rgba(255,255,255,0.3)",
      fontWeight: "600"
    },
    warning: {
      background: "rgba(255,255,255,0.2)",
      backdropFilter: "blur(5px)",
      border: "1px solid rgba(255,255,255,0.3)",
      fontWeight: "600"
    },
    success: {
      background: "rgba(255,255,255,0.2)",
      backdropFilter: "blur(5px)",
      border: "1px solid rgba(255,255,255,0.3)",
      fontWeight: "600"
    }
  };

  return (
    <div style={{ backgroundColor: "#ff6f61", minHeight: "100vh", overflowX: "hidden" }}>
        {/* Navbar */}
            <Navbar expand="lg" className="shadow-sm" style={{ backgroundColor: "#ff8c7f", padding: "10px 0" }}>
              <Container>
                {/* Logo à gauche avec animation */}
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
      
                {/* Titre à droite */}
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
      
                {/* Bouton de bascule pour les écrans mobiles */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ border: "none" }} />
      
                {/* Liens de navigation */}
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="ms-auto" style={{ alignItems: "center", marginRight: "5px" }}>
                    {[
                      { name: "Accueil", path: "/" },
                      { name: "Dashbord", path: "/deadline" },
                      { name: "Défis", path: "/categories-defis" },
                      { name: "Récompenses", path: "/recompenses" },
                      { name: "Suggestions", path: "/suggestion" },
                      { name: "Profile", path: "/profile" }, // Lien vers Profile.js
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
                          e.target.style.backgroundColor = "rgba(255, 165, 0, 0.5)"; // Fond orange semi-transparent
                          e.target.style.color = "#fff"; // Texte blanc
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "transparent"; // Fond transparent
                          e.target.style.color = "#fff"; // Texte blanc
                        }}
                      >
                        {link.name}
                      </Nav.Link>
                    ))}
                    {/* Bouton Connexion */}
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
      
              {/* Styles globaux pour l'animation du logo */}
              <style>
                {`
                  @keyframes spin {
                    0% {
                      transform: rotateY(0deg);
                    }
                    100% {
                      transform: rotateY(360deg);
                    }
                  }
                `}
              </style>
            </Navbar>
      {/* Image en haut - inchangée */}
      <img
        src="/je.avif"
        alt="Joie"
        style={{
          width: "100%",
          height: "600px",
          objectFit: "cover",
          objectPosition: "center",
          display: "block",
          margin: "0",
          borderRadius: "0",
        }}
      />

      {/* Section des cartes - modernisée */}
      <div className="container py-5">
        <h1 className="text-center mb-5 display-4 fw-bold text-white">Tableau de Bord</h1>
        <div className="row g-4">
          {/* Carte Défis */}
          <div className="col-md-4">
            <motion.div
              initial="hidden"
              animate="visible"
              whileHover="hover"
              variants={cardVariants}
              className="card h-100 shadow-lg overflow-hidden"
              style={cardStyles.primary}
            >
              <div className="card-body text-center p-4 d-flex flex-column">
                <motion.div variants={iconVariants} whileHover="hover" className="mb-4">
                  <Rocket size={48} className="mx-auto" />
                </motion.div>
                <h2 className="card-title fw-bold mb-3">Mes Défis</h2>
                <p className="card-text mb-4">Prêt pour l'aventure?</p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/categories-defis" 
                    className="btn mt-3 mx-auto"
                    style={buttonStyles.primary}
                  >
                    Voir les détails
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Carte Points */}
          <div className="col-md-4">
            <motion.div
              initial="hidden"
              animate="visible"
              whileHover="hover"
              variants={cardVariants}
              className="card h-100 shadow-lg overflow-hidden"
              style={cardStyles.warning}
            >
              <div className="card-body text-center p-4 d-flex flex-column">
                <motion.div variants={iconVariants} whileHover="hover" className="mb-4">
                  <Award size={48} className="mx-auto" />
                </motion.div>
                <h2 className="card-title fw-bold mb-3">Points gagnés</h2>
                <p className="card-text mb-4">Accomplis tes défis et gagnes des récompenses</p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/recompenses" 
                    className="btn mt-3 mx-auto"
                    style={buttonStyles.warning}
                  >
                    Voir les récompenses
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Carte Suggestions */}
          <div className="col-md-4">
            <motion.div
              initial="hidden"
              animate="visible"
              whileHover="hover"
              variants={cardVariants}
              className="card h-100 shadow-lg overflow-hidden"
              style={cardStyles.success}
            >
              <div className="card-body text-center p-4 d-flex flex-column">
                <motion.div variants={iconVariants} whileHover="hover" className="mb-4">
                  <Zap size={48} className="mx-auto" />
                </motion.div>
                <h2 className="card-title fw-bold mb-3">Suggestions</h2>
                <p className="card-text mb-4">Découvrez de nouveaux défis !</p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/explorateur" 
                    className="btn mt-3 mx-auto"
                    style={buttonStyles.success}
                  >
                    Explorer
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer - inchangé */}
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
          <p style={{ color: "#fff", marginTop: "10px" }}>© 2025 GoChallenge Tous droits réservés.</p>
        </Container>
      </footer>

      <ToastContainer />
    </div>
  );
};

export default Deadline;