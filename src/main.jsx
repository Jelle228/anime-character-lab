import React, { useMemo, useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

function uid(prefix = "char") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 6)}`;
}
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const STORAGE_KEY = "acl_library_v2";

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
    accessory: pick(accessories), // anchor by default
    modifiers: [],
  };
}

function evolveOutfit(prev, stage) {
  const next = {
    ...prev,
    palette: [...prev.palette],
    modifiers: Array.isArray(prev.modifiers) ? [...prev.modifiers] : [],
  };

  // Anchor rule: keep the accessory (signature item)
  const anchor = prev.accessory;
  next.accessory = anchor;

  const palettes = {
    start: [["black", "gray", "teal"], ["black", "off-white", "cyan"]],
    mid: [["black", "gray", "teal"], ["black", "gray", "violet"]],
    power: [["black", "gray", "teal"], ["black", "off-white", "cyan"]],
    dark: [["black", "gray", "red"], ["black", "black", "violet"]],
    timeskip: [["black", "off-white", "teal"], ["black", "gray", "cyan"]],
  };
  next.palette = pick(palettes[stage] || palettes.mid);

  const outersByStage = {
    start: ["Minimal blazer", "Short coat", "Long urban coat"],
    mid: ["Long urban coat", "Hooded coat", "Detachable-sleeve jacket"],
    power: ["Hooded coat", "Long urban coat", "Half-cape drape"],
    dark: ["Hooded coat", "Long urban coat", "Half-cape drape"],
    timeskip: ["Minimal blazer", "Short coat", "Long urban coat"],
  };

  // fallback options if some names aren't in your earlier list (safe)
  const safeOuterPool = ["Long urban coat", "Hooded coat", "Half-cape drape", "Short coat", "Minimal blazer", "Detachable-sleeve jacket"];
  const pool = outersByStage[stage] || safeOuterPool;
  next.outer = pick(pool);

  const addOnce = (m) => {
    if (!next.modifiers.includes(m)) next.modifiers.push(m);
  };

  // Stage modifier logic
  if (stage === "start") {
    // Keep it simple: max 1 modifier
    next.modifiers = next.modifiers.slice(0, 1);
  } else if (stage === "mid") {
    addOnce("wearState");
  } else if (stage === "power") {
    addOnce("glowSeams");
  } else if (stage === "dark") {
    addOnce("corruption");
    // dark often includes wear
    addOnce("wearState");
  } else if (stage === "timeskip") {
    // cleaner: remove corruption if present
    next.modifiers = next.modifiers.filter((m) => m !== "corruption");
  }

  return next;
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

  // Versioning state
  const [arcStage, setArcStage] = useState("mid"); // start | mid | power | dark | timeskip
  const [currentMeta, setCurrentMeta] = useState({
    id: "",
    version: 1,
    parentId: "",
  });

  // Library
  const [library, setLibrary] = useState(() => loadLibrary());
  const [selectedId, setSelectedId] = useState("");

  function generateAll() {
    setCore(generateCore());
    setOutfit(defaultOutfit());
    setArcStage("mid");
    setSelectedId("");
    setCurrentMeta({ id: "", version: 1, parentId: "" });
  }

  function buildEntry({ id, version, parentId }) {
    return {
      id,
      parentId: parentId || "",
      version: version || 1,
      createdAt: new Date().toISOString(),
      arcStage,
      core,
      body: { age, gender, height, build, chest: showChest ? chest : "" },
      outfit,
    };
  }

  function saveCurrent({ version = 1, parentId = "" } = {}) {
    const entry = buildEntry({ id: uid(), version, parentId });
    const next = [entry, ...library].slice(0, 300);
    setLibrary(next);
    saveLibrary(next);
    setSelectedId(entry.id);
    setCurrentMeta({ id: entry.id, version: entry.version, parentId: entry.parentId || "" });
  }

  function evolveCurrent() {
    // Parent is the currently selected saved character, if any
    const parent = selectedId ? library.find((x) => x.id === selectedId) : null;
    const parentId = parent ? parent.id : currentMeta.id || "";
    const nextVersion = parent ? (parent.version + 1) : (currentMeta.version + 1);

    const evolvedOutfit = evolveOutfit(outfit, arcStage);
    setOutfit(evolvedOutfit);

    const entry = {
      id: uid(),
      parentId: parentId || "",
      version: nextVersion || 2,
      createdAt: new Date().toISOString(),
      arcStage,
      core,
      body: { age, gender, height, build, chest: showChest ? chest : "" },
      outfit: evolvedOutfit,
    };

    const next = [entry, ...library].slice(0, 300);
    setLibrary(next);
    saveLibrary(next);
    setSelectedId(entry.id);
    setCurrentMeta({ id: entry.id, version: entry.version, parentId: entry.parentId || "" });
  }

  function loadSelected(id) {
    const found = library.find((x) => x.id === id);
    if (!found) return;

    setSelectedId(id);
    setCore(found.core);
    setOutfit(found.outfit);
    setArcStage(found.arcStage || "mid");

    setAge(found.body.age);
    setGender(found.body.gender);
    setHeight(found.body.height);
    setBuild(found.body.build);
    setChest(found.body.chest || "");

    setCurrentMeta({ id: found.id, version: found.version || 1, parentId: found.parentId || "" });
  }

  function deleteSelected() {
    if (!selectedId) return;
    const next = library.filter((x) => x.id !== selectedId);
    setLibrary(next);
    saveLibrary(next);
    setSelectedId("");
    setCurrentMeta({ id: "", version: 1, parentId: "" });
  }

  function clearAll() {
    setLibrary([]);
    saveLibrary([]);
    setSelectedId("");
    setCurrentMeta({ id: "", version: 1, parentId: "" });
  }

  // Show quick version chain info for selected
  const childrenCount = useMemo(() => {
  if (!currentMeta.id) return 0;
  return library.filter((x) => x.parentId === currentMeta.id).length;
}, [library, currentMeta.id]);

const parentEntry = useMemo(() => {
  if (!currentMeta.parentId) return null;
  return library.find((x) => x.id === currentMeta.parentId) || null;
}, [library, currentMeta.parentId]);

const childrenEntries = useMemo(() => {
  if (!currentMeta.id) return [];
  return library
    .filter((x) => x.parentId === currentMeta.id)
    .sort((a, b) => (b.version || 1) - (a.version || 1));
}, [library, currentMeta.id]);


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

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14, alignItems: "center" }}>
        <button onClick={generateAll}>Generate</button>
        <button onClick={() => saveCurrent({ version: currentMeta.version || 1, parentId: currentMeta.parentId || "" })}>
          Save
        </button>

        <button onClick={evolveCurrent}>Evolve</button>

        <label style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
          Arc:
          <select value={arcStage} onChange={(e) => setArcStage(e.target.value)}>
            <option value="start">start</option>
            <option value="mid">mid</option>
            <option value="power">power</option>
            <option value="dark">dark</option>
            <option value="timeskip">timeskip</option>
          </select>
        </label>

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
 <div
  style={{
    height: "100%",
    display: "grid",
    gridTemplateRows: "1fr auto",
    gap: 10,
  }}
>
  <div
    style={{
      background: "white",
      border: "1px solid #eee",
      borderRadius: 14,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        width: build === "slim" ? 120 : build === "broad" ? 155 : build === "muscular" ? 145 : build === "curvy" ? 140 : 135,
        height: height === "tall" ? 320 : height === "short" ? 260 : 290,
        borderRadius: 999,
        background: "#1b1b1b",
        position: "relative",
      }}
    >
      {/* accent belt */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 165,
          transform: "translateX(-50%)",
          width: "70%",
          height: 10,
          borderRadius: 999,
          background:
            outfit.palette?.[2] === "red"
              ? "#ff3b5c"
              : outfit.palette?.[2] === "violet"
              ? "#a26bff"
              : outfit.palette?.[2] === "cyan"
              ? "#3bd6ff"
              : "#2fe6c8",
          opacity: 0.9,
        }}
      />
    </div>
  </div>

  <div style={{ fontSize: 12, color: "#666", lineHeight: 1.4 }}>
    <div><b>Visual preview:</b> silhouette placeholder</div>
    <div><b>Anchor:</b> {outfit.accessory}</div>
    <div><b>Palette:</b> {outfit.palette.join(", ")}</div>
    <div><b>Modifiers:</b> {outfit.modifiers?.length ? outfit.modifiers.join(", ") : "—"}</div>
  </div>
</div>

  </div>

  <div style={{ fontSize: 12, color: "#666", lineHeight: 1.4 }}>
    <div><b>Height:</b> {height}</div>
    <div><b>Build:</b> {build}</div>
    <div><b>Accent:</b> {outfit.palette?.[2]}</div>
    <div><b>Anchor:</b> {outfit.accessory}</div>
    <div><b>Modifiers:</b> {outfit.modifiers?.length ? outfit.modifiers.join(", ") : "—"}</div>
  </div>
</div>
  <div style={{ display: "grid", gap: 12 }}>

  {/* Info */}
  <div style={{ fontSize: 12, color: "#666", lineHeight: 1.4 }}>
    <div><b>Visual preview:</b> silhouette placeholder</div>
    <div><b>Anchor:</b> {outfit.accessory}</div>
    <div><b>Palette:</b> {outfit.palette.join(", ")}</div>
    <div><b>Modifiers:</b> {outfit.modifiers.length ? outfit.modifiers.join(", ") : "—"}</div>
  </div>
  </div>


            <hr style={{ margin: "16px 0", border: "none", borderTop: "1px solid #eee" }} />

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

              <div><b>Arc stage:</b> {arcStage}</div>
              <div><b>Version:</b> {currentMeta.version}{currentMeta.parentId ? ` (parent: ${currentMeta.parentId})` : ""}</div>
              <div><b>Children:</b> {childrenCount}</div>

<hr style={{ margin: "12px 0", border: "none", borderTop: "1px solid #eee" }} />

<h3 style={{ margin: "0 0 8px" }}>Version tree</h3>

{parentEntry ? (
  <div style={{ marginBottom: 8 }}>
    <div style={{ fontSize: 12, color: "#666" }}>Parent</div>
    <button
      style={{ padding: "6px 10px", borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" }}
      onClick={() => parentEntry && loadSelected(parentEntry.id)}
    >
      {parentEntry.core.name} • v{parentEntry.version || 1} • {parentEntry.arcStage || "mid"}
    </button>
  </div>
) : (
  <div style={{ fontSize: 12, color: "#777", marginBottom: 8 }}>No parent (base version)</div>
)}

{childrenEntries.length ? (
  <div>
    <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>Children</div>
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {childrenEntries.map((c) => (
        <button
          key={c.id}
          style={{ padding: "6px 10px", borderRadius: 10, border: "1px solid #ddd", cursor: "pointer" }}
          onClick={() => c?.id && loadSelected(c.id)}
        >
          v{c.version || 1} • {c.arcStage || "mid"}
        </button>
      ))}
    </div>
  </div>
) : (
  <div style={{ fontSize: 12, color: "#777" }}>No children yet. Try Evolve.</div>
)}


              <hr style={{ margin: "12px 0", border: "none", borderTop: "1px solid #eee" }} />

              <div><b>Outfit:</b> {outfit.stylePack}</div>
              <div><b>Palette:</b> {outfit.palette.join(", ")}</div>
              <div><b>Top:</b> {outfit.top}</div>
              <div><b>Bottom:</b> {outfit.bottom}</div>
              <div><b>Outer:</b> {outfit.outer}</div>
              <div><b>Accessory (anchor):</b> {outfit.accessory}</div>
              <div><b>Modifiers:</b> {outfit.modifiers.length ? outfit.modifiers.join(", ") : "—"}</div>
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
  {x.core.name} • v{(x.version ?? 1)} • {(x.arcStage ?? "mid")} • {new Date(x.createdAt).toLocaleString()}
</option>


                  ))}
                </select>
              </label>
            )}

            <div style={{ marginTop: 10, fontSize: 12, color: "#666" }}>
              Tip: Save a base character, then pick an arc stage and click <b>Evolve</b> to generate version 2, 3, …
      </div>
    </div>

    <div style={{ marginTop: 14, color: "#666", fontSize: 12 }}>
      Next: show a simple version tree list (parent + children) and then replace the preview with SVG layers.
    </div>
  </div>
);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
