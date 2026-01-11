import React from "react";
import ReactDOM from "react-dom/client";

const App = () => (
  <div>
    <div
      style={{
        width: 280,
        height: 420,
        border: "2px dashed #bbb",
        borderRadius: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
        color: "#777"
      }}
    >
      Character Preview
    </div>

    <div style={{ padding: 24 }}>
      <h1>Anime Character Lab</h1>
      <p>Project setup successful ✅</p>
    </div>
  </div>
);


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
