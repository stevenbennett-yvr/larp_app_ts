import React, { useContext, useCallback, useMemo } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase";
import { Kindred } from "../data/GoodIntentions/types/Kindred";
import PropTypes from "prop-types";

type characterContextValue = {
  onSubmitCharacter: (newCharacter: (Kindred)) => void;
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
    const collectionRef = collection(db, "goodIntentions")

    const onSubmitCharacter = useCallback(
        async (newCharacter: (Kindred)) => {
            try {
                await addDoc(collectionRef, newCharacter)
            } catch (err) {
                console.log(err);
                return
            }
        }, [collectionRef]
    )

    const value = useMemo(() => {
      return {
        onSubmitCharacter
      };
    }, [onSubmitCharacter]);

    return (
      <CharacterContext.Provider value={value}>
        {children}
      </CharacterContext.Provider>
    );
  }


  
  CharacterProvider.propTypes = {
    children: PropTypes.node,
  };