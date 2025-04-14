import React, { useState, useEffect } from "react";
import { 
  Container, Card, Image, Table, Button, Form, Alert, Spinner,
  Navbar, Nav, Modal,Badge,ProgressBar
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

  // Fonction pour calculer le total des points
  const calculatePoints = (challenges) => {
    return challenges.reduce((total, challenge) => total + (challenge.points || 5), 0);
  };

  // Détection de la taille de l'écran
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };
    
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
      const calculatedPoints = calculatePoints(completedChallenges);
      
      setUser({
        name: userData.name || "Utilisateur",
        email: userData.email || "",
        photoURL: userData.photoURL || null,
        points: calculatedPoints, // Utilise toujours les points calculés
        rewards: userData.rewards || [],
        completedChallenges: completedChallenges
      });
    };

    loadUserData();
  }, []);

  // Sauvegarder les données utilisateur
  const saveUserData = (newUserData) => {
    const points = calculatePoints(newUserData.completedChallenges);
    const userToSave = {
      ...newUserData,
      points: points
    };

    localStorage.setItem('userData', JSON.stringify({
      name: userToSave.name,
      email: userToSave.email,
      photoURL: userToSave.photoURL,
      points: userToSave.points,
      rewards: userToSave.rewards
    }));
    
    localStorage.setItem('completedChallenges', JSON.stringify(userToSave.completedChallenges));
    setUser(userToSave);
  };

  // Ajouter un nouveau défi complété
  const addNewChallenge = (challengeName, challengePoints = 10) => {
    const newChallenge = {
      name: challengeName,
      points: challengePoints,
      completionDate: new Date().toISOString()
    };

    const updatedUser = {
      ...user,
      completedChallenges: [...user.completedChallenges, newChallenge]
    };

    saveUserData(updatedUser);
    toast.success(`Défi "${challengeName}" ajouté ! +${challengePoints} points`);
  };

  // Upload d'image de profil
  const handleImageUpload = async () => {
    if (!profileImage) return;
    
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const updatedUser = { ...user, photoURL: e.target.result };
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

  // Supprimer un défi
  const handleDeleteChallenge = () => {
    if (!challengeToDelete) return;
    
    const updatedChallenges = user.completedChallenges.filter(
      c => c.completionDate !== challengeToDelete.completionDate
    );
    
    const updatedUser = {
      ...user,
      completedChallenges: updatedChallenges
    };
    
    saveUserData(updatedUser);
    setShowDeleteModal(false);
    toast.success(`Défi "${challengeToDelete.name}" supprimé`);
    setChallengeToDelete(null);
  };

  // Trier les défis du plus récent au plus ancien
  const sortedChallenges = [...user.completedChallenges].sort((a, b) => 
    new Date(b.completionDate) - new Date(a.completionDate)
  );

  const challengesToDisplay = showAllChallenges 
    ? sortedChallenges 
    : sortedChallenges.slice(0, 3);

  return (
    <div style={{ backgroundColor: "#ff6f61", minHeight: "100vh" }}>
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
                                    {uploading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Envoi en cours...
                    </>
                  ) : 'Enregistrer'}
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
            
            {/* Section Points et Niveau */}
            <div className="mb-4 p-3 bg-light rounded">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h4 className="mb-0">Points: {user.points}</h4>
                <Badge bg="primary" pill>
                  Niveau {Math.floor(user.points / 100) + 1}
                </Badge>
              </div>
              <ProgressBar 
                now={user.points % 100} 
                max={100}
                label={`${user.points % 100}%`}
                visuallyHidden
              />
              <small className="text-muted">
                Prochain niveau dans {100 - (user.points % 100)} points
              </small>
            </div>

            <div className="d-flex justify-content-center gap-3 mb-3">
              <Button 
                variant="primary" 
                className="fw-bold" 
                style={{ minWidth: '150px' }}
                onClick={() => addNewChallenge("Défi rapide", 10)}
              >
                <span className="d-flex align-items-center justify-content-center">
                  <FaTrophy className="me-2" />
                  {user.points} points
                </span>
              </Button>
              <Button 
                variant="danger" 
                onClick={() => {
                  localStorage.removeItem('userData');
                  localStorage.removeItem('completedChallenges');
                  toast.success("Déconnexion réussie");
                  setTimeout(() => window.location.href = "/", 1000);
                }}
                style={{ minWidth: '150px' }}
              >
                <span className="d-flex align-items-center justify-content-center">
                  <FaSignOutAlt className="me-1" /> Déconnexion
                </span>
              </Button>
            </div>

            {/* Section des statistiques */}
            <Card className="mb-3">
              <Card.Body>
                <div className="row text-center">
                  <div className="col-md-4">
                    <h5 className="text-primary">{user.completedChallenges.length}</h5>
                    <small className="text-muted">Défis complétés</small>
                  </div>
                  <div className="col-md-4">
                    <h5 className="text-success">
                      {user.completedChallenges.reduce((acc, curr) => acc + (curr.points || 5), 0)}
                    </h5>
                    <small className="text-muted">Points totaux</small>
                  </div>
                  <div className="col-md-4">
                    <h5 className="text-warning">
                      {user.rewards.length}
                    </h5>
                    <small className="text-muted">Récompenses</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Card.Body>
        </Card>

        {/* Section Récompenses */}
        <Card className="mb-4">
          <Card.Header className="d-flex align-items-center bg-primary text-white">
            <FaTrophy className="me-2" />
            <span>Mes Récompenses</span>
            <Badge bg="light" text="primary" pill className="ms-auto">
              {user.rewards.length}
            </Badge>
          </Card.Header>
          <Card.Body>
            {user.rewards.length > 0 ? (
              <div className="rewards-grid">
                {user.rewards.map((reward, i) => (
                  <Card key={i} className="mb-3 shadow-sm">
                    <Card.Body className="d-flex align-items-center">
                      <div className="me-3 text-warning" style={{ fontSize: '1.5rem' }}>
                        {reward.icon || <FaTrophy />}
                      </div>
                      <div>
                        <Card.Title className="mb-1">{reward.name}</Card.Title>
                        <Card.Text className="text-muted small mb-0">
                          Obtenu le {new Date(reward.date).toLocaleDateString('fr-FR')}
                        </Card.Text>
                        {reward.description && (
                          <Card.Text className="small mt-1">
                            {reward.description}
                          </Card.Text>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <FaTrophy size={48} className="text-muted mb-3" />
                <h5 className="text-muted">Aucune récompense encore</h5>
                <p className="small text-muted">
                  Complétez des défis pour débloquer des récompenses
                </p>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => addNewChallenge("Premier défi", 20)}
                >
                  Commencer un défi
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Section Historique des Défis */}
        <Card className="mb-4">
          <Card.Header className="d-flex align-items-center bg-dark text-white">
            <FaHistory className="me-2" />
            <span>Historique des Défis</span>
            <Badge bg="light" text="dark" pill className="ms-auto">
              {user.completedChallenges.length}
            </Badge>
          </Card.Header>
          <Card.Body>
            {user.completedChallenges.length > 0 ? (
              <>
                <Table striped hover responsive className="mb-0">
                  <thead>
                    <tr>
                      <th>Défi</th>
                      <th>Date</th>
                      <th>Points</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {challengesToDisplay.map((challenge, index) => (
                      <tr key={index}>
                        <td>
                          <div className="fw-bold">{challenge.name}</div>
                          {challenge.description && (
                            <div className="small text-muted">{challenge.description}</div>
                          )}
                        </td>
                        <td>
                          {new Date(challenge.completionDate).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </td>
                        <td>
                          <Badge bg="success" pill>
                            +{challenge.points || 5}
                          </Badge>
                        </td>
                        <td className="text-end">
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => {
                              setChallengeToDelete(challenge);
                              setShowDeleteModal(true);
                            }}
                            title="Supprimer"
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
                      variant="outline-primary"
                      onClick={() => setShowAllChallenges(!showAllChallenges)}
                      size="sm"
                    >
                      {showAllChallenges ? (
                        <>
                          <FaHistory className="me-1" />
                          Voir moins
                        </>
                      ) : (
                        <>
                          <FaHistory className="me-1" />
                          Voir tout l'historique
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <FaHistory size={48} className="text-muted mb-3" />
                <h5 className="text-muted">Aucun défi complété</h5>
                <p className="small text-muted mb-3">
                  Commencez par compléter votre premier défi
                </p>
                <Button
                  variant="primary"
                  onClick={() => addNewChallenge("Défi d'introduction", 15)}
                >
                  <FaTrophy className="me-1" />
                  Commencer un défi
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>

      {/* Modal de confirmation de suppression */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>
            <FaTrash className="me-2" />
            Confirmer la suppression
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Êtes-vous sûr de vouloir supprimer le défi <strong>"{challengeToDelete?.name}"</strong> ?
          </p>
          <Alert variant="warning" className="d-flex align-items-center">
            <FaTrash className="me-2" />
            <div>
              Vous perdrez <strong>{challengeToDelete?.points || 5} points</strong>.
              <div className="small">Cette action est irréversible.</div>
            </div>
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDeleteChallenge}>
            <FaTrash className="me-2" />
            Supprimer définitivement
          </Button>
        </Modal.Footer>
      </Modal>

      <footer style={{ backgroundColor: "#333", padding: "20px", marginTop: "auto" }}>
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
      
      <style jsx global>{`
        .rewards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
        }
        .reward-item {
          transition: all 0.3s ease;
        }
        .reward-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        .progress {
          height: 10px;
        }
        .progress-bar {
          transition: width 0.6s ease;
        }
      `}</style>
    </div>
  );
};

export default Profile;
                 