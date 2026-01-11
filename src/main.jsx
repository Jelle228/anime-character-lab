import React from "react";
import ReactDOM from "react-dom/client";

const App = () => (
  <div style={{ padding: 24 }}>
    <h1>Anime Character Lab</h1>
    <p>Project setup successful ✅</p>
  </div>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
