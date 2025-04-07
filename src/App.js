import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Pages principales
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import Deadline from "./pages/Deadline";
import Explorateur from "./pages/Explorateur";
import Recompenses from "./pages/Recompenses";
import CategoriesList from "./pages/CategoriesList";
import Profile from "./pages/Profile";

// Pages de catégories
import Sport from "./pages/categories/Sport";
import Nutrition from "./pages/categories/Nutrition";
import Travail from "./pages/categories/Travail";
import TacheMenage from "./pages/categories/TacheMenage";
import Bienetre from "./pages/categories/Bienetre";
import Religion from "./pages/categories/Religion";
import Etudes from "./pages/categories/Etudes";
import TacheRepousse from "./pages/categories/TacheRepousse";
import DevlopPerso from "./pages/categories/DevlopPerso";
import AutresDef from "./pages/categories/AutresDef";

// Fonctions utilitaires pour localStorage
const initializeLocalStorage = () => {
  const defaults = {
    userChallenges: [],
    challengesState: {},
    userData: {
      points: 0,
      rewards: [],
      completedChallenges: []
    }
  };

  Object.entries(defaults).forEach(([key, value]) => {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  });
};

const addUserChallenge = (challenge) => {
  const challenges = JSON.parse(localStorage.getItem('userChallenges')) || [];
  const newChallenge = {
    ...challenge,
    id: `uc${Date.now()}`,
    color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`,
    createdAt: new Date().toISOString()
  };
  const updatedChallenges = [...challenges, newChallenge];
  localStorage.setItem('userChallenges', JSON.stringify(updatedChallenges));
  return newChallenge;
};

const checkChallengesExist = () => {
  const challenges = JSON.parse(localStorage.getItem('userChallenges'));
  return challenges && challenges.length > 0;
};

const App = () => {
  useEffect(() => {
    initializeLocalStorage();
    
    if (!checkChallengesExist()) {
      const initialChallenges = [
        {
          title: "Courir 30 minutes",
          description: "Faire une course de 30 minutes sans s'arrêter",
          category: "sport",
          points: 10,
          icon: "FaRunning"
        },
        {
          title: "Manger 5 fruits", 
          description: "Consommer 5 portions de fruits dans la journée",
          category: "nutrition",
          points: 15,
          icon: "FaAppleAlt"
        },
        {
          title: "Faire le ménage",
          description: "Nettoyer toute la maison",
          category: "taches-menageres",
          points: 20,
          icon: "FaHome"
        }
      ];

      initialChallenges.forEach(addUserChallenge);
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Routes principales */}
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/deadline" element={<Deadline />} />
        <Route path="/categories-defis" element={<CategoriesList />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/recompenses" element={<Recompenses />} />
        <Route path="/suggestion" element={<Explorateur />} />
        <Route path="/explorateur" element={<Explorateur />} />

        {/* Routes des catégories */}
        <Route path="/category/sport" element={<Sport />} />
        <Route path="/category/nutrition" element={<Nutrition />} />
        <Route path="/category/travail" element={<Travail />} />
        <Route path="/category/taches-menageres" element={<TacheMenage />} />
        <Route path="/category/bien-etre" element={<Bienetre />} />
        <Route path="/category/religion" element={<Religion />} />
        <Route path="/category/etudes" element={<Etudes />} />
        <Route path="/category/taches-repoussees" element={<TacheRepousse />} />
        <Route path="/category/developpement-personnel" element={<DevlopPerso />} />
        <Route path="/categories/autres-defis" element={<AutresDef />} />

        {/* Route de fallback */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;