import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  sendPasswordResetEmail
} from "firebase/auth";

import { 
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  increment,
  collection,
  query,
  where,
  onSnapshot,
  writeBatch
} from "firebase/firestore";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBSSvDGMByP-YEvY1MWqOOby_xQRlalYcc",
  authDomain: "myproject-e4bab.firebaseapp.com",
  projectId: "myproject-e4bab",
  storageBucket: "myproject-e4bab.appspot.com",
  messagingSenderId: "902895838078",
  appId: "1:902895838078:web:94c3c701127a7b5bc9492f",
  measurementId: "G-7P1TWLM6Y3"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Configuration du système de récompenses
const rewardsConfig = {
  levels: [
    {
      id: "bronze",
      name: "Badge Bronze",
      icon: "🥉",
      pointsRequired: 50,
      description: "Premier niveau atteint"
    },
    {
      id: "silver",
      name: "Badge Argent",
      icon: "🥈",
      pointsRequired: 100,
      description: "Niveau intermédiaire"
    },
    {
      id: "gold",
      name: "Badge Or",
      icon: "🥇",
      pointsRequired: 200,
      description: "Expert confirmé"
    },
    {
      id: "platinum",
      name: "Badge Platine",
      icon: "💎",
      pointsRequired: 500,
      description: "Maîtrise exceptionnelle"
    }
  ],
  specialRewards: [
    {
      id: "secret",
      name: "Récompense Secrète",
      icon: "🔒",
      pointsRequired: 1000,
      description: "Accomplissement ultime"
    }
  ]
};

// Fonctions Firestore
const firestoreOperations = {
  sendChallengesToFirestore: async (challenges) => {
    try {
      const batch = writeBatch(db);
      const challengesRef = collection(db, "challenges");

      challenges.forEach(challenge => {
        const newChallengeRef = doc(challengesRef);
        batch.set(newChallengeRef, challenge);
      });

      await batch.commit();
      console.log("Défis ajoutés avec succès");
      return true;
    } catch (error) {
      console.error("Erreur ajout défis:", error);
      return false;
    }
  },

  createUserDocument: async (user) => {
    if (!user) return;
    
    const userRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      try {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          points: 0,
          unlockedRewards: [],
          challengesCompleted: 0,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        });
      } catch (error) {
        console.error("Erreur création utilisateur:", error);
      }
    } else {
      await updateDoc(userRef, {
        lastLogin: new Date().toISOString()
      });
    }
  }
};

// Système de points et récompenses
const pointsSystem = {
  checkAndUnlockRewards: async (userId) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) return;

    const userData = userDoc.data();
    const allRewards = [...rewardsConfig.levels, ...rewardsConfig.specialRewards];
    
    const rewardsToUnlock = allRewards.filter(reward => 
      userData.points >= reward.pointsRequired &&
      !userData.unlockedRewards.some(r => r.id === reward.id)
    );

    if (rewardsToUnlock.length > 0) {
      await updateDoc(userRef, {
        unlockedRewards: arrayUnion(...rewardsToUnlock)
      });
    }
  },

  handlePoints: {
    add: async (userId, points) => {
      try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
          points: increment(points),
          challengesCompleted: increment(1)
        });
        await pointsSystem.checkAndUnlockRewards(userId);
        return true;
      } catch (error) {
        console.error("Erreur ajout points:", error);
        return false;
      }
    },

    deduct: async (userId, points) => {
      try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
          points: increment(-points)
        });
        return true;
      } catch (error) {
        console.error("Erreur déduction points:", error);
        return false;
      }
    },

    listen: (userId, callback) => {
      return onSnapshot(doc(db, "users", userId), (doc) => {
        const data = doc.exists() ? doc.data() : null;
        if (data) {
          data.availableRewards = [
            ...rewardsConfig.levels,
            ...rewardsConfig.specialRewards
          ].map(reward => ({
            ...reward,
            unlocked: data.unlockedRewards?.some(r => r.id === reward.id) || false,
            canUnlock: data.points >= reward.pointsRequired &&
                      !data.unlockedRewards?.some(r => r.id === reward.id)
          }));
        }
        callback(data);
      });
    }
  },

  rewardSystem: {
    config: rewardsConfig,
    
    unlock: async (userId, rewardId) => {
      try {
        const reward = [...rewardsConfig.levels, ...rewardsConfig.specialRewards]
          .find(r => r.id === rewardId);
        
        if (!reward) return false;

        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) return false;

        const userData = userDoc.data();
        
        if (userData.points >= reward.pointsRequired && 
            !userData.unlockedRewards.some(r => r.id === rewardId)) {
          await updateDoc(userRef, {
            unlockedRewards: arrayUnion(reward),
            points: increment(-reward.pointsRequired)
          });
          return true;
        }
        return false;
      } catch (error) {
        console.error("Erreur déblocage récompense:", error);
        return false;
      }
    },

    checkUnlocked: async (userId, rewardId) => {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const rewards = userDoc.data().unlockedRewards || [];
        return rewards.some(r => r.id === rewardId);
      }
      return false;
    },

    getUserRewardsStatus: async (userId) => {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) return null;

      const userData = userDoc.data();
      return {
        points: userData.points || 0,
        unlockedRewards: userData.unlockedRewards || [],
        availableRewards: [
          ...rewardsConfig.levels,
          ...rewardsConfig.specialRewards
        ].map(reward => ({
          ...reward,
          unlocked: userData.unlockedRewards?.some(r => r.id === reward.id) || false,
          canUnlock: userData.points >= reward.pointsRequired &&
                    !userData.unlockedRewards?.some(r => r.id === reward.id)
        }))
      };
    }
  }
};

// Écouteur d'authentification
onAuthStateChanged(auth, async (user) => {
  if (user) {
    await firestoreOperations.createUserDocument(user);
  }
});

// Export des fonctionnalités
export {
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  onAuthStateChanged,
  sendPasswordResetEmail,
  pointsSystem,
  firestoreOperations
};