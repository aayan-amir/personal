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
    title: "Skills",
    type: "Loadout",
    color: "#14f195",
    secondary: "#19d7ff",
    aura: "#f8d84a",
    x: 0,
    z: 3.85,
  },
  {
    id: "resume",
    title: "Resume",
    type: "Story",
    color: "#f8d84a",
    secondary: "#7c5cff",
    aura: "#19d7ff",
    x: -6.2,
    z: 1.1,
  },
  {
    id: "contact",
    title: "Contact",
    type: "Exit",
    color: "#7c5cff",
    secondary: "#19d7ff",
    aura: "#f8d84a",
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
    return "Frontend, backend, data, systems, desktop, and IT support.";
  }

  if (portal.id === "resume") {
    return "Experience, education, and strengths in one quick checkpoint.";
  }

  return "Open GitHub or send an email.";
}

export default function App() {
  const portals = useMemo(buildPortals, []);
  const [activePortalId, setActivePortalId] = useState(portals[0].id);
  const [discovered, setDiscovered] = useState(() => new Set([portals[0].id]));
  const [travelTarget, setTravelTarget] = useState(null);

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
        boost={false}
        onActivate={activatePortal}
        portals={portals}
        travelTarget={travelTarget}
        virtualMove={null}
      />

      <header className="game-topbar">
        <a className="brand" href={profile.github}>
          <span>AA</span>
          <strong>{profile.name}</strong>
        </a>
        <div className="score-pill">
          <b>{discoveryCount}</b> / {portals.length} visited
        </div>
      </header>

      <section className="start-card" aria-label="Playable instructions">
        <span>{profile.role}</span>
        <h1>Aayan's Dev Arcade</h1>
        <p>Move with WASD/arrows. On phone, tap the map or use the dock.</p>
      </section>

      <aside className="portal-card" aria-live="polite">
        <div className="portal-card-top">
          <span>{activePortal.type}</span>
          <button onClick={() => beamTo(activePortal)} type="button">
            Go
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
              View Repo
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
            <span>{discovered.has(portal.id) ? "OK" : "NEW"}</span>
            {portal.title}
          </button>
        ))}
      </nav>
    </main>
  );
}
