import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getDatabase,
    ref,
    push,
    set,
    onValue,
    update
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";


let firebaseConfig = {
    apiKey: "",
    authDomain: "reflex-779d1.firebaseapp.com",
    databaseURL: "https://reflex-779d1-default-rtdb.firebaseio.com",
    projectId: "reflex-779d1",
    storageBucket: "reflex-779d1.firebasestorage.app",
    messagingSenderId: "863266679437",
    appId: "1:863266679437:web:48ae4e8889632a7391d0c4",
    measurementId: "G-QRW0KBDJR6"
};

try {
    const res = await fetch("/api/config");
    if (res.ok) {
        const config = await res.json();
        firebaseConfig = { ...firebaseConfig, ...config };
    }
} catch (err) {
    console.warn("Could not load /api/config, falling back to default config", err);
}

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);


export {
    db,
    ref,
    push,
    set,
    onValue,
    update
};
