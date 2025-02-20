import React from "react";
import ReactDOM from "react-dom/client"; // <-- Fix: Use createRoot
import App from "./App";
import { AuthProvider } from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root")); // <-- Fix: Use createRoot
root.render(
    <React.StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>
);
