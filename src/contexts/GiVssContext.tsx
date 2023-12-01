import React, { useContext, useCallback, useMemo } from "react";
import { addDoc, collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import PropTypes from "prop-types";
import { GoodIntentionsVenueStyleSheet, GoodIntentionsVSSs } from "../data/CaM/types/VSS";

type GiVssContextValue = {
    onSubmitVss: (newVss: GoodIntentionsVenueStyleSheet) => void;
    getVssById: (vssId: string, setGiVss:Function) => void;
    updateVss: (id:string, updatedVss: GoodIntentionsVenueStyleSheet) => void;
}

const GiVssContext = React.createContext<GiVssContextValue | null>(null);

export function useGiVssDb() {
  const context = useContext(GiVssContext)
  if (!context) {
    throw new Error("useGiVssDb must be used within an GiVssProvider");
  }
  return context;
}

export function GiVssProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const collectionRef = collection(db, "goodIntentionsVss");

  // Submit character
  const onSubmitVss = useCallback(
    async (newVss: GoodIntentionsVenueStyleSheet) => {
      try {
        await addDoc(collectionRef, newVss);
      } catch (err) {
        console.log(err);
        return;
      }
    },
    [collectionRef]
  );

  const getVssById = useCallback(
    async (vssId: string, setGiVss:Function) => {
      const q = query(collectionRef, where("venueStyleSheet.id", "==", vssId));
      console.log(vssId)

      try {
        const snapshot = await getDocs(q);
        if (snapshot.docs.length > 0) {
          const doc = snapshot.docs[0]
          const data = {
            ...doc.data(),
            id: doc.id
          };
          setGiVss(data)
        } else {
          setGiVss(GoodIntentionsVSSs.find((venue) => venue.venueStyleSheet.id === vssId))
        }
      } catch (err) {
        console.log(err);
      }
    },
    [collectionRef]
  );


  const updateVss = useCallback(
    async (id:string, updatedVss: Partial<GoodIntentionsVenueStyleSheet>) => {
      const vssDocRef = doc(db, "goodIntentionsVss", id);
      try {
        await updateDoc(vssDocRef, updatedVss);
      } catch (err) {
        console.error(err);
        return;
      }
    },
    []
  )

  const value: GiVssContextValue = useMemo(() => {
    return {
        onSubmitVss,
        getVssById,
        updateVss,
    };
  }, [onSubmitVss, getVssById, updateVss]);

  return (
    <GiVssContext.Provider value={value}>
      {children}
    </GiVssContext.Provider>
  );
}



GiVssProvider.propTypes = {
  children: PropTypes.node,
};