import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles/global.css";

// A reload always opens on the hero, never part-way down the homepage's 17000px
// scroll timeline. This has to run at module scope rather than from an effect:
// the browser can only restore a deep scroll once the document is tall enough,
// which is the moment the track renders — an effect would be racing that, this
// is safely ahead of it.
if ("scrollRestoration" in history) history.scrollRestoration = "manual";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
