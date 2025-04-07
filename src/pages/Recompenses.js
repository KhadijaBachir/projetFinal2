import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Badge, 
  ProgressBar, 
  Alert, 
  Tab, 
  Tabs,
  Navbar,
  Nav
} from 'react-bootstrap';
import { 
  FaTrophy, 
  FaLock, 
  FaLockOpen, 
  FaStar, 
  FaCrown, 
  FaCalendarAlt, 
  FaSnowflake, 
  FaSun, 
  FaLeaf, 
  FaBirthdayCake,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Confetti from 'react-confetti';
import './Recompenses.css';

// Configuration complète des récompenses
const REWARD_CONFIG = {
  levelRewards: [
    {
      level: 1,
      pointsRequired: 50,
      rewards: [
        { id: 'badge-1', name: 'Débutant Motivé', type: 'badge', icon: '🥉' },
        { id: 'trophy-1', name: 'Coupe en Bronze', type: 'trophy', icon: '🏆' },
        { id: "time-1", name: "Early Bird", type: "time", icon: "🐦" },
        { id: "custom-1", name: "Profil Coloré", type: "customization", icon: "🎨" },
      ]
    },
    {
      level: 2,
      pointsRequired: 100,
      rewards: [
        { id: "badge-2", name: "Productivité Confirmée", type: "badge", icon: "🥈" },
        { id: "habit-1", name: "Tâche Express", type: "habit", icon: "⚡" },
        { id: "custom-2", name: "Arrière-plan Animé", type: "customization", icon: "✨" },
        { id: "title-1", name: "Gourou des Tâches", type: "title", icon: "🧠" } 
      ]
    },
    {
      level: 3,
      pointsRequired: 200,
      rewards: [
        { id: "badge-3", name: "Maître de l'Organisation", type: "badge", icon: "🥇" },
        { id: "habit-2", name: "Streak Master", type: "habit", icon: "🔥" },
        { id: "fun-1", name: "Stickers Exclusifs", type: "fun", icon: "🖼️" },
        { id: "title-2", name: "Super Héros de la Productivité", type: "title", icon: "🦸" },
      ]
    },
    {
      level: 4,
      pointsRequired: 300,
      rewards: [
        { id: "badge-4", name: "Légende des To-Do Lists", type: "badge", icon: "🌟" },
        { id: "fun-2", name: "Mini-Jeu Débloqué", type: "fun", icon: "🎮" },
        { id: "fun-3", name: "Playlist Motivante", type: "fun", icon: "🎧" },
        { id: "title-3", name: "Maître Zen de l'Organisation", type: "title", icon: "🧘" },
      ],
      
    },
    {
      level: 5,
      pointsRequired: 500,
      rewards: [
        { id: "trophy-2", name: "Coupe en Or", type: "trophy", icon: "🏅" },
        { id: "custom-3", name: "Thème Arc-en-Ciel", type: "customization", icon: "🌈" },
        { id: "community-1", name: "Défi Créé à ton Nom", type: "community", icon: "📜" },
        { id: "secret-1", name: "Récompense Secrète", type: "secret", icon: "🎁" },
      ]
    },
    {
      level: 6,
      pointsRequired: 700,
      rewards: [
        { id: "badge-6", name: "Expert Productif", type: "badge", icon: "🏅" },
        { id: "custom-6", name: "Thème Diamant", type: "customization", icon: "💎" },
        { id: "special-2", name: "VIP", type: "exclusivité", icon: "🌟", unlockCondition: "admin" },
        { id: "special-3", name: "Surprise", type: "mystère", icon: "🎁", unlockCondition: "random" }
      ]
    },
    {
      level: 7,
      pointsRequired: 900,
      rewards: [
        { id: "trophy-7", name: "Coupe Platine", type: "trophy", icon: "🏆" },
        { id: "fun-7", name: "Mini-jeu Premium", type: "fun", icon: "🎮" },
        { id: "fun-game", name: "Chasseur de Tâches", type: "game", icon: "👾", unlockCondition: "weeklyTaskMaster" },
        { id: "fun-avatar", name: "Super Productif", type: "avatar", icon: "🦸", level: 5, evolution: true }
      ]
    },
    {
      level: 8,
      pointsRequired: 1000,
      rewards: [
        { id: "badge-8", name: "Légende Vivante", type: "badge", icon: "🦄" },
        { id: "secret-8", name: "Récompense Ultime", type: "secret", icon: "🔮" },
        { id: "fun-sound", name: "Maître des Fanfares", type: "audio", icon: "🎺", unlockCondition: "fiveRewards" },
        { id: "fun-anim", name: "Maître des Festivités", type: "fun", icon: "🎉", effect: "completionAnimations" }
      ]
    }
  ],
  weeklyChallenges: [
    { id: "weekly-1", name: "7 jours de productivité", type: "habitude", icon: <FaCalendarAlt />, pointsRequired: 7 }
  ],
  seasonalRewards: [
    { id: 'seasonal-1', name: 'Explorateur d\'Hiver', type: 'hiver', icon: <FaSnowflake />, season: 'winter' },
    { id: "seasonal-2", name: "Renouveau Printanier", type: "printemps", icon: "🌸", season: "spring" },
    { id: "seasonal-3", name: "Été Productif", type: "été", icon: <FaSun />, season: "summer" },
    { id: "seasonal-4", name: "Récolte Automnale", type: "automne", icon: <FaLeaf />, season: "autumn" }
  ],
  specialRewards: [
    { id: 'special-1', name: 'Anniversaire', type: 'événement', icon: <FaBirthdayCake />, unlockCondition: 'date' },
    { id: "special-2", name: "VIP", type: "exclusivité", icon: "🌟", unlockCondition: "admin" }
  ],
  motivationalMessages: [
    "Bravo ! Chaque défi te rapproche de ton objectif ! 🚀",
    "Tu es incroyable ! Continue sur cette lancée ! 💪",
    "Un pas de plus vers la victoire ! 🎯",
    "Les légendes ne s'arrêtent jamais ! 🏆",
    "Ta persévérance est exemplaire ! 🔥",
    "Chaque défi accompli est une victoire sur toi-même ! 👏",
    "Ne lâche rien, tu es sur la bonne voie ! 🌟",
    "La réussite est au bout du chemin, continue ! 🏅",
  ]
};

const Recompenses = () => {
  const [state, setState] = useState({
    points: 0,
    rewards: [],
    unlockedLevels: [],
    unlockedWeekly: [],
    unlockedSeasonal: [],
    unlockedSpecial: [],
    currentStreak: 0
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [randomMessage, setRandomMessage] = useState('');
  const [newlyUnlocked, setNewlyUnlocked] = useState([]);
  const [activeTab, setActiveTab] = useState('niveaux');
  const [isLoading, setIsLoading] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Fonction pour détecter la taille de l'écran
  const checkScreenSize = () => {
    setIsSmallScreen(window.innerWidth <= 768);
  };

  useEffect(() => {
    const loadData = () => {
      try {
        const savedData = JSON.parse(localStorage.getItem('userData') || '{}');
        const completeData = { ...state, ...savedData };
        
        completeData.rewards = Array.isArray(completeData.rewards) ? completeData.rewards : [];
        completeData.unlockedLevels = Array.isArray(completeData.unlockedLevels) ? completeData.unlockedLevels : [];
        completeData.unlockedWeekly = Array.isArray(completeData.unlockedWeekly) ? completeData.unlockedWeekly : [];
        completeData.unlockedSeasonal = Array.isArray(completeData.unlockedSeasonal) ? completeData.unlockedSeasonal : [];
        completeData.unlockedSpecial = Array.isArray(completeData.unlockedSpecial) ? completeData.unlockedSpecial : [];

        setState(completeData);
        checkForNewRewards(completeData);
      } catch (error) {
        console.error("Erreur de chargement:", error);
        toast.error("Erreur lors du chargement des données");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    
    setRandomMessage(REWARD_CONFIG.motivationalMessages[
      Math.floor(Math.random() * REWARD_CONFIG.motivationalMessages.length)
    ]);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const saveData = (newData) => {
    try {
      localStorage.setItem('userData', JSON.stringify(newData));
      setState(newData);
    } catch (error) {
      console.error("Erreur de sauvegarde:", error);
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  const checkForNewRewards = (currentData) => {
    const newRewards = [];
    const updatedData = { ...currentData };
    
    updatedData.unlockedLevels = [];
    updatedData.rewards = updatedData.rewards.filter(r => !r.level);

    REWARD_CONFIG.levelRewards
      .sort((a, b) => a.level - b.level)
      .forEach(level => {
        const hasPoints = updatedData.points >= level.pointsRequired;
        const previousUnlocked = level.level === 1 || 
          updatedData.unlockedLevels.includes(level.level - 1);

        if (hasPoints && previousUnlocked) {
          updatedData.unlockedLevels.push(level.level);
          
          level.rewards.forEach(reward => {
            if (!updatedData.rewards.some(r => r.id === reward.id)) {
              const newReward = {
                ...reward,
                dateUnlocked: new Date().toISOString(),
                level: level.level
              };
              updatedData.rewards.push(newReward);
              newRewards.push(newReward);
            }
          });
        }
      });

    if (newRewards.length > 0 || JSON.stringify(updatedData.unlockedLevels) !== JSON.stringify(currentData.unlockedLevels)) {
      saveData(updatedData);
      if (newRewards.length > 0) {
        setNewlyUnlocked(newRewards);
        triggerConfetti();
        newRewards.forEach(reward => {
          showRewardNotification(reward);
        });
      }
    }
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const showRewardNotification = (reward) => {
    toast.success(`Récompense débloquée: ${reward.name} !`, {
      position: 'top-right',
      autoClose: 4000
    });
  };

  const unlockReward = (reward, type) => {
    try {
      if (!reward || !reward.id) {
        toast.error("Récompense invalide");
        return;
      }

      if (state.rewards.some(r => r.id === reward.id)) {
        toast.info('Vous avez déjà cette récompense !');
        return;
      }

      const updatedData = { ...state };
      const newReward = {
        ...reward,
        dateUnlocked: new Date().toISOString(),
        rewardType: type
      };

      updatedData.rewards.push(newReward);
      
      switch (type) {
        case 'level':
          if (reward.level && !updatedData.unlockedLevels.includes(reward.level)) {
            updatedData.unlockedLevels.push(reward.level);
          }
          break;
        case 'weekly':
          if (!updatedData.unlockedWeekly.includes(reward.id)) {
            updatedData.unlockedWeekly.push(reward.id);
          }
          break;
        case 'seasonal':
          if (!updatedData.unlockedSeasonal.includes(reward.id)) {
            updatedData.unlockedSeasonal.push(reward.id);
          }
          break;
        case 'special':
          if (!updatedData.unlockedSpecial.includes(reward.id)) {
            updatedData.unlockedSpecial.push(reward.id);
          }
          break;
        default:
          console.warn("Type de récompense inconnu:", type);
      }

      saveData(updatedData);
      triggerConfetti();
      showRewardNotification(newReward);
      setNewlyUnlocked(prev => [...prev, newReward]);
    } catch (error) {
      console.error("Erreur lors du déblocage:", error);
      toast.error('Erreur lors du déblocage');
    }
  };

  const getCurrentLevel = () => {
    if (!REWARD_CONFIG.levelRewards) return 0;
    
    const sortedLevels = [...REWARD_CONFIG.levelRewards].sort((a, b) => a.level - b.level);
    let currentLevel = 0;
    
    for (const level of sortedLevels) {
      if (state.points >= level.pointsRequired && 
          (level.level === 1 || state.unlockedLevels.includes(level.level - 1))) {
        currentLevel = level.level;
      } else {
        break;
      }
    }
    
    return currentLevel;
  };

  const getProgressToNextLevel = () => {
    try {
      const currentLevel = getCurrentLevel();
      
      if (!REWARD_CONFIG.levelRewards?.length) return 0;
      if (currentLevel >= REWARD_CONFIG.levelRewards.length) return 100;

      if (currentLevel === 0) {
        const firstLevel = REWARD_CONFIG.levelRewards[0];
        if (!firstLevel?.pointsRequired) return 0;
        return Math.min(100, (state.points / firstLevel.pointsRequired) * 100);
      }

      const currentLevelData = REWARD_CONFIG.levelRewards[currentLevel - 1];
      const nextLevelData = REWARD_CONFIG.levelRewards[currentLevel];

      if (!currentLevelData?.pointsRequired || !nextLevelData?.pointsRequired) return 0;

      const progress = ((state.points - currentLevelData.pointsRequired) / 
                      (nextLevelData.pointsRequired - currentLevelData.pointsRequired)) * 100;
      return Math.min(100, Math.max(0, progress));
    } catch (error) {
      console.error("Erreur dans getProgressToNextLevel:", error);
      return 0;
    }
  };

  const RewardCard = ({ reward, type, pointsRequired, currentPoints }) => {
    if (!reward) return null;

    const isUnlocked = state.rewards.some(r => r.id === reward.id) || 
                      (type === 'level' && currentPoints >= pointsRequired && 
                       (reward.level === 1 || state.unlockedLevels.includes(reward.level - 1)));

    return (
      <Col md={3} className="mb-3">
        <Card 
          className={`reward-item-card ${isUnlocked ? 'unlocked' : ''}`}
          data-type={reward.type}
        >
          <Card.Body className="text-center">
            <div className="reward-icon mb-2">
              {typeof reward.icon === 'string' ? reward.icon : reward.icon}
            </div>
            <h5>{reward.name}</h5>
            <p className="reward-type">{reward.type}</p>
            
            {!isUnlocked && type === 'level' && (
              <div className="unlock-info">
                Débloque à {pointsRequired} points
                {reward.level > 1 && ` (Niveau ${reward.level - 1} requis)`}
              </div>
            )}
            
            {isUnlocked ? (
              <Badge bg="success" className="w-100">
                <FaLockOpen className="me-1" /> Débloqué
              </Badge>
            ) : (
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={() => unlockReward(reward, type)}
                className="w-100"
                disabled={type === 'level' && (currentPoints < pointsRequired || 
                         (reward.level > 1 && !state.unlockedLevels.includes(reward.level - 1)))}
              >
                <FaLock className="me-1" /> 
                {type === 'level' ? 'Débloque automatique' : 'Débloquer'}
              </Button>
            )}
          </Card.Body>
        </Card>
      </Col>
    );
  };

  if (isLoading) {
    return <div className="text-center mt-5">Chargement en cours...</div>;
  }

  return (
    <>
    {/* Navbar */}
         <Navbar expand="lg" className="shadow-sm" style={{ backgroundColor: "#ff8c7f", padding: "10px 0" }}>
           <Container>
             {/* Logo à gauche avec animation */}
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
   
             {/* Titre à droite */}
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
                   { name: "Profil", path: "/profile" }, // Lien vers Profile.js
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
         <div className="cup-image-container" style={{ 
  width: '100%', 
  height: '600px',
  overflow: 'hidden'
}}>
  <img 
    src="/cup.avif" 
    alt="Coupe de récompenses" 
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center'
    }}
  />
</div>

      {/* Contenu principal */}
      <Container className="recompenses-container">
        {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
        <ToastContainer />

        <Card className="header-card">
          <Card.Body>
            <h2>Vos Récompenses</h2>
            <div className="display-4 text-primary">{state.points} points</div>
            
            <div className="mt-3">
              <Badge bg="info" className="current-level-badge">
                Niveau {getCurrentLevel()}
              </Badge>
              
              {getCurrentLevel() < REWARD_CONFIG.levelRewards?.length && (
                <div className="level-progress-container">
                  <div className="mb-1">
                    Prochain niveau: {REWARD_CONFIG.levelRewards[getCurrentLevel()]?.pointsRequired || 0} points
                  </div>
                  <ProgressBar 
                    now={getProgressToNextLevel()} 
                    label={`${Math.round(getProgressToNextLevel())}%`} 
                    className="level-progress-bar"
                  />
                </div>
              )}
            </div>

            {randomMessage && (
              <div className="motivational-message">"{randomMessage}"</div>
            )}
          </Card.Body>
        </Card>

        {newlyUnlocked.length > 0 && (
          <Alert variant="success" className="new-rewards-alert">
            <h4>Nouvelles récompenses !</h4>
            <ul>
              {newlyUnlocked.map(reward => (
                <li key={reward.id}>{reward.name}</li>
              ))}
            </ul>
          </Alert>
        )}

        <Tabs 
          activeKey={activeTab} 
          onSelect={setActiveTab} 
          className="reward-tabs"
        >
          <Tab eventKey="niveaux" title="Par Niveaux">
            <Card className="reward-category-card mt-3">
              <Card.Body>
                {REWARD_CONFIG.levelRewards?.map(level => (
                  <div key={level.level} className="mb-4">
                    <div className="level-header">
                      <h4 className="level-title">
                        Niveau {level.level} - {level.pointsRequired} points
                        {state.unlockedLevels.includes(level.level) && (
                          <Badge bg="success" className="ms-2">Débloqué</Badge>
                        )}
                      </h4>
                      <div className="level-progress-indicator">
                        <span className="me-2">
                          {state.points >= level.pointsRequired && 
                           (level.level === 1 || state.unlockedLevels.includes(level.level - 1)) ? '✅' : '🔒'}
                        </span>
                        <ProgressBar 
                          now={Math.min(100, (state.points / level.pointsRequired) * 100)} 
                          className="level-progress"
                        />
                      </div>
                    </div>
                    <Row>
                      {level.rewards?.map(reward => (
                        <RewardCard 
                          key={reward.id} 
                          reward={reward} 
                          type="level"
                          pointsRequired={level.pointsRequired}
                          currentPoints={state.points}
                        />
                      ))}
                    </Row>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="hebdomadaires" title="Hebdomadaires">
            <Card className="reward-category-card mt-3">
              <Card.Body>
                <Row>
                  {REWARD_CONFIG.weeklyChallenges?.map(reward => (
                    <RewardCard 
                      key={reward.id} 
                      reward={reward} 
                      type="weekly"
                      currentPoints={state.currentStreak}
                    />
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="saisonnières" title="Saisonnières">
            <Card className="reward-category-card mt-3">
              <Card.Body>
                <Row>
                  {REWARD_CONFIG.seasonalRewards?.map(reward => (
                    <RewardCard 
                      key={reward.id} 
                      reward={reward} 
                      type="seasonal"
                    />
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="spéciales" title="Spéciales">
            <Card className="reward-category-card mt-3">
              <Card.Body>
                <Row>
                  {REWARD_CONFIG.specialRewards?.map(reward => (
                    <RewardCard 
                      key={reward.id} 
                      reward={reward} 
                      type="special"
                    />
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>

        <Button 
          variant="warning" 
          onClick={() => setState(prev => ({ ...prev, points: 1000 }))}
          className="test-button"
        >
          TEST: Définir 1000 points
        </Button>
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
              <p style={{ color: "#fff", marginTop: "10px" }}>© 2025 GoChallenge. Tous droits réservés.</p>
            </Container>
          </footer>
    </>
  );
};

export default Recompenses;