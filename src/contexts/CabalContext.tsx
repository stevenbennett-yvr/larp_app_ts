import React, { useCallback, useContext, useMemo } from "react";
import { db } from "./firebase";
import { useAuth } from "./AuthContext";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
  getDoc
} from "firebase/firestore";
import PropTypes from "prop-types";
import { Cabal } from "../components/tatteredVeil/data/Cabals";

type CabalContextValue = {
    getCabalData: (id:string) => Promise<Cabal | null>;
    getCabalInvitations: (id:string) => any;
    onSubmitCabal: (newCabal:Cabal) => void;
    deleteCabal: (id:string) => void;
    updateCabal: (id:string, updatedCabal:Cabal) => void;
}

const CabalContext = React.createContext<CabalContextValue | null>(null)

export function useCabalDb() {
  const context = useContext(CabalContext);
  if (!context) {
    throw new Error("useDb must be used within a DbProvider");
  }
  return context;
}

export function CabalProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const cabalCollectionRef = collection(db, "cabals");

  const getCabalData = useCallback(
    async (characterId: string) => {
      if (!currentUser) return null;
      const userCabalQuery = query(
        cabalCollectionRef,
        where("memberIds", "array-contains", characterId)
      );
      try {
        const userCabalSnapshot = await getDocs(userCabalQuery);
        if (userCabalSnapshot.empty) {
          return null;
        } else {
          const cabalData = userCabalSnapshot.docs[0].data() as Cabal; // Cast to Cabal type
          const cabalId = userCabalSnapshot.docs[0].id;
          return { id: cabalId, ...cabalData };
        }
      } catch (error) {
        console.error("Error retrieving cabal data:", error);
        return null;
      }
    },
    [currentUser, cabalCollectionRef]
  );  
  

  const getCabalInvitations = useCallback(
    async (characterId: string) => {
    if (!currentUser) return null;
    const userCabalQuery = query(cabalCollectionRef, where("invitations", "array-contains", characterId));
    try {
      const userCabalSnapshot = await getDocs(userCabalQuery);
      if (userCabalSnapshot.empty) {
        return null;
      } else {
        const cabalData = userCabalSnapshot.docs[0].data();
        return cabalData;
      }
    } catch (error) {
      console.error("Error retrieving cabal data:", error);
      return null;
    }
  }, [currentUser, cabalCollectionRef]);


  const onSubmitCabal = useCallback(
  async (newCabal: Cabal) => {
    try {
      await addDoc(cabalCollectionRef, newCabal);
    } catch (err) {
      console.error(err);
      return;
    }
  }, [cabalCollectionRef]);

  const deleteCabal = useCallback(
  async (id: string) => {
    const cabalDoc = doc(db, "cabals", id);
    try {
      await deleteDoc(cabalDoc);
    } catch (err) {
      console.error(err);
      return;
    }
  }, []);

  const updateCabal = useCallback(
  async (id:string, updatedCabal:Cabal) => {
    const cabalDocRef = doc(db, "cabals", id);
    try {
      const cabalSnapshot = await getDoc(cabalDocRef);
      if (cabalSnapshot.exists()) {
        await updateDoc(cabalDocRef, updatedCabal);
      } else {
        console.log("Cabal document does not exist");
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const value = useMemo(() => {
    return { getCabalData, onSubmitCabal, deleteCabal, updateCabal, getCabalInvitations };
  }, [getCabalData, onSubmitCabal, deleteCabal, updateCabal, getCabalInvitations]);

  return <CabalContext.Provider value={value}>{children}</CabalContext.Provider>;
}

CabalProvider.propTypes = {
  children: PropTypes.any,
};
