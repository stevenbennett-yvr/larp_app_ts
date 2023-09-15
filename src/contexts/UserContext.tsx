import React, { useContext, useEffect, useMemo, useState, useCallback } from "react";
import { db } from "./firebase";
import { useAuth } from "./AuthContext";
import {
  collection,
  updateDoc,
  doc,
  query,
  where,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { User } from "../data/CaM/types/User";


interface UserContextProps {
  characterList: { id: string }[];
  getUser: () => Promise<User | null>;
  updateUser: (id: string, updatedUser: Partial<User>) => Promise<void>;
  name: string;
  domain: string;
  email: string;
  mc: number;
  uid: string;
}

const UserContext = React.createContext<UserContextProps | undefined>(undefined);

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export function UserProvider({ children }: { children: React.ReactNode}): JSX.Element {
  const { currentUser } = useAuth();
  const collectionRef = collection(db, "characters");
  const [userData, setUserData] = useState<User | null>(null);

  const charactersCollectionRef = useMemo(() => {
    if (!currentUser || !userData) return null;

    if (userData.roles?.some(role => role.title === "vst")) {
      console.log('charactersCollectionRef VST query')
      const vstRole = userData.roles.find(role => role.title === "vst");
      return query(collectionRef, 
        where("chronicle", "==", vstRole?.venue),
        where("domain", "==", vstRole?.domain)
      );
    } else {
      console.log('characterCollectionRef query')
      return query(collectionRef, where("uid", "==", currentUser.uid));
    }
  }, []);

  const [characterList, setCharacterList] = useState<{ id: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const unsubscribe = useMemo(() => {
    if (!charactersCollectionRef) return;
    console.log("unsubscribe onSnapshot")
    const unsubscribe = onSnapshot(charactersCollectionRef, (snapshot) => {
      const filteredData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setCharacterList(filteredData);
    });
    return unsubscribe;
  }, []);

  const getUser = useCallback(async () => {
    if (!currentUser) return null;
    const userDocRef = doc(db, "users", currentUser.uid);
    try {
      console.log('getUser getDoc')
      const userSnapshot = await getDoc(userDocRef);
      if (userSnapshot.exists()) {
        return userSnapshot.data() as User;
      } else {
        // User document does not exist
        return null;
      }
    } catch (error) {
      console.error("Error retrieving user document:", error);
      return null;
    }
  }, [currentUser]);

  const updateUser = useCallback(
    async (id: string, updatedUser: Partial<User>) => {
      const userDoc = doc(db, "users", id);
      try {
        console.log("updateUser updateDoc")
        await updateDoc(userDoc, updatedUser);
      } catch (err) {
        console.error(err);
        return;
      }
    },
    []
  );

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getUser();
      setUserData(user);
    };

    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser, getUser]);

  useEffect(() => {
    setLoading(false);
    return () => unsubscribe && unsubscribe();
  }, [unsubscribe]);

  const value = useMemo(() => {
    return {
      characterList,
      getUser,
      updateUser,
      name: userData?.name || "",
      domain: userData?.domain || "",
      email: userData?.email || "",
      mc: userData?.mc || 0,
      uid: userData?.uid || ""
    };
  }, [characterList, getUser, updateUser, userData]);

  return (
    <UserContext.Provider value={value}>
      {!loading ? children : null}
    </UserContext.Provider>
  );
}
