import React, { useMemo, useState } from "react";
import ReactDOM from "react-dom/client";

function App() {
  const [age, setAge] = useState(19);
  const [gender, setGender] = useState("male"); // male | female | androgynous
  const [height, setHeight] = useState("average"); // short | average | tall
  const [build, setBuild] = useState("athletic"); // slim | athletic | muscular | curvy | broad
  const [chest, setChest] = useState("average"); // flat | average | full (only if female + age>=18)

  const showChest = useMemo(() => gender === "female" && age >= 18, [gender, age]);

  // If the user changes to a state where chest should not apply, clear it safely
  React.useEffect(() => {
    if (!showChest) setChest("");
    if (showChest && !chest) setChest("average");
  }, [showChest]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      style={{
        padding: 24,
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <h1 style={{ marginBottom: 6 }}>Anime Character Lab</h1>
      <div style={{ color: "#666", marginBottom: 18 }}>
        Local • Offline • Private
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          gap: 18,
          alignItems: "start",
        }}
      >
        {/* Preview */}
        <div
          style={{
            width: 320,
            height: 460,
            border: "2px dashed #bbb",
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#777",
            background: "#fafafa",
          }}
        >
          Character Preview (SVG later)
        </div>

        {/* Controls + Info */}
        <div
          style={{
            border: "1px solid #e5e5e5",
            borderRadius: 16,
            padding: 16,
            background: "white",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Character Settings</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 12,
            }}
          >
            <label style={{ display: "grid", gap: 6 }}>
              Age: {age}
              <input
                type="range"
                min="12"
                max="30"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value, 10))}
              />
              <div style={{ fontSize: 12, color: "#666" }}>
                Chest size option appears only for female + age ≥ 18.
              </div>
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              Gender presentation
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="androgynous">Androgynous / Non-binary</option>
              </select>
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              Height
              <select value={height} onChange={(e) => setHeight(e.target.value)}>
                <option value="short">Short</option>
                <option value="average">Average</option>
                <option value="tall">Tall</option>
              </select>
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              Build
              <select value={build} onChange={(e) => setBuild(e.target.value)}>
                <option value="slim">Slim</option>
                <option value="athletic">Athletic</option>
                <option value="muscular">Muscular</option>
                <option value="curvy">Curvy</option>
                <option value="broad">Broad</option>
              </select>
            </label>

            {showChest ? (
              <label style={{ display: "grid", gap: 6 }}>
                Chest size (adult feminine body)
                <select value={chest} onChange={(e) => setChest(e.target.value)}>
                  <option value="flat">Flat</option>
                  <option value="average">Average</option>
                  <option value="full">Full</option>
                </select>
              </label>
            ) : (
              <div style={{ fontSize: 12, color: "#777", paddingTop: 26 }}>
                Chest size hidden (requires female + age ≥ 18)
              </div>
            )}
          </div>

          <hr style={{ margin: "16px 0", border: "none", borderTop: "1px solid #eee" }} />

          <h3 style={{ margin: 0 }}>Current profile (text)</h3>
          <div style={{ color: "#444", marginTop: 8, lineHeight: 1.5 }}>
            <div><b>Age:</b> {age}</div>
            <div><b>Gender:</b> {gender}</div>
            <div><b>Height:</b> {height}</div>
            <div><b>Build:</b> {build}</div>
            <div><b>Chest:</b> {showChest ? chest : "—"}</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 14, color: "#666", fontSize: 12 }}>
        Next: connect these settings to outfit selection + SVG layers.
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
