import React, { useState, useEffect } from "react";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "../firebaseConfig";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navbar, Nav, Container, Button as BsButton } from "react-bootstrap";
import { 
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin
} from "react-icons/fa";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const AuthPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSignUp, setShowSignUp] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const db = getFirestore();

  // Détection de la taille de l'écran
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Créer un document utilisateur dans Firestore
  const createUserDocument = async (user, additionalData = {}) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      try {
        await setDoc(userRef, {
          displayName: additionalData.name || user.email.split('@')[0],
          email: user.email,
          photoURL: null,
          points: 0,
          rewards: [],
          challengesCompleted: 0,
          createdAt: new Date().toISOString(),
          ...additionalData
        });

        localStorage.setItem('userData', JSON.stringify({
          name: additionalData.name || user.email.split('@')[0],
          email: user.email,
          photoURL: null,
          points: 0,
          rewards: []
        }));
      } catch (error) {
        console.error("Erreur création document utilisateur:", error);
      }
    }
  };

  // Gestion de l'inscription
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }
    
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await createUserDocument(user, { name });
      
      toast.success(`Bienvenue ${name} ! Inscription réussie.`);
      navigate("/profile");
    } catch (error) {
      let errorMessage = "Une erreur s'est produite lors de l'inscription.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Cet email est déjà utilisé.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Le mot de passe doit contenir au moins 6 caractères.";
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Gestion de la connexion
  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      // Sauvegarde dans localStorage avec le prénom
      localStorage.setItem('userData', JSON.stringify({
        name: name || user.displayName || user.email.split('@')[0],
        email: user.email,
        photoURL: user.photoURL || null,
        points: userDoc.data()?.points || 0,
        rewards: userDoc.data()?.rewards || []
      }));
      
      toast.success(`Bienvenue ${name || user.email}!`);
      navigate("/profile");
    } catch (error) {
      let errorMessage = "Une erreur s'est produite lors de la connexion.";
      if (error.code === "auth/user-not-found") {
        errorMessage = "Aucun utilisateur trouvé avec cet email.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Mot de passe incorrect.";
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Réinitialisation du mot de passe
  const handlePasswordReset = async () => {
    if (!email) {
      toast.error("Veuillez entrer votre adresse email.");
      return;
    }
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      toast.success("Un email de réinitialisation a été envoyé.");
    } catch (error) {
      toast.error("Erreur lors de l'envoi de l'email de réinitialisation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#ff6f61", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
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
                        padding: "12px 20px",
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
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: isSmallScreen ? "column" : "row",
        backgroundColor: "#f5f5f5",
        padding: isSmallScreen ? "20px 0" : "0",
      }}>
        {/* Image pour les petits écrans */}
        {isSmallScreen && (
          <img
            src="/im10.avif"
            alt="Auth Banner"
            style={{
              width: "100%",
              height: "40vh",
              objectFit: "cover",
              borderRadius: "15px",
              marginBottom: "20px",
            }}
          />
        )}

        {/* Formulaire */}
        <div style={{
          width: isSmallScreen ? "90%" : "40%",
          maxWidth: "400px",
          padding: "40px",
          boxShadow: "0px 0px 20px rgba(0,0,0,0.1)",
          borderRadius: "12px",
          backgroundColor: "white",
          margin: isSmallScreen ? "0 auto" : "0 5%",
        }}>
          {showSignUp ? (
            <form onSubmit={handleSignUp} style={styles.form}>
              <h2 style={styles.title}>Inscription</h2>
              <input
                type="text"
                placeholder="Prénom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
              <div style={styles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  required
                  minLength="6"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.togglePasswordButton}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <input
                type="password"
                placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={styles.input}
                required
                minLength="6"
              />
              <button
                type="submit"
                style={styles.button}
                disabled={loading}
              >
                {loading ? "Chargement..." : "S'inscrire"}
              </button>
              <p style={styles.toggleText} onClick={() => setShowSignUp(false)}>
                Déjà un compte ? Connectez-vous
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignIn} style={styles.form}>
              <h2 style={styles.title}>Connexion</h2>
              <input
                type="text"
                placeholder="Prénom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                required
              />
              <div style={styles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.togglePasswordButton}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <button
                type="submit"
                style={styles.button}
                disabled={loading}
              >
                {loading ? "Chargement..." : "Se connecter"}
              </button>
              <p style={styles.toggleText} onClick={() => setShowSignUp(true)}>
                Pas encore de compte ? Inscrivez-vous
              </p>
              <p style={styles.resetPassword} onClick={handlePasswordReset}>
                Mot de passe oublié ?
              </p>
            </form>
          )}
        </div>

        {/* Image pour les grands écrans */}
        {!isSmallScreen && (
          <img
            src="/im10.avif"
            alt="Auth Banner"
            style={{
              width: "50%",
              height: "calc(100vh - 80px)",
              objectFit: "cover",
              borderRadius: "15px 0 0 15px",
            }}
          />
        )}
      </div>

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

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

// Styles
const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "20px",
    textAlign: "center",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.3s ease",
    width: "100%",
    ":hover": {
      borderColor: "#ff6f61",
    },
  },
  passwordContainer: {
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  togglePasswordButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "20px",
    position: "absolute",
    right: "10px",
    color: "#666",
    ":hover": {
      color: "#ff6f61",
    },
  },
  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#ff6f61",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    width: "100%",
    ":hover": {
      backgroundColor: "#ff4500",
    },
    ":disabled": {
      backgroundColor: "#ccc",
      cursor: "not-allowed",
    },
  },
  toggleText: {
    color: "#ff8c7f",
    textAlign: "center",
    cursor: "pointer",
    fontSize: "14px",
    transition: "color 0.3s ease",
    ":hover": {
      color: "#ff4500",
    },
  },
  resetPassword: {
    color: "#ff8c7f",
    textAlign: "center",
    cursor: "pointer",
    fontSize: "14px",
    marginTop: "10px",
    transition: "color 0.3s ease",
    ":hover": {
      color: "#ff4500",
    },
  },
};

export default AuthPage;