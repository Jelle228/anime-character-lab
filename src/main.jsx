import React, { useMemo, useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

function uid() {
  return Math.random().toString(36).slice(2, 10);
}
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const STORAGE_KEY = "acl_library_v1";

function loadLibrary() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}
function saveLibrary(lib) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lib));
}

function generateCore() {
  const names = ["Kaito", "Rin", "Sora", "Yumi", "Akira", "Nana", "Haru", "Ren", "Mika", "Tsubasa"];
  const surnames = ["Shimizu", "Kurogane", "Amano", "Hoshino", "Kanzaki", "Takeda", "Mizuhara"];
  const aliases = ["Signal Breaker", "Neon Warden", "Echo Runner", "Null Shade", "Haze Driver"];
  const vibes = ["Stoic", "Chaotic", "Serious", "Mysterious", "Playful"];
  const archetypes = ["Protagonist", "Rival", "Mentor", "Anti-hero", "Trickster", "Sidekick"];
  const alignments = ["Good", "Neutral", "Grey", "Ruthless"];

  return {
    name: `${pick(names)} ${pick(surnames)}`,
    alias: pick(aliases),
    vibe: pick(vibes),
    archetype: pick(archetypes),
    alignment: pick(alignments),
    powerLevel: pick([3, 4, 5, 6, 7, 8]),
  };
}

function defaultOutfit() {
  const palettes = [
    ["black", "gray", "teal"],
    ["black", "off-white", "cyan"],
    ["black", "gray", "violet"],
    ["black", "gray", "red"],
  ];
  const tops = ["Oversized hoodie", "Mock-neck sweater", "Longline tee"];
  const bottoms = ["Slim tech pants", "Minimal cargo pants", "Wide urban pants"];
  const outers = ["Long urban coat", "Hooded coat", "Half-cape drape"];
  const accessories = ["Anomaly scarf", "Utility harness", "Tech earpiece", "Half-face mask"];

  return {
    stylePack: "Urban Anomaly",
    palette: pick(palettes),
    top: pick(tops),
    bottom: pick(bottoms),
    outer: pick(outers),
    accessory: pick(accessories),
    modifiers: [],
  };
}

function App() {
  // Body settings
  const [age, setAge] = useState(19);
  const [gender, setGender] = useState("female"); // male | female | androgynous
  const [height, setHeight] = useState("average");
  const [build, setBuild] = useState("athletic");
  const [chest, setChest] = useState("average"); // only if female + age>=18

  const showChest = useMemo(() => gender === "female" && age >= 18, [gender, age]);

  useEffect(() => {
    if (!showChest) setChest("");
    if (showChest && !chest) setChest("average");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showChest]);

  // Character state
  const [core, setCore] = useState(() => generateCore());
  const [outfit, setOutfit] = useState(() => defaultOutfit());

  // Library
  const [library, setLibrary] = useState(() => loadLibrary());
  const [selectedId, setSelectedId] = useState("");

  function generateAll() {
    setCore(generateCore());
    setOutfit(defaultOutfit());
  }

  function saveCurrent() {
    const entry = {
      id: uid(),
      createdAt: new Date().toISOString(),
      core,
      body: { age, gender, height, build, chest: showChest ? chest : "" },
      outfit,
    };
    const next = [entry, ...library].slice(0, 200);
    setLibrary(next);
    saveLibrary(next);
    setSelectedId(entry.id);
  }

  function loadSelected(id) {
    const found = library.find((x) => x.id === id);
    if (!found) return;
    setSelectedId(id);
    setCore(found.core);
    setOutfit(found.outfit);
    setAge(found.body.age);
    setGender(found.body.gender);
    setHeight(found.body.height);
    setBuild(found.body.build);
    setChest(found.body.chest || "");
  }

  function deleteSelected() {
    if (!selectedId) return;
    const next = library.filter((x) => x.id !== selectedId);
    setLibrary(next);
    saveLibrary(next);
    setSelectedId("");
  }

  function clearAll() {
    setLibrary([]);
    saveLibrary([]);
    setSelectedId("");
  }

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
      <div style={{ color: "#666", marginBottom: 14 }}>Local • Offline • Private</div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
        <button onClick={generateAll}>Generate</button>
        <button onClick={saveCurrent}>Save</button>
        <button onClick={deleteSelected} disabled={!selectedId}>
          Delete selected
        </button>
        <button onClick={clearAll} disabled={library.length === 0}>
          Clear library
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          gap: 18,
          alignItems: "start",
        }}
      >
        {/* Preview placeholder */}
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

        <div style={{ display: "grid", gap: 12 }}>
          {/* Settings */}
          <div style={{ border: "1px solid #e5e5e5", borderRadius: 16, padding: 16, background: "white" }}>
            <h2 style={{ marginTop: 0 }}>Character Settings</h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
              <label style={{ display: "grid", gap: 6 }}>
                Age: {age}
                <input type="range" min="12" max="30" value={age} onChange={(e) => setAge(parseInt(e.target.value, 10))} />
                <div style={{ fontSize: 12, color: "#666" }}>
                  Chest size appears only for female + age ≥ 18.
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

            {/* ✅ This is the block you were looking for */}
            <h3 style={{ margin: "0 0 8px" }}>Current profile (text)</h3>
            <div style={{ lineHeight: 1.55 }}>
              <div><b>Age:</b> {age}</div>
              <div><b>Gender:</b> {gender}</div>
              <div><b>Height:</b> {height}</div>
              <div><b>Build:</b> {build}</div>
              <div><b>Chest:</b> {showChest ? chest : "—"}</div>
            </div>
          </div>

          {/* Current Character */}
          <div style={{ border: "1px solid #e5e5e5", borderRadius: 16, padding: 16, background: "white" }}>
            <h2 style={{ marginTop: 0 }}>Current Character</h2>
            <div style={{ lineHeight: 1.55 }}>
              <div><b>Name:</b> {core.name}</div>
              <div><b>Alias:</b> {core.alias}</div>
              <div><b>Archetype:</b> {core.archetype} • <b>Vibe:</b> {core.vibe}</div>
              <div><b>Alignment:</b> {core.alignment} • <b>Power:</b> {core.powerLevel}</div>
              <hr style={{ margin: "12px 0", border: "none", borderTop: "1px solid #eee" }} />
              <div><b>Outfit:</b> {outfit.stylePack}</div>
              <div><b>Palette:</b> {outfit.palette.join(", ")}</div>
              <div><b>Top:</b> {outfit.top}</div>
              <div><b>Bottom:</b> {outfit.bottom}</div>
              <div><b>Outer:</b> {outfit.outer}</div>
              <div><b>Accessory:</b> {outfit.accessory}</div>
            </div>
          </div>

          {/* Library */}
          <div style={{ border: "1px solid #e5e5e5", borderRadius: 16, padding: 16, background: "white" }}>
            <h2 style={{ marginTop: 0 }}>Library (local)</h2>
            <div style={{ color: "#666", fontSize: 12, marginBottom: 8 }}>
              Saved to your browser (localStorage). Each device has its own library.
            </div>

            {library.length === 0 ? (
              <div style={{ color: "#777" }}>No saved characters yet.</div>
            ) : (
              <label style={{ display: "grid", gap: 6 }}>
                Select saved character
                <select value={selectedId} onChange={(e) => loadSelected(e.target.value)}>
                  <option value="">— choose —</option>
                  {library.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.core.name} • {new Date(x.createdAt).toLocaleString()}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 14, color: "#666", fontSize: 12 }}>
        Next: add Evolve (versioning) + SVG layered preview.
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
