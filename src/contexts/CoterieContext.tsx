import React, { useCallback, useContext, useMemo } from "react";
import { app } from "./firebase";
import { getDatabase, ref, set, onValue } from "firebase/database";
import PropTypes from 'prop-types'
import { Coterie } from "../data/GoodIntentions/types/Coterie";

// RTDB Ref

const db = getDatabase(app)

type CoterieContextValue = {
    writeCoterieData: (coterieId:string, coterie: Coterie) => void;
    getCoterieData: (coterieId: string, vssId: string, setCoterie: Function) => void;
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
        const reference = ref(db, `coteries${coterie.vssId}/` + coterieId)
        set(reference, coterie)
    }, []);
    
    const getCoterieData = useCallback(
        async (coterieId: string, vssId: string, setCoterie: Function) => {
        const reference = ref(db, `coteries${vssId}/` + coterieId)
        onValue(reference, (snapshot) => {
            const data = snapshot.val();
            setCoterie(data)
        })
    }, []);

    const value: CoterieContextValue = useMemo(() => {
        return {
            writeCoterieData,
            getCoterieData
        };
    }, [writeCoterieData, getCoterieData])

    return (
        <CoterieContext.Provider value={value}>
            {children}
        </CoterieContext.Provider>
    )
}

CoterieProvider.propTypes = {
    children: PropTypes.node,
}