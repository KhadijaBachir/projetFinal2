import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Container, Row, Col, Card, ProgressBar, Form, InputGroup, 
  Navbar, Nav, FormControl, Button 
} from 'react-bootstrap';
import { 
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin, 
  FaDumbbell, FaCheckCircle, FaTrash, FaPlus, FaSmile  
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import confetti from 'canvas-confetti';
import '../CategoryDetails.css';

const bienetreImagePath = '/bienetre1.jpg';

// Ajoutez ce composant juste ici
const ChallengeIcon = ({ icon, color }) => {
  switch(icon) {
    case "FaSmile":
      return <FaSmile className="challenge-icon" style={{ color }} />;
    case "FaDumbbell":
    default:
      return <FaDumbbell className="challenge-icon" style={{ color }} />;
  }
};

const Bienetre = () => {
  // Configuration des notifications
  const showSuccessToast = (message) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const showErrorToast = (message) => {
    toast.error(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const showInfoToast = (message) => {
    toast.info(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  // ==================== FONCTIONS COULEUR ALÉATOIRE AMÉLIORÉES ====================
  const getRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
  };

  const getUniqueColor = (existingChallenges) => {
    let color;
    do {
      color = getRandomColor();
    } while (existingChallenges.some(c => c.color === color));
    return color;
  };

  // ==================== DÉFIS PAR DÉFAUT ====================
  const generateDefaultChallenges = () => {
    const baseChallenges = [
      {
        id: "jJBBAFqqbIiBsVp1ghow",
        name: "Méditation",
        description: "10 minutes de méditation",
        icon: "FaSmile",
        points: 5
      },
      {
        id: "eC6xwTWDEycvGLfyQt7w",
        name: "Yoga", 
        description: "20 minutes de yoga",
        icon: "FaSmile",
        points: 5
      },
      {
        id: " EUT7aqCDPeFKlAEX0zZU ",
        name: " Méditer 10 minutes par jour",
        description: "Spiritualité",
        icon: "FaSmile",
        points: 5
      },
      {
        id: " W9sIyX31otp7vkVeYh5z ",
        name: " Dormir 8 heures par nuit",
        description: "Pour etre en forme",
        icon: "FaSmile",
        points: 5
      },
      {
        id: " Q3N4QooJrsF1ssremXay ",
        name: " Faire une sortie",
        description: "Pour  prendre l'air",
        icon: "FaSmile",
        points: 5
      },
      {
        id: "Dk58TfMnVbLpE3xHz7ay",
        name: "Prendre un bain ou une douche relaxante",
        description: "Accorde-toi un moment de détente rien qu’à toi",
        icon: "FaSmile",
        points: 5
      }
      
    ];

    return baseChallenges.map((challenge, index, array) => ({
      ...challenge,
      color: getUniqueColor(array.slice(0, index))
    }));
  };

  const defaultChallengesList = generateDefaultChallenges();

  // ==================== STATES ====================
  const [currentBienetreImage, setCurrentBienetreImage] = useState(bienetreImagePath);
  const [userChallenges, setUserChallenges] = useState([]);
  const [progress, setProgress] = useState({});
  const [isCompleted, setIsCompleted] = useState({});
  const [userGoals, setUserGoals] = useState({});
  const [newChallengeName, setNewChallengeName] = useState("");
  const [newChallengeDescription, setNewChallengeDescription] = useState("");
  const [userPoints, setUserPoints] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // ==================== EFFETS ====================
  useEffect(() => {
    const checkScreenSize = () => setIsSmallScreen(window.innerWidth <= 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const loadUserData = () => {
      const challenges = JSON.parse(localStorage.getItem('userChallenges')) || [];
      setUserChallenges(challenges.filter(challenge => challenge.category === "bienetre"));
      
      const state = JSON.parse(localStorage.getItem('challengesState')) || {};
      const progressState = {};
      const completedState = {};
      const goalsState = {};

      [...defaultChallengesList, ...challenges].forEach(challenge => {
        if (state[challenge.id]) {
          progressState[challenge.id] = state[challenge.id].progress || 0;
          completedState[challenge.id] = state[challenge.id].isCompleted || false;
          goalsState[challenge.id] = state[challenge.id].userGoals || "";
        }
      });

      setProgress(progressState);
      setIsCompleted(completedState);
      setUserGoals(goalsState);
      setUserPoints((JSON.parse(localStorage.getItem('userData')) || { points: 0 }).points);
    };

    loadUserData();
  }, []);

  // ==================== FONCTIONS UTILITAIRES ====================
  const handleImageError = () => {
    setCurrentBienetreImage('/default-banner.jpg');
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
    });
  };

  // ==================== GESTION LOCALSTORAGE ====================
  const saveChallengeState = (challengeId, state) => {
    const challengesState = JSON.parse(localStorage.getItem('challengesState')) || {};
    challengesState[challengeId] = state;
    localStorage.setItem('challengesState', JSON.stringify(challengesState));
  };

  const addUserChallengeToStorage = (name, description) => {
    const challenges = JSON.parse(localStorage.getItem('userChallenges')) || [];
    const newChallenge = {
      id: `uc${Date.now()}`,
      name,
      description,
      category: "bienetre",
      color: getUniqueColor([...defaultChallengesList, ...challenges]),
      icon: "FaDumbbell",
      points: 5,
      createdAt: new Date().toISOString()
    };
    const updatedChallenges = [...challenges, newChallenge];
    localStorage.setItem('userChallenges', JSON.stringify(updatedChallenges));
    return newChallenge;
  };

  const deleteUserChallengeFromStorage = (id) => {
    const challenges = JSON.parse(localStorage.getItem('userChallenges')) || [];
    const updated = challenges.filter(c => c.id !== id);
    localStorage.setItem('userChallenges', JSON.stringify(updated));
    
    const challengesState = JSON.parse(localStorage.getItem('challengesState')) || {};
    delete challengesState[id];
    localStorage.setItem('challengesState', JSON.stringify(challengesState));
  };

  const updateUserPoints = (pointsToAdd) => {
    const userData = JSON.parse(localStorage.getItem('userData')) || { points: 0 };
    const newPoints = (userData.points || 0) + pointsToAdd;
    localStorage.setItem('userData', JSON.stringify({ ...userData, points: newPoints }));
    return newPoints;
  };

  // ==================== GESTION DES DÉFIS ====================
  const handleCheckboxChange = (challengeId) => {
    const newIsCompleted = { ...isCompleted, [challengeId]: !isCompleted[challengeId] };
    const newProgress = { ...progress };
    
    if (newIsCompleted[challengeId]) {
      newProgress[challengeId] = 100;
      const pointsEarned = updateUserPoints(5);
      
      const challenge = [...defaultChallengesList, ...userChallenges].find(c => c.id === challengeId);
      if (challenge) {
        const completedChallenge = {
          id: challengeId,
          name: challenge.name,
          description: challenge.description || userGoals[challengeId] || "Aucune description",
          completionDate: new Date().toISOString(),
          points: 5,
          category: "bienetre"
        };
        
        const completedChallenges = JSON.parse(localStorage.getItem('completedChallenges')) || [];
        localStorage.setItem('completedChallenges', JSON.stringify([...completedChallenges, completedChallenge]));
      }
      
      triggerConfetti();
      showSuccessToast(`Félicitations ! Défi accompli. +5 points (Total: ${pointsEarned})`);
    } else {
      newProgress[challengeId] = 0;
    }

    setIsCompleted(newIsCompleted);
    setProgress(newProgress);
    setUserPoints(updateUserPoints(0));
    
    saveChallengeState(challengeId, {
      progress: newProgress[challengeId],
      isCompleted: newIsCompleted[challengeId],
      userGoals: userGoals[challengeId] || "",
      lastUpdated: new Date().toISOString()
    });
  };

  const handleGoalChange = (challengeId, goal) => {
    const newGoals = { ...userGoals, [challengeId]: goal };
    setUserGoals(newGoals);
    saveChallengeState(challengeId, {
      progress: progress[challengeId] || 0,
      isCompleted: isCompleted[challengeId] || false,
      userGoals: goal,
      lastUpdated: new Date().toISOString()
    });
  };

  const handleAddChallenge = () => {
    if (!newChallengeName.trim()) {
      showErrorToast("Veuillez saisir un nom pour le défi");
      return;
    }

    const newChallenge = addUserChallengeToStorage(newChallengeName, newChallengeDescription);
    setUserChallenges(prev => [...prev, newChallenge]);
    setNewChallengeName("");
    setNewChallengeDescription("");
    
    triggerConfetti();
    showSuccessToast("Défi bien-être créé avec succès !");
  };

  const handleDeleteChallenge = (id) => {
    deleteUserChallengeFromStorage(id);
    setUserChallenges(prev => prev.filter(c => c.id !== id));
    showInfoToast("Défi bien-être supprimé");
  };

  // ==================== RENDU ====================
  return (
    <div style={{ backgroundColor: "#ff6f61", minHeight: "100vh", overflowX: "hidden" }}>
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
      <Container>
        {/* Image de bannière */}
        <div style={{ 
          width: "100%", 
          height: isSmallScreen ? "300px" : "450px", 
          margin: "20px 0",
          borderRadius: "15px",
          overflow: "hidden",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
        }}>
          <img
            src={currentBienetreImage}
            onError={handleImageError}
            alt="Bannière Bien-être"
            style={{ 
              width: "100%", 
              height: "100%", 
              objectFit: "cover",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          />
        </div>

        <h1 className="text-center mb-4" style={{ 
          color: "#ffffff", 
          fontWeight: "bold", 
          fontSize: isSmallScreen ? "2rem" : "2.5rem",
          textShadow: "2px 2px 4px rgba(0,0,0,0.5)"
        }}>
          Défis Bien-être
        </h1>

        {/* Défis par défaut */}
        <h2 className="section-title">Défis Recommandés</h2>
        <Row>
          {defaultChallengesList.map((challenge) => (
            <Col md={4} key={challenge.id} className="mb-4">
              <Card 
                className="h-100 challenge-card" 
                style={{ 
                  border: `3px solid ${challenge.color}`,
                  boxShadow: `0 4px 8px ${challenge.color}33`
                }}
              >
                <Card.Body className="text-center">
                  <FaSmile className="challenge-icon" style={{ color: challenge.color }} />
                  <h3 className="card-title">{challenge.name}</h3>
                  <p className="card-description">{challenge.description}</p>
                  
                  <InputGroup className="mb-3">
                    <FormControl 
                      placeholder="Fixez votre objectif" 
                      value={userGoals[challenge.id] || ""} 
                      onChange={(e) => handleGoalChange(challenge.id, e.target.value)}
                    />
                  </InputGroup>
                  
                  <ProgressBar 
                    now={progress[challenge.id] || 0} 
                    label={`${progress[challenge.id] || 0}%`}
                    animated
                  />
                  
                  <Form.Check 
                    type="checkbox" 
                    label="Défi accompli" 
                    checked={isCompleted[challenge.id] || false} 
                    onChange={() => handleCheckboxChange(challenge.id)} 
                    className="my-3"
                  />
                  
                  <Button 
                    className="reset-button" 
                    style={{ 
                      backgroundColor: challenge.color,
                      borderColor: challenge.color
                    }} 
                    onClick={() => {
                      setProgress({...progress, [challenge.id]: 0});
                      setIsCompleted({...isCompleted, [challenge.id]: false});
                    }}
                  >
                    Recommencer
                  </Button>
                  
                  {isCompleted[challenge.id] && (
                    <div className="completed-message" style={{ color: challenge.color }}>
                      <FaCheckCircle /> Félicitations !
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Défis utilisateur */}
        <h2 className="section-title">Mes Défis Bien-être</h2>
        <Row>
          {userChallenges.map((challenge) => (
            <Col md={4} key={challenge.id} className="mb-4">
              <Card 
                className="h-100 challenge-card" 
                style={{ 
                  border: `3px solid ${challenge.color}`,
                  boxShadow: `0 4px 8px ${challenge.color}33`
                }}
              >
                <Card.Body className="text-center">
                  <FaSmile className="challenge-icon" style={{ color: challenge.color }} />
                  <h3 className="card-title">{challenge.name}</h3>
                  <p className="card-description">{challenge.description}</p>
                  
                  <InputGroup className="mb-3">
                    <FormControl 
                      placeholder="Fixez votre objectif" 
                      value={userGoals[challenge.id] || ""} 
                      onChange={(e) => handleGoalChange(challenge.id, e.target.value)}
                    />
                  </InputGroup>
                  
                  <ProgressBar 
                    now={progress[challenge.id] || 0} 
                    label={`${progress[challenge.id] || 0}%`}
                    animated
                  />
                  
                  <div className="checkbox-container">
                    <Form.Check 
                      type="checkbox"
                      label="Défi accompli"
                      checked={isCompleted[challenge.id] || false}
                      onChange={() => handleCheckboxChange(challenge.id)}
                    />
                  </div>
                  
                  <div className="button-container">
                    <Button 
                      className="reset-button" 
                      style={{ 
                        backgroundColor: challenge.color,
                        borderColor: challenge.color
                      }} 
                      onClick={() => {
                        setProgress({...progress, [challenge.id]: 0});
                        setIsCompleted({...isCompleted, [challenge.id]: false});
                      }}
                    >
                      Recommencer
                    </Button>
                    <FaTrash 
                      className="delete-icon" 
                      onClick={() => handleDeleteChallenge(challenge.id)} 
                      style={{ 
                        color: challenge.color,
                        cursor: "pointer", 
                        marginLeft: "10px" 
                      }} 
                    />
                  </div>
                  
                  {isCompleted[challenge.id] && (
                    <div className="completed-message" style={{ color: challenge.color }}>
                      <FaCheckCircle /> Félicitations ! Vous avez accompli ce défi.
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Formulaire d'ajout */}
        <Row className="mt-5">
          <Col md={6} className="mx-auto">
            <Card className="form-card">
              <Card.Body>
                <h3 className="text-center">Ajouter un défi bien-être</h3>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Control 
                      type="text" 
                      placeholder="Nom du défi" 
                      value={newChallengeName} 
                      onChange={(e) => setNewChallengeName(e.target.value)} 
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Control 
                      as="textarea" 
                      rows={3} 
                      placeholder="Description du défi" 
                      value={newChallengeDescription} 
                      onChange={(e) => setNewChallengeDescription(e.target.value)} 
                    />
                  </Form.Group>
                  <Button 
                    variant="primary" 
                    onClick={handleAddChallenge} 
                    className="w-100 submit-btn"
                  >
                    <FaPlus /> Ajouter un défi
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
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

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default Bienetre;