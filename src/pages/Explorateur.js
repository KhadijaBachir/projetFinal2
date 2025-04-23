import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCheck, FaLock, FaUnlock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import confetti from 'canvas-confetti';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

// Défis et récompenses
const CHALLENGES = {
  DefiDuJour: [
    { text: "Bois 1L d'eau avant midi", emoji: "💧" },
    { text: "Supprime ou classe 10 emails inutiles", emoji: "📩" },
    { text: "Écris 3 choses que tu as bien faites aujourd'hui", emoji: "💪" },
    { text: "Jette ou donne 1 objet inutile chez toi", emoji: "🗑" },
    { text: "Souris à 5 inconnus dans la journée", emoji: "😊" },
    { text: "Écris un message gentil à un proche", emoji: "💌" },
    { text: "Prends un moment pour t'étirer 5 minutes", emoji: "🧘" },
    { text: "Essaie une nouvelle recette ou un aliment différent", emoji: "🍽️" },
    { text: "Marche pieds nus pendant 10 minutes", emoji: "🌿" },
    { text: "Écoute une audio de motivation que tu n'as jamais entendue", emoji: "🎵" }
  ],
  DefiSurprise: [
    { text: "Écris une pensée négative, puis déchire le papier", emoji: "🧠" },
    { text: "Pose ton téléphone et ne l'utilise pas pendant 1 heure", emoji: "📵" },
    { text: "Fais une sieste de 10 minutes", emoji: "😴" },
    { text: "Fais 15 squats et 10 pompes en 2 minutes", emoji: "⚡" },
    { text: "Dessine un autoportrait en 1 minute", emoji: "🎨" },
    { text: "Essaye d'écrire avec ta main non dominante", emoji: "✍️" },
    { text: "Fais un compliment sincère à quelqu'un aujourd'hui", emoji: "😊" },
    { text: "Essaye une posture de yoga que tu ne connais pas", emoji: "🕉️" },
    { text: "Regarde un coucher de soleil sans distractions", emoji: "🌅" },
    { text: "Apprends une phrase dans une nouvelle langue", emoji: "🗣️" }
  ],
  RouletteDesDefis: [
    { text: "Ferme les yeux et respire profondément pendant 2 minutes", emoji: "🧘‍♂️" },
    { text: "Range une zone de ta maison en moins de 5 minutes", emoji: "📋" },
    { text: "Apprends un mot dans une langue étrangère", emoji: "📚" },
    { text: "Marche 500 pas sans t'arrêter", emoji: "👣" },
    { text: "Tiens-toi droit, mains sur les hanches, pendant 2 minutes", emoji: "🦸‍♂️" },
    { text: "Médite 5 minutes en te concentrant sur ta respiration", emoji: "🌬️" },
    { text: "Déconnecte-toi des réseaux sociaux pendant 3 heures", emoji: "📵" },
    { text: "Fais une liste de 3 choses que tu aimerais accomplir cette semaine", emoji: "📝" },
    { text: "Fais un câlin (à quelqu'un ou à un coussin si besoin)", emoji: "🤗" },
    { text: "Essaye de marcher lentement et d'observer ton environnement", emoji: "🏞️" }
  ],
  DefiItem: [
    { text: "Note 3 choses cool qui se sont passées aujourd'hui", emoji: "📖" },
    { text: "Écris une note motivante et colle-la à un endroit visible", emoji: "📌" },
    { text: "Supprime une appli inutile de ton téléphone", emoji: "📱" },
    { text: "Lis au moins une page d'un livre inspirant", emoji: "📕" },
    { text: "Mange un repas entier avec une cuillère", emoji: "🥄" },
    { text: "Note 3 qualités que tu aimes chez toi", emoji: "❤️" },
    { text: "Change ton fond d'écran pour quelque chose de motivant", emoji: "📱" },
    { text: "Ajoute un rappel positif sur ton téléphone", emoji: "⏳" },
    { text: "Essaye un exercice de respiration profonde", emoji: "🫁" },
    { text: "Mange quelque chose que tu n'as pas goûté depuis longtemps", emoji: "🍏" }
  ]
};

