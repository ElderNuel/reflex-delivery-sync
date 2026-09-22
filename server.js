import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = "0.0.0.0";

app.use(express.json());

// API route to provide Firebase configuration from environment variables
app.get("/api/config", (req, res) => {
  res.json({
    apiKey: process.env.FIREBASE_API_KEY || "AIzaSyAwtJj_eRuROtBoLdek-TLxLqRC4lOc3cM",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "reflex-779d1.firebaseapp.com",
    databaseURL: process.env.FIREBASE_DATABASE_URL || "https://reflex-779d1-default-rtdb.firebaseio.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "reflex-779d1",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "reflex-779d1.firebasestorage.app",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "863266679437",
    appId: process.env.FIREBASE_APP_ID || "1:863266679437:web:48ae4e8889632a7391d0c4",
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-QRW0KBDJR6"
  });
});

// Serve all static files from root directory with html and js extensions enabled
app.use(express.static(__dirname, { extensions: ["html", "js"] }));

// Explicit route handlers for all application views and assets
app.get(["/simulator", "/simulator/", "/simulator.html", "/simulator/index.html"], (req, res) => {
  res.sendFile(path.join(__dirname, "simulator", "index.html"));
});

app.get(["/retailer", "/retailer/", "/retailer/index.html"], (req, res) => {
  res.sendFile(path.join(__dirname, "retailer", "index.html"));
});

app.get(["/dispatcher", "/dispatcher/", "/dispatcher/index.html"], (req, res) => {
  res.sendFile(path.join(__dirname, "dispatcher", "index.html"));
});

app.get(["/rider", "/rider/", "/rider/index.html"], (req, res) => {
  res.sendFile(path.join(__dirname, "rider", "index.html"));
});

app.get("/qr-utils.js", (req, res) => {
  res.sendFile(path.join(__dirname, "qr-utils.js"));
});

app.get("/firebase.js", (req, res) => {
  res.sendFile(path.join(__dirname, "firebase.js"));
});

// Fallback for SPA/direct navigation to index
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Export default app for Vercel Serverless Function support
export default app;

app.listen(PORT, HOST, () => {
  console.log(`Reflex delivery coordination server running at http://${HOST}:${PORT}`);
});
