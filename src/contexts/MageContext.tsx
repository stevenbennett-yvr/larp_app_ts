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
import { Awakened } from "../data/TatteredVeil/types/Awakened";

type AwakenedContextValue = {
  userAwakenedList: Awakened[];
  domainAwakenedList: Awakened[];
  fetchDomainAwakened: () => void;
  onSubmitAwakened: (newAwakened: Awakened) => void;
  updateAwakened: (id: string, updatedAwakened: Awakened) => void;
  fetchUserAwakened: () => void;
  getAwakenedById: (id: string) => Awakened;
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
    if (currentUser) {
      const fetchUserData = async () => {
        const user = await getUser();
        setUserData(user);
      };
  
      fetchUserData();
    }
  }, [currentUser, getUser]);

  const [userAwakenedList, setUserAwakenedList] = useState<any[]>([]);

  const userCollectionRef = useMemo(() => {
    if (!currentUser || !userData) return null;
      return query(collectionRef, where("uid", "==", currentUser.uid));
  }, [collectionRef, currentUser, userData]);

  const fetchUserAwakened = useCallback(async () => {
    if (!userCollectionRef) {
      // Handle the case when charactersCollectionRef is null (not available yet)
      return;
    }
  
    try {
      const snapshot = await getDocs(userCollectionRef);
      const filteredData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setUserAwakenedList(filteredData);
    } catch (err) {
      console.error(err);
    }
  }, [userCollectionRef]);


  const [domainAwakenedList, setDomainAwakenedList] = useState<any[]>([]);


  const domainAwakenedCollectionRef = useMemo(() => {
    if (!currentUser || !userData) return null;
    return query(collectionRef,
      where("domain", "==", userData.domain),
      where("background.showPublic", "==", true)
    )
  }, [collectionRef, currentUser, userData])

  const fetchDomainAwakened = useCallback(async () => {
    if (!domainAwakenedCollectionRef) {
      // Handle the case when charactersCollectionRef is null (not available yet)
      return;
    }
  
    try {
      const snapshot = await getDocs(domainAwakenedCollectionRef);
      const filteredData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setDomainAwakenedList(filteredData);
    } catch (err) {
      console.error(err);
    }
  }, [domainAwakenedCollectionRef]);



  const onSubmitAwakened = useCallback(
    async (newAwakened: Awakened) => {
      try {
        await addDoc(collectionRef, newAwakened)
      } catch (err) {
        console.log(err);
        return
      }
    }, [collectionRef]
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

  const getAwakenedById = useCallback((id:string) => {
    return userAwakenedList.find((character:any) => character.id === id)
  }, [userAwakenedList])



  const value = useMemo(() => {
    return {
      userAwakenedList,
      domainAwakenedList,
      fetchDomainAwakened,
      onSubmitAwakened,
      updateAwakened,
      fetchUserAwakened,
      getAwakenedById,
    };
  }, [userAwakenedList, domainAwakenedList, fetchDomainAwakened, onSubmitAwakened, updateAwakened, fetchUserAwakened, getAwakenedById]);

  return <MageContext.Provider value={value}>{children}</MageContext.Provider>;
}

MageProvider.propTypes = {
  children: PropTypes.any,
};
