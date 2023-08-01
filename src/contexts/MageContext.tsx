import React, { useContext, useMemo, useState, useCallback, useEffect } from "react";
import { db } from "./firebase";
import { useAuth } from "./AuthContext";
import { useUser } from "./UserContext";
import {
  getDocs,
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import PropTypes from "prop-types";
import { Awakened } from "../components/mageCreator/data/Awakened";

type AwakenedContextValue = {
  awakenedList: Awakened[];
  onSubmitAwakened: (newAwakened: Awakened) => void;
  updateAwakened: (id: string, updatedAwakened: Awakened) => void;
  fetchAwakened: () => void;
};

const MageContext = React.createContext<AwakenedContextValue | null>(null);

export function useMageDb() {
  const context = useContext(MageContext);
  if (!context) {
    throw new Error("useDb must be used within a DbProvider");
  }
  return context;
}

export function MageProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const collectionRef = collection(db, "tatteredVeil");
  const [userData, setUserData] = useState<any | null>(null);
  const { getUser } = useUser();


  

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getUser();
      setUserData(user);
    };

    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]);

  const [awakenedList, setAwakenedList] = useState<any>([]);

  const charactersCollectionRef = useMemo(() => {
    if (!currentUser || !userData) return null;
  
      return query(collectionRef, where("uid", "==", currentUser.uid));
  }, [collectionRef, currentUser, userData]);


  const onSubmitAwakened = useCallback(
    async (newAwakened: Awakened) => {
      try {
        await addDoc(collectionRef, newAwakened)
      } catch (err) {
        console.log(err);
        return
      }
    }, []
  )

  const updateAwakened = useCallback(
    async (id: string, updatedAwakened: Partial<Awakened>) => {
      const characterDocRef = doc(db, "tatteredVeil", id);
      try {
        await updateDoc(characterDocRef, updatedAwakened);
      } catch (err) {
        console.error(err);
        return;
      }
    },
    []
  );

  const fetchAwakened = useCallback(async () => {
    if (!charactersCollectionRef) {
      // Handle the case when charactersCollectionRef is null (not available yet)
      return;
    }
  
    try {
      const snapshot = await getDocs(charactersCollectionRef);
      const filteredData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setAwakenedList(filteredData);
    } catch (err) {
      console.error(err);
    }
  }, [charactersCollectionRef]);
  

  const value = useMemo(() => {
    return {
      awakenedList,
      onSubmitAwakened,
      updateAwakened,
      fetchAwakened,
    };
  }, [awakenedList, onSubmitAwakened, updateAwakened, fetchAwakened]);

  return <MageContext.Provider value={value}>{children}</MageContext.Provider>;
}

MageProvider.propTypes = {
  children: PropTypes.any,
};