const MOTIVATION = {
  phrases: [
    "Tu es capable de grandes choses, continue comme ça ! 🚀",
    "Chaque petit pas te rapproche de ton objectif. 💪",
    "Rappelle-toi, l'effort d'aujourd'hui est la réussite de demain. 🌟",
    "Le seul défi à relever, c'est toi-même. 💯",
    "Il n'y a pas de limite, juste des opportunités. 🎯",
    "Même un petit pas est un progrès 🚶‍♂️",
    "Tu es plus fort(e) que tu ne le penses 💪",
    "L'échec est juste une étape vers la réussite 🔄",
    "Ton futur moi te remerciera pour tes efforts d'aujourd'hui 🙌",
    "Rappelle-toi pourquoi tu as commencé 🌟"
  ],
  videos: [
    "https://www.youtube.com/embed/DIxjewEpjYU",
    "https://www.youtube.com/embed/gcRXpPSOSeI",
    "https://www.youtube.com/embed/oXcxDoab4ro",
    "https://www.youtube.com/embed/KRbCdd8eGow",
    "https://www.youtube.com/embed/D6qTPTj9g3I",
    "https://www.youtube.com/embed/qZcdiUqJjKw",
    "https://www.youtube.com/embed/loZ6PTeqcHM",
    "https://www.youtube.com/embed/0UpjBtfiet4",
    "https://www.youtube.com/embed/RzakMIZJ0YI",
    "https://www.youtube.com/embed/kkbSY_1JuP8"
  ]
};

const CARD_COLORS = [
  { bg: '#6f42c1', text: '#FFFFFF' },
  { bg: '#4ECDC4', text: '#000000' },
  { bg: '#45B7D1', text: '#FFFFFF' },
  { bg: '#FFBE0B', text: '#000000' },
  { bg: '#8338EC', text: '#FFFFFF' }
];

