import React, { useContext, useCallback, useMemo } from "react";
import { addDoc, collection, getDoc, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { Kindred } from "../data/GoodIntentions/types/Kindred";
import PropTypes from "prop-types";
import { useState } from "react";

type characterContextValue = {
  onSubmitCharacter: (newCharacter: (Kindred)) => void;
  getCharacterByUIDAndVSS: (uid:string, vssId:string, isSt?:boolean) => void;
  userLocalKindred: any[];
  getKindredById: (id:string, setKindred: (kindred:Kindred) => void) => void;
  updateKindred: (id:string, updatedKindred:Kindred) => void;
  getLocalCoterielessKindred: (vssid:string) => void;
  getCoterieMembers: (coterieId:string) => void;
  localCoterielessKindred: any[];
  coterieMembers: any[];
}

const CharacterContext = React.createContext<characterContextValue | null>(null);

export function useCharacterDb() {
  const context = useContext(CharacterContext)
  if (!context) {
    throw new Error("useCharacterDb must be used within an CharacterProvider");
  }
  return context;
}

export function CharacterProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const collectionRef = collection(db, "goodIntentions");

  // Submit character
  const onSubmitCharacter = useCallback(
    async (newCharacter: Kindred) => {
      try {
        await addDoc(collectionRef, newCharacter);
      } catch (err) {
        console.log(err);
        return;
      }
    },
    [collectionRef]
  );

  // Get character based on id and vss
  const [userLocalKindred, setUserLocalKindred] = useState<any[]>([]); // Initialize with an empty array

  const getCharacterByUIDAndVSS = useCallback(
    async (uid: string, vssId: string, isSt?:boolean) => {
      let q = null
      if (isSt) {q = query(collectionRef, where("vssId", "==", vssId), where("status", "==", "active"));}
      else {q = query(collectionRef, where("uid", "==", uid), where("vssId", "==", vssId), where("status", "==", "active"));}

      try {
        const snapshot = await getDocs(q);
        const fulldata = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setUserLocalKindred(fulldata);
      } catch (err) {
        console.log(err);
      }
    },
    [collectionRef]
  );

  const [localCoterielessKindred, setLocalCoterielessKindred] = useState<any[]>([]); // Initialize with an empty array

  const getLocalCoterielessKindred = useCallback(
    async (vssid:string) => {
      const q = query(collectionRef, where("vssId", "==", vssid), where("coterie.id", "==", ""), where("status", "==", "active"));

      try {
        const snapshot = await getDocs(q);
        const fulldata = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setLocalCoterielessKindred(fulldata);
      } catch (err) {
        console.log(err);
      }
    },
    []
  );

  const [coterieMembers, setCoterieMembers] = useState<any[]>([])

  const getCoterieMembers = useCallback(
    async (coterieId:string) => {
      if (coterieId==="" || !coterieId) { return }
      const q = query(collectionRef, where("coterie.id", "==", coterieId));

      try {
        const snapshot = await getDocs(q);
        const fulldata = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setCoterieMembers(fulldata);
      } catch (err) {
        console.log(err);
      }
    },
    []
  );

  const getKindredById = useCallback(async (id:string, setKindred:Function) => {
    const kindredDocRef = doc(collectionRef, id);

    try {
      const docSnapshot = await getDoc(kindredDocRef);
      if (docSnapshot.exists()) {
        let kindredData = docSnapshot.data() as Kindred;
        kindredData = {
          ...kindredData,
          id: docSnapshot.id,
        };
        setKindred(kindredData)
      } else {
        return null; // Character with the given ID not found
      }
    } catch (err) {
      console.error(err);
      return null; // Error occurred while fetching the character
    }
  }, [collectionRef])

  const updateKindred = useCallback(
    async (id:string, updatedKindred: Partial<Kindred>) => {
      const characterDocRef = doc(db, "goodIntentions", id);
      try {
        await updateDoc(characterDocRef, updatedKindred);
      } catch (err) {
        console.error(err);
        return;
      }
    },
    []
  )

  const value: characterContextValue = useMemo(() => {
    return {
      onSubmitCharacter,
      getCharacterByUIDAndVSS,
      userLocalKindred,
      getKindredById,
      updateKindred,
      getCoterieMembers,
      getLocalCoterielessKindred,
      localCoterielessKindred,
      coterieMembers,
    };
  }, [onSubmitCharacter, getCharacterByUIDAndVSS, userLocalKindred, getKindredById, updateKindred, getLocalCoterielessKindred, localCoterielessKindred, getCoterieMembers, coterieMembers]);

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  );
}



CharacterProvider.propTypes = {
  children: PropTypes.node,
};