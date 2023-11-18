import React, { useCallback, useContext, useMemo, useState } from "react";
import { app, db } from "./firebase";
import { getDatabase, ref, set, onValue, push, remove } from "firebase/database";
import { addDoc, collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import PropTypes from 'prop-types'
import { Coterie } from "../data/GoodIntentions/types/Coterie";
import { Kindred } from "../data/GoodIntentions/types/Kindred";
import { V5MeritFlawRef } from "../data/GoodIntentions/types/V5MeritsOrFlaws";

// RTDB Ref

const rtdb = getDatabase(app)

type CoterieContextValue = {
    writeCoterieData: (coterieId: string, coterie: Coterie) => void;
    getCoterieData: (coterieId: string, vssId: string, setCoterie: Function) => void;
    writeInvitation: (senderId: string, recipientId: string, coterie: Coterie) => void;
    getCoterieInvitations: (coterieId: string) => void;
    coterieInvites: any[];
    getKindredInvitations: (kindred: Kindred, setKindredInvites: Function) => void;
    deleteInvite: (docId: string) => void;
    pushCoterieMeritData: (coterie: Coterie, meritFlaw: V5MeritFlawRef) => void;
    removeCoterieMeritData: (coterie: Coterie, meritFlaw: V5MeritFlawRef) => void;
}

const CoterieContext = React.createContext<CoterieContextValue | null>(null)

export function useCoterieDb() {
    const context = useContext(CoterieContext);
    if (!context) {
        throw new Error("useDb must be used within a DbProvider");
    }
    return context;
}

export function CoterieProvider({ children }: { children: React.ReactNode }) {

    const writeCoterieData = useCallback(
        async (coterieId: string, coterie: Coterie) => {
            if (coterieId === "" || coterieId === undefined || !coterie || coterie.vssId === undefined || coterie.vssId === "") {
                return null;
            }
            const reference = ref(rtdb, `coteries${coterie.vssId}/` + coterieId);
            try {
                // Set the data directly
                await set(reference, coterie);
            } catch (error) {
                console.error("Write failed: ", error);
            }
        },
        []
    );

    const pushCoterieMeritData = useCallback(
        async (coterie: Coterie, meritFlaw: V5MeritFlawRef) => {
            const reference = ref(rtdb, `coteries${coterie.vssId}/${coterie.id}/meritsFlaws`);
            const existingMeritRef = Object.values(coterie.meritsFlaws || {}).find(mf => mf.name === meritFlaw.name);

            if (existingMeritRef) {
                // If it exists, update the existing item
                const existingMeritKey = Object.keys(coterie.meritsFlaws).find((key: any) => coterie.meritsFlaws[key].name === meritFlaw.name);
                const meritReference = ref(rtdb, `coteries${coterie.vssId}/${coterie.id}/meritsFlaws/${existingMeritKey}`)
                await set(meritReference, meritFlaw);
            } else {
                // If it doesn't exist, push a new item
                push(reference, meritFlaw);
            }
        },
        [] // Include coterie.meritsFlaws as a dependency if needed
    );

    const removeCoterieMeritData = useCallback(
        async (coterie: Coterie, meritFlaw: V5MeritFlawRef) => {

            // Find the key of the merit to be removed
            const existingMeritKey = Object.keys(coterie.meritsFlaws).find((key: any) => coterie.meritsFlaws[key].name === meritFlaw.name);
            const reference = ref(rtdb, `coteries${coterie.vssId}/${coterie.id}/meritsFlaws/${existingMeritKey}`);
            if (existingMeritKey) {
                // If the merit exists, remove it
                await remove(reference);
            }
        },
        [] // Include coterie.meritsFlaws as a dependency if needed
    );

    const getCoterieData = useCallback(
        async (coterieId: string, vssId: string, setCoterie: Function) => {
            const reference = ref(rtdb, `coteries${vssId}/` + coterieId)
            onValue(reference, (snapshot) => {
                const data = snapshot.val();
                setCoterie(data)
            })
        }, []);

    const collectionRef = collection(db, "goodIntentionsInvitations");

    const writeInvitation = useCallback(
        async (senderId: string, recipientId: string, coterie: Coterie) => {
            const invitation = { senderId: senderId, recipientId: recipientId, coterieId: coterie.id }
            try {
                await addDoc(collectionRef, invitation)
            } catch (err) {
                console.log(err);
                return;
            }
        }, []
    )

    const [coterieInvites, setCoterieInvites] = useState<any[]>([])

    const getCoterieInvitations = useCallback(
        async (coterieId: string) => {
            // Ensure coterie.id is defined before creating the query
            if (coterieId) {
                const q = query(collectionRef, where("coterieId", "==", coterieId))
                try {
                    const snapshot = await getDocs(q);
                    const fulldata = snapshot.docs.map((doc) => ({
                        ...doc.data(),
                        id: doc.id,
                    }));
                    setCoterieInvites(fulldata)
                } catch (err) {
                    console.log(err);
                }
            } else {
                console.error("coterie.id is undefined");
            }
        }, []
    );

    const getKindredInvitations = useCallback(
        async (kindred: Kindred, setKindredInvites: Function) => {
            const q = query(collectionRef, where("recipientId", "==", kindred.id))

            try {
                const snapshot = await getDocs(q);
                const fulldata = snapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                setKindredInvites(fulldata)
            } catch (err) {
                console.log(err);
            }
        }, []
    );

    const deleteInvite = useCallback(
        async (docId: string) => {
            try {
                await deleteDoc(doc(collectionRef, docId));
                console.log(`Document with ID ${docId} successfully deleted.`);
            } catch (err) {
                console.error('Error deleting document:', err);
            }
        }, []);

    const value: CoterieContextValue = useMemo(() => {
        return {
            writeCoterieData,
            getCoterieData,
            writeInvitation,
            getCoterieInvitations,
            coterieInvites,
            getKindredInvitations,
            deleteInvite,
            pushCoterieMeritData,
            removeCoterieMeritData,
        };
    }, [writeCoterieData, getCoterieData, writeInvitation, getCoterieInvitations, coterieInvites, getKindredInvitations, deleteInvite, pushCoterieMeritData, removeCoterieMeritData])

    return (
        <CoterieContext.Provider value={value}>
            {children}
        </CoterieContext.Provider>
    )
}

CoterieProvider.propTypes = {
    children: PropTypes.node,
}