const Explorateur = () => {
  const [dailyChallenges, setDailyChallenges] = useState({});
  const [completed, setCompleted] = useState([]);
  const [dailyProgress, setDailyProgress] = useState({ date: "", count: 0 });
  const [unlockedRewards, setUnlockedRewards] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [flippedCards, setFlippedCards] = useState({});
  const [showReward, setShowReward] = useState(false);
  const [currentChallenges, setCurrentChallenges] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [usedVideos, setUsedVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState("");
  const [videoKey, setVideoKey] = useState(0);
  const iframeRef = useRef(null);

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const getRandomMotivationPhrase = () => {
    return MOTIVATION.phrases[Math.floor(Math.random() * MOTIVATION.phrases.length)];
  };

  const isNewDay = (lastUpdated) => {
    if (!lastUpdated) return true;
    const now = new Date();
    const lastUpdateDate = new Date(lastUpdated);
    return (
      now.getDate() !== lastUpdateDate.getDate() ||
      now.getMonth() !== lastUpdateDate.getMonth() ||
      now.getFullYear() !== lastUpdateDate.getFullYear()
    );
  };

  const getRandomChallenge = (category) => {
    const challenges = CHALLENGES[category];
    return challenges[Math.floor(Math.random() * challenges.length)];
  };

  const saveToLocalStorage = (challenges, completed, updateDate, reward, usedVids, video) => {
    const data = {
      currentChallenges: challenges,
      completedChallenges: completed,
      lastUpdate: updateDate,
      showReward: reward,
      usedVideos: usedVids,
      currentVideo: video
    };
    localStorage.setItem('explorateurData', JSON.stringify(data));
  };

  const generateNewChallenges = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    const newChallenges = Object.keys(CHALLENGES).map(category => ({
      category,
      ...getRandomChallenge(category)
    }));

    setCurrentChallenges(newChallenges);
    setDailyChallenges(newChallenges.reduce((acc, challenge) => {
      acc[challenge.category] = challenge;
      return acc;
    }, {}));
    setCompleted([]);
    setDailyProgress({ date: today, count: 0 });
    setUnlockedRewards(false);
    setShowReward(false);
    setFlippedCards({});
    setCurrentVideo("");
    setVideoKey(prev => prev + 1);
    saveToLocalStorage(newChallenges, [], today, false, usedVideos, "");
  };

  const toggleFlip = (category) => {
    setFlippedCards(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  useEffect(() => {
    const checkAndUpdateChallenges = () => {
      const storedData = localStorage.getItem('explorateurData');
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

      if (storedData) {
        const data = JSON.parse(storedData);
        const lastUpdateDate = new Date(data.lastUpdate).getTime();

        if (isNewDay(data.lastUpdate)) {
          generateNewChallenges();
        } else {
          setCurrentChallenges(data.currentChallenges);
          setDailyChallenges(data.currentChallenges.reduce((acc, challenge) => {
            acc[challenge.category] = challenge;
            return acc;
          }, {}));
          setCompleted(data.completedChallenges || []);
          setDailyProgress({ date: today, count: data.completedChallenges?.length || 0 });
          setUnlockedRewards(data.showReward || false);
          setShowReward(data.showReward || false);
          setLastUpdate(data.lastUpdate);
          setUsedVideos(data.usedVideos || []);
          setCurrentVideo(data.currentVideo || "");
        }
      } else {
        generateNewChallenges();
      }
    };

    checkAndUpdateChallenges();
    
    const interval = setInterval(checkAndUpdateChallenges, 60000);
    
    const checkScreenSize = () => setIsSmallScreen(window.innerWidth <= 768);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const completeChallenge = (category, challenge, e) => {
    e.stopPropagation();
    const today = new Date().getTime();
    const challengeId = `${category}-${challenge.text}`;
    
    if (!completed.includes(challengeId)) {
      const newCompleted = [...completed, challengeId];
      const newCount = newCompleted.length;
      const rewardsUnlocked = newCount >= 4;
      
      let newVideo = currentVideo;
      if (rewardsUnlocked && !unlockedRewards) {
        const availableVideos = MOTIVATION.videos.filter(v => !usedVideos.includes(v));
        
        if (availableVideos.length === 0) {
          setUsedVideos([]);
          newVideo = MOTIVATION.videos[0];
        } else {
          newVideo = availableVideos[Math.floor(Math.random() * availableVideos.length)];
        }
        
        setCurrentVideo(newVideo);
        setUsedVideos(prev => [...prev, newVideo]);
        setVideoKey(prev => prev + 1);
      }

      const updatedData = {
        currentChallenges: currentChallenges,
        completedChallenges: newCompleted,
        lastUpdate: today,
        showReward: rewardsUnlocked,
        usedVideos: [...usedVideos, newVideo],
        currentVideo: newVideo
      };
      
      localStorage.setItem('explorateurData', JSON.stringify(updatedData));
      
      setCompleted(newCompleted);
      setDailyProgress(prev => ({ ...prev, count: newCount }));
      
      toast.success(`Défi accompli ! ${challenge.emoji}`);
      triggerConfetti();
      
      if (rewardsUnlocked && !unlockedRewards) {
        setUnlockedRewards(true);
        setShowReward(true);
        toast.info("🎉 Vous avez débloqué vos récompenses quotidiennes !");
        triggerConfetti();
      }
    }
  };

  useEffect(() => {
    if (showReward && iframeRef.current && currentVideo) {
      const timer = setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = `${currentVideo}?autoplay=1&rel=0&mute=1`;
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [showReward, currentVideo]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120
      }
    }
  };

  return (
    <div style={{ 
      backgroundColor: "#ff6f61", 
      minHeight: "100vh",
      overflowX: 'hidden'
    }}>
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
      <div style={{
        width: "100%",
        height: "600px",
        overflow: "hidden"
      }}>
        <img
          src="/bel.jpg" 
          alt="Bannière de défis"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center"
          }}
        />
      </div>

      <Container style={{ 
        padding: "20px 15px",
        maxWidth: '100%',
        overflowX: 'hidden'
      }}>
        <motion.h1
          className="text-center mb-4"
          style={{ 
            color: "#fff", 
            fontFamily: "'Comic Sans MS', cursive",
            fontSize: isSmallScreen ? "1.8rem" : "2.2rem"
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Mes Défis Quotidiens
        </motion.h1>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="row justify-content-center"
          style={{ margin: '0 -8px', padding: '0 50px' }}
        >
          {Object.keys(CHALLENGES).map((category, index) => {
            const challenge = dailyChallenges[category];
            if (!challenge) return null;
            
            const isCompleted = completed.includes(`${category}-${challenge.text}`);
            const color = CARD_COLORS[index % CARD_COLORS.length];
            const isFlipped = flippedCards[category];

            return (
              <motion.div
                key={category}
                className="col-sm-6 col-lg-3 mb-4"
                variants={cardVariants}
                whileHover={{ scale: 1.03 }}
                style={{ 
                  padding: '0 8px',
                  maxWidth: '100%'
                }}
              >
                <div 
                  className="h-100 d-flex flex-column p-3 position-relative"
                  style={{
                    border: `3px solid ${color.bg}`,
                    borderRadius: "15px",
                    backgroundColor: isFlipped ? `${color.bg}20` : color.bg,
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    cursor: "pointer",
                    transition: "all 0.6s ease",
                    transformStyle: "preserve-3d",
                    minHeight: "250px",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
                  }}
                  onClick={() => toggleFlip(category)}
                >
                  <div style={{
                    position: "absolute",
                    backfaceVisibility: "hidden",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingRight: "30px",
                    transform: "rotateY(0deg)"
                  }}>
                    <div style={{ fontSize: "2.2rem", marginBottom: "15px" }}>
                      {category === "DefiDuJour" && "☀️"}
                      {category === "DefiSurprise" && "🎁"}
                      {category === "RouletteDesDefis" && "🎡"}
                      {category === "DefiItem" && "🎨"}
                    </div>
                    <h3 
                      style={{ 
                        color: color.text,
                        fontFamily: "'Comic Sans MS', cursive",
                        fontSize: "1rem",
                        textAlign: "center"
                      }}
                    >
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                  </div>
                  
                  <div style={{
                    position: "absolute",
                    backfaceVisibility: "hidden",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "15px",
                    transform: "rotateY(180deg)"
                  }}>
                    <div style={{ fontSize: "2.2rem" }}>
                      {category === "DefiDuJour" ? "☀️" : 
                      category === "DefiSurprise" ? "🎁" :
                      category === "RouletteDesDefis" ? "🎡" : "🎨"}
                    </div>

                    <h3 
                      style={{ 
                        color: color.text,
                        fontFamily: "'Comic Sans MS', cursive",
                        fontSize: "1rem",
                        textAlign: "center",
                        paddingLeft:"10px"
                      }}
                    >
                      {challenge.text} {challenge.emoji}
                    </h3>
                    
                    <motion.button
                      style={{ 
                        backgroundColor: color.text,
                        color: color.bg,
                        border: "none",
                        borderRadius: "20px",
                        padding: "8px 10px",
                        fontWeight: "bold",
                        width: "90%",
                        maxWidth: "180px",
                        margin: "15px",
                        fontSize: "0.9rem",
                        marginLeft:"20px"
                      }}
                      whileHover={!isCompleted ? { scale: 1.03 } : {}}
                      whileTap={!isCompleted ? { scale: 0.98 } : {}}
                      onClick={(e) => completeChallenge(category, challenge, e)}
                      disabled={isCompleted}
                    >
                      {isCompleted ? "Déjà accompli" : "Je relève le défi !"}
                    </motion.button>
                  </div>

                  {isCompleted && (
                    <FaCheck 
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "10px",
                        color: "#2a9d8f",
                        backgroundColor: "white",
                        borderRadius: "50%",
                        padding: "3px",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                        zIndex: 2
                      }}
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Section Récompenses - Afficher en dessous si débloquée */}
        {showReward && (
          <motion.div
            className="mt-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="d-flex align-items-center mb-3">
              <h2 style={{ 
                color: "#fff", 
                fontFamily: "'Comic Sans MS', cursive",
                marginRight: "10px",
                fontSize: isSmallScreen ? "1.5rem" : "1.8rem"
              }}>
                Récompenses Débloquées
              </h2>
              <FaUnlock style={{ color: "#4ECDC4", fontSize: "1.5rem" }} />
            </div>

            <div className="reward-section" style={{
              backgroundColor: "#ff8c7f",
              borderRadius: "15px",
              padding: "30px",
              marginBottom: "30px",
              textAlign: "center"
            }}>
              <h3 style={{ 
                color: "#6f42c1",
                fontFamily: "'Comic Sans MS', cursive",
                marginBottom: "20px"
              }}>
                Votre récompense du jour
              </h3>
              
              <div style={{
                backgroundColor: "rgba(111, 66, 193, 0.1)",
                padding: "20px",
                borderRadius: "10px",
                marginBottom: "25px",
                borderLeft: "5px solid #6f42c1"
              }}>
                <p style={{
                  color: "#ffff",
                  fontSize: "1.2rem",
                  fontStyle: "italic",
                  marginBottom: "0",
                  fontFamily: "'Comic Sans MS', cursive"
                }}>
                  {getRandomMotivationPhrase()}
                </p>
              </div>
              
              <div className="video-container" style={{
                margin: "20px auto",
                borderRadius: "10px",
                overflow: "hidden",
                maxWidth: "800px",
                width: "100%",
                minHeight: "450px"
              }}>
                <div style={{
                  position: "relative",
                  paddingBottom: "56.25%",
                  height: 0
                }}>
                  <iframe 
                    ref={iframeRef}
                    key={`video-${videoKey}`}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      border: "none"
                    }}
                    src={currentVideo ? `${currentVideo}?autoplay=1&rel=0&mute=1` : ""}
                    title="Motivation video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    frameBorder="0"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Section Progression - Afficher seulement si les récompenses ne sont pas débloquées */}
        {!showReward && (
          <motion.div
            className="mt-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="d-flex align-items-center mb-3">
              <h2 style={{ 
                color: "#fff", 
                fontFamily: "'Comic Sans MS', cursive",
                marginRight: "10px",
                fontSize: isSmallScreen ? "1.5rem" : "1.8rem"
              }}>
                Récompenses
              </h2>
              <FaLock style={{ color: "#FF6B6B", fontSize: "1.5rem" }} />
            </div>

            <div className="p-4 text-center" style={{ 
              backgroundColor: "rgba(255,255,255,0.2)", 
              borderRadius: "15px",
              color: "#fff"
            }}>
              <p style={{ fontSize: "1.1rem", marginBottom: "0" }}>
                Complétez 4 défis pour débloquer vos récompenses quotidiennes !
              </p>
              <div className="d-flex justify-content-center align-items-center mt-2">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i} 
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      backgroundColor: dailyProgress.count > i ? "#4ECDC4" : "#fff",
                      margin: "0 5px",
                      border: "2px solid #fff"
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </Container>
      
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Footer */}
      <footer style={{ 
        backgroundColor: "#333", 
        padding: "20px", 
        marginTop: "50px",
        width: "100%"
      }}>
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
          <p style={{ color: "#fff", marginTop: "10px" }}>
            © 2025 GoChallenges. Tous droits réservés.
          </p>
        </Container>
      </footer>
    </div>
  );
};

export default Explorateur;     