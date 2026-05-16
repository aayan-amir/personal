import { useMemo, useState } from "react";
import Scene from "./Scene.jsx";
import {
  capabilities,
  education,
  experience,
  profile,
  projects,
  strengths,
} from "./data.js";

const projectPositions = [
  [-5.4, -2.2],
  [-3.2, 2.55],
  [0.6, -3.2],
  [3.35, 2.15],
  [5.45, -1.7],
];

const specialPortals = [
  {
    id: "skills",
    title: "Skill Vault",
    type: "Loadout",
    color: "#00ffa8",
    secondary: "#00e5ff",
    aura: "#fff36d",
    x: 0,
    z: 3.85,
  },
  {
    id: "resume",
    title: "Resume Gate",
    type: "Story",
    color: "#ff9f1c",
    secondary: "#ff4fd8",
    aura: "#00e5ff",
    x: -6.2,
    z: 1.1,
  },
  {
    id: "contact",
    title: "Contact Portal",
    type: "Exit",
    color: "#ff4fd8",
    secondary: "#fff36d",
    aura: "#00ffa8",
    x: 6.2,
    z: 1.25,
  },
];

function buildPortals() {
  const projectPortals = projects.map((project, index) => ({
    ...project,
    kind: "project",
    x: projectPositions[index][0],
    z: projectPositions[index][1],
  }));

  return [
    ...projectPortals,
    ...specialPortals.map((portal) => ({ ...portal, kind: portal.id })),
  ];
}

function getPortalCopy(portal) {
  if (portal.kind === "project") {
    return portal.playSummary ?? portal.text;
  }

  if (portal.id === "skills") {
    return "A compact loadout of the tools and systems Aayan works with.";
  }

  if (portal.id === "resume") {
    return "Work, education, and strengths in a quick playable checkpoint.";
  }

  return "Open GitHub or send an email. No phone number exposed publicly.";
}

export default function App() {
  const portals = useMemo(buildPortals, []);
  const [activePortalId, setActivePortalId] = useState(portals[0].id);
  const [discovered, setDiscovered] = useState(() => new Set([portals[0].id]));
  const [travelTarget, setTravelTarget] = useState(null);
  const [virtualMove, setVirtualMove] = useState(null);
  const [boost, setBoost] = useState(false);

  const activePortal = portals.find((portal) => portal.id === activePortalId) ?? portals[0];
  const discoveryCount = discovered.size;

  function activatePortal(id) {
    setActivePortalId(id);
    setDiscovered((current) => {
      if (current.has(id)) {
        return current;
      }
      const next = new Set(current);
      next.add(id);
      return next;
    });
  }

  function beamTo(portal) {
    setTravelTarget({ id: portal.id, x: portal.x, z: portal.z, stamp: Date.now() });
    activatePortal(portal.id);
  }

  return (
    <main
      className="game-shell"
      style={{
        "--active": activePortal.color,
        "--active-secondary": activePortal.secondary,
        "--active-aura": activePortal.aura,
      }}
    >
      <Scene
        activePortalId={activePortal.id}
        boost={boost}
        onActivate={activatePortal}
        portals={portals}
        travelTarget={travelTarget}
        virtualMove={virtualMove}
      />

      <header className="game-topbar">
        <a className="brand" href={profile.github}>
          <span>AA</span>
          <strong>{profile.name}</strong>
        </a>
        <div className="score-pill">
          <b>{discoveryCount}</b> / {portals.length} discovered
        </div>
      </header>

      <section className="start-card" aria-label="Playable instructions">
        <span>{profile.role}</span>
        <h1>Playable Portfolio</h1>
        <p>Move with WASD/arrows, click the map, or beam from the dock.</p>
      </section>

      <aside className="portal-card" aria-live="polite">
        <div className="portal-card-top">
          <span>{activePortal.type}</span>
          <button onClick={() => beamTo(activePortal)} type="button">
            Beam
          </button>
        </div>

        <h2>{activePortal.title}</h2>
        <p>{getPortalCopy(activePortal)}</p>

        {activePortal.kind === "project" && (
          <>
            <div className="mini-tags">
              {activePortal.metrics.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <a className="launch-link" href={activePortal.repo}>
              Open Repo
            </a>
          </>
        )}

        {activePortal.id === "skills" && (
          <div className="loadout-grid">
            {capabilities.slice(0, 4).map((capability) => (
              <span key={capability.label}>{capability.label}</span>
            ))}
          </div>
        )}

        {activePortal.id === "resume" && (
          <div className="resume-snapshot">
            <strong>{experience[0].company}</strong>
            <span>{experience[0].role}</span>
            <strong>{education.school}</strong>
            <span>{education.detail}</span>
            <div>
              {strengths.slice(0, 4).map((strength) => (
                <b key={strength}>{strength}</b>
              ))}
            </div>
          </div>
        )}

        {activePortal.id === "contact" && (
          <div className="contact-actions">
            <a href={profile.github}>GitHub</a>
            <a href={`mailto:${profile.email}`}>Email</a>
          </div>
        )}
      </aside>

      <nav className="portal-dock" aria-label="Portal map">
        {portals.map((portal) => (
          <button
            className={portal.id === activePortal.id ? "active" : ""}
            key={portal.id}
            onClick={() => beamTo(portal)}
            style={{ "--portal-color": portal.color }}
            type="button"
          >
            <span>{discovered.has(portal.id) ? "ON" : "NEW"}</span>
            {portal.title}
          </button>
        ))}
      </nav>

      <div className="touch-pad" aria-label="Movement controls">
        <button
          onPointerDown={() => setVirtualMove("up")}
          onPointerLeave={() => setVirtualMove(null)}
          onPointerUp={() => setVirtualMove(null)}
          type="button"
        >
          Up
        </button>
        <button
          onPointerDown={() => setVirtualMove("left")}
          onPointerLeave={() => setVirtualMove(null)}
          onPointerUp={() => setVirtualMove(null)}
          type="button"
        >
          Left
        </button>
        <button
          onPointerDown={() => setBoost(true)}
          onPointerLeave={() => setBoost(false)}
          onPointerUp={() => setBoost(false)}
          type="button"
        >
          Dash
        </button>
        <button
          onPointerDown={() => setVirtualMove("right")}
          onPointerLeave={() => setVirtualMove(null)}
          onPointerUp={() => setVirtualMove(null)}
          type="button"
        >
          Right
        </button>
        <button
          onPointerDown={() => setVirtualMove("down")}
          onPointerLeave={() => setVirtualMove(null)}
          onPointerUp={() => setVirtualMove(null)}
          type="button"
        >
          Down
        </button>
      </div>
    </main>
  );
}
