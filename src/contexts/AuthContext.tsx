import React, { useContext, useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { doc, setDoc, query, getDocs, collection, where, deleteDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { emptyUser } from "./UserContext";

interface Auth {
  uid: string;
  email: string;
}

interface AuthContextProps {
  currentUser: Auth | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextProps | undefined>(undefined);

export function useAuth(): AuthContextProps {

  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [currentUser, setCurrentUser] = useState<Auth | null>(null); // Specify the type here
  const [loading, setLoading] = useState(true);

  const googleProvider = new GoogleAuthProvider();

  async function loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { uid, email } = result.user;
      const userQuery = query(collection(db, "users"), where("email", "==", email));
      const userSnapshot = await getDocs(userQuery);
      if (userSnapshot.empty) {
        // User doesn't exist, add the user to the database
        const userDocRef = doc(db, "users", uid);
        try {
          await setDoc(userDocRef, { ...emptyUser, uid, email });
          console.log("User added to the database");
        } catch (error) {
          console.error("Error adding user to the database:", error);
        }
      } else {
        // User already exists, check if UID matches document ID
        if (userSnapshot.docs[0].id !== uid) {
          // UID doesn't match, update the document with new key and delete old document
          const oldUserDocRef = doc(db, "users", userSnapshot.docs[0].id);
          const oldUserData = userSnapshot.docs[0].data();
  
          const newUserDocRef = doc(db, "users", uid);
          try {
            await setDoc(newUserDocRef, { ...oldUserData });
            await deleteDoc(oldUserDocRef);
            console.log("User document updated with new key and old document deleted");
          } catch (error) {
            console.error("Error updating user document and deleting old document:", error);
          }
        }
      }
      console.log("User login successful");
    } catch (error) {
      console.log(error);
    }
  }  

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}