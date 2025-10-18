import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

// Vi importerer din nye komponent her
import RoofingCalculator from "./RoofingCalculator";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    {/* Vi fortæller appen, at den skal vise din RoofingCalculator */}
    <RoofingCalculator />
  </React.StrictMode>

