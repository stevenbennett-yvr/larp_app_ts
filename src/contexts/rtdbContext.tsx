import { app } from "./firebase";
import { getDatabase, ref, set, onValue } from "firebase/database";

// RTDB Ref

const db = getDatabase(app)

export function writeCoterieData(coterieId:string, coterie:object) {
    const reference = ref(db, "coteries/" + coterieId)
    set(reference, coterie)
}

export function getCoterieData(coterieId:string, setCoterie:Function) {
    const reference = ref(db, "coteries/" + coterieId)
    onValue(reference, (snapshot) => {
        const data = snapshot.val();
        setCoterie(data)
    })
}