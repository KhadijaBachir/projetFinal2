import React, { useState, useEffect } from "react";
import { 
  Container, Card, Image, Table, Button, Form, Alert, Spinner,
  Navbar, Nav, Modal
} from "react-bootstrap";
import { 
  FaUserCircle, FaUpload, FaTrophy, FaHistory, FaSignOutAlt,
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaTrash
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const [user, setUser] = useState({
    name: "Utilisateur",
    email: "",
    photoURL: null,
    points: 0,
    rewards: [],
    completedChallenges: []
  });
  const [profileImage, setProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [showAllChallenges, setShowAllChallenges] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [challengeToDelete, setChallengeToDelete] = useState(null);

  // Détection de la taille de l'écran
  const checkScreenSize = () => {
    setIsSmallScreen(window.innerWidth <= 768);
  };

  useEffect(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Charger les données depuis localStorage
  useEffect(() => {
    const loadUserData = () => {
      const savedUserData = localStorage.getItem('userData');
      const userData = savedUserData ? JSON.parse(savedUserData) : {};
      
      const completedChallenges = JSON.parse(localStorage.getItem('completedChallenges')) || [];
      
      // Calculer le total des points à partir des défis complétés
      const totalPoints = completedChallenges.reduce((sum, challenge) => sum + (challenge.points || 5), 0);
      
      setUser({
        name: userData.name || "Utilisateur",
        email: userData.email || "",
        photoURL: userData.photoURL || null,
        points: userData.points || totalPoints, // Utiliser les points sauvegardés ou calculer
        rewards: userData.rewards || [],
        completedChallenges: completedChallenges
      });
    };

    loadUserData();
  }, []);

  // Sauvegarder les données utilisateur
  const saveUserData = (updatedUser) => {
    localStorage.setItem('userData', JSON.stringify({
      name: updatedUser.name,
      email: updatedUser.email,
      photoURL: updatedUser.photoURL,
      points: updatedUser.points,
      rewards: updatedUser.rewards
    }));
    localStorage.setItem('completedChallenges', JSON.stringify(updatedUser.completedChallenges));
    setUser(updatedUser);
  };

  // Simuler l'upload d'une image
  const handleImageUpload = async () => {
    if (!profileImage) return;
    
    setUploading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoURL = e.target.result;
        const updatedUser = { ...user, photoURL };
        saveUserData(updatedUser);
        setProfileImage(null);
        toast.success("Photo de profil mise à jour !");
      };
      reader.readAsDataURL(profileImage);
    } catch (error) {
      toast.error("Erreur lors de l'upload : " + error.message);
    } finally {
      setUploading(false);
    }
  };

  // Simuler la déconnexion
  const handleLogout = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success("Déconnexion réussie");
      window.location.href = "/";
    } catch (error) {
      toast.error("Erreur de déconnexion : " + error.message);
    }
  };

  // Confirmer la suppression d'un défi
  const confirmDeleteChallenge = (challenge) => {
    setChallengeToDelete(challenge);
    setShowDeleteModal(true);
  };

  // Supprimer un défi
  const deleteChallenge = () => {
    if (!challengeToDelete) return;
    
    const updatedChallenges = user.completedChallenges.filter(
      c => c.completionDate !== challengeToDelete.completionDate
    );
    
    // Recalculer les points après suppression
    const updatedPoints = updatedChallenges.reduce((sum, challenge) => sum + (challenge.points || 5), 0);
    
    const updatedUser = {
      ...user,
      completedChallenges: updatedChallenges,
      points: updatedPoints
    };
    
    saveUserData(updatedUser);
    setShowDeleteModal(false);
    setChallengeToDelete(null);
    toast.success("Défi supprimé de l'historique");
  };

  // Trier les défis du plus récent au plus ancien
  const sortedChallenges = [...user.completedChallenges].sort((a, b) => 
    new Date(b.completionDate) - new Date(a.completionDate)
  );

  // Défis à afficher (3 si showAllChallenges est false, sinon tous)
  const challengesToDisplay = showAllChallenges 
    ? sortedChallenges 
    : sortedChallenges.slice(0, 3);

  return (
    <div style={{ backgroundColor: "#ff6f61", minHeight: "100vh" }}>
      {/* Navbar */}
      <Navbar expand="lg" className="shadow-sm" style={{ backgroundColor: "#ff8c7f", padding: "10px 0" }}>
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img
              src="/log.jpg"
              alt="Logo"
              style={{
                height: isSmallScreen ? "100px" : "150px",
                borderRadius: "55px",
                animation: "spin 4s linear infinite",
                marginLeft: isSmallScreen ? "-20px" : "-90px",
              }}
            />
          </Navbar.Brand>

          <Navbar.Brand
            as={Link}
            to="/"
            style={{
              fontSize: isSmallScreen ? "1.8rem" : "2.2rem",
              fontWeight: "bold",
              fontFamily: "'Comic Sans MS', cursive, sans-serif",
              color: "#fff",
              marginLeft: isSmallScreen ? "5px" : "20px",
              marginRight: "20px",
            }}
          >
            Challenge Master
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ border: "none" }} />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto" style={{ alignItems: "center", marginRight: "5px" }}>
              {[
                { name: "Accueil", path: "/" },
                { name: "Tableau de bord", path: "/deadline" },
                { name: "Défis", path: "/categories-defis" },
                { name: "Récompenses", path: "/recompenses" },
                { name: "Suggestions", path: "/suggestion" },
                { name: "Profil", path: "/profile" },
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
                  padding: "9px 10px",
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
      <Container className="py-4" style={{ paddingTop: "30px", paddingBottom: "50px" }}>
        <ToastContainer />
        
        <Card className="mb-4">
          <Card.Body className="text-center">
            <div className="position-relative mb-3">
              {user.photoURL ? (
                <Image 
                  src={user.photoURL} 
                  roundedCircle 
                  style={{ width: 150, height: 150, objectFit: 'cover' }}
                  alt="Photo de profil"
                />
              ) : (
                <FaUserCircle size={150} className="text-secondary" />
              )}
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setProfileImage(e.target.files[0])}
                style={{ display: 'none' }}
                id="profileUpload"
              />
              <Button
                variant="primary"
                size="sm"
                className="position-absolute bottom-0 end-0 rounded-circle"
                onClick={() => document.getElementById('profileUpload').click()}
                disabled={uploading}
              >
                <FaUpload />
              </Button>
            </div>

            {profileImage && (
              <div className="mb-3">
                <Button 
                  variant="success" 
                  onClick={handleImageUpload}
                  disabled={uploading}
                  className="me-2"
                >
                  {uploading ? 'Envoi en cours...' : 'Enregistrer'}
                </Button>
                <Button 
                  variant="outline-secondary" 
                  onClick={() => setProfileImage(null)}
                  disabled={uploading}
                >
                  Annuler
                </Button>
              </div>
            )}

            <h2>{user.name}</h2>
            <p className="text-muted">{user.email}</p>
            <div className="badge bg-primary fs-5 mb-3">
              {user.points} points
            </div>
            <Button variant="danger" onClick={handleLogout}>
              <FaSignOutAlt /> Déconnexion
            </Button>
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Header className="d-flex align-items-center">
            <FaTrophy className="me-2" />
            Mes Récompenses
          </Card.Header>
          <Card.Body>
            {user.rewards.length > 0 ? (
              <div className="rewards-grid">
                {user.rewards.map((reward, i) => (
                  <div key={i} className="reward-item">
                    <div className="reward-icon">{reward.icon}</div>
                    <div className="reward-details">
                      <strong>{reward.name}</strong>
                      <div className="reward-date">
                        Débloqué le {new Date(reward.dateUnlocked).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted">Aucune récompense encore</p>
            )}
          </Card.Body>
        </Card>

        <Card>
          <Card.Header className="d-flex align-items-center">
            <FaHistory className="me-2" />
            Historique des Défis
          </Card.Header>
          <Card.Body>
            {user.completedChallenges.length > 0 ? (
              <>
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>Nom du Défi</th>
                      <th>Description</th>
                      <th>Date d'accomplissement</th>
                      <th>Points gagnés</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {challengesToDisplay.map((challenge, index) => (
                      <tr key={index}>
                        <td>{challenge.name}</td>
                        <td>{challenge.description}</td>
                        <td>
                          {new Date(challenge.completionDate).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td>+{challenge.points || 5}</td>
                        <td>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => confirmDeleteChallenge(challenge)}
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {user.completedChallenges.length > 3 && (
                  <div className="text-center mt-3">
                    <Button 
                      variant="link" 
                      onClick={() => setShowAllChallenges(!showAllChallenges)}
                    >
                      {showAllChallenges ? 'Voir moins' : 'Voir plus'}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-center text-muted">Aucun défi complété</p>
            )}
          </Card.Body>
        </Card>
      </Container>

      {/* Modal de confirmation de suppression */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer le défi "{challengeToDelete?.name}" de votre historique ?
          <br />
          <strong>Cette action est irréversible et retirera {challengeToDelete?.points || 5} points.</strong>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={deleteChallenge}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>

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
          <p style={{ color: "#fff", marginTop: "10px" }}>© 2025 GoChallenge. Tous droits réservés.</p>
        </Container>
      </footer>

      <style jsx>{`
        .rewards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
        }
        .reward-item {
          display: flex;
          align-items: center;
          padding: 0.75rem;
          background-color: #f8f9fa;
          border-radius: 0.5rem;
        }
        .reward-icon {
          font-size: 1.5rem;
          margin-right: 1rem;
        }
        .reward-details {
          flex: 1;
        }
        .reward-date {
          font-size: 0.8rem;
          color: #6c757d;
        }
      `}</style>
    </div>
  );
};

export default Profile;