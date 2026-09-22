export default function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
  
  res.status(200).json({
    apiKey: process.env.FIREBASE_API_KEY || "AIzaSyAwtJj_eRuROtBoLdek-TLxLqRC4lOc3cM",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "reflex-779d1.firebaseapp.com",
    databaseURL: process.env.FIREBASE_DATABASE_URL || "https://reflex-779d1-default-rtdb.firebaseio.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "reflex-779d1",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "reflex-779d1.firebasestorage.app",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "863266679437",
    appId: process.env.FIREBASE_APP_ID || "1:863266679437:web:48ae4e8889632a7391d0c4",
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-QRW0KBDJR6"
  });
}
