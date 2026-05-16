import { useMemo, useState } from "react";
import Scene from "./Scene.jsx";
import {
  capabilities,
  education,
  experience,
  profile,
  projects,
  strengths,
  timeline,
} from "./data.js";

export default function App() {
  const [activeId, setActiveId] = useState(projects[0].id);
  const [scannerOn, setScannerOn] = useState(true);
  const [boostOn, setBoostOn] = useState(false);

  const activeProject = useMemo(
    () => projects.find((project) => project.id === activeId) ?? projects[0],
    [activeId],
  );

  function selectByIndex(index) {
    const project = projects[index];
    if (project) {
      setActiveId(project.id);
    }
  }

  return (
    <main className="stage" aria-label="Aayan Amir interactive portfolio">
      <Scene
        activeId={activeId}
        boostOn={boostOn}
        scannerOn={scannerOn}
        onSelect={setActiveId}
        onSelectIndex={selectByIndex}
        projects={projects}
      />

      <div className="scanlines" aria-hidden="true" />

      <header className="topbar">
        <a className="brand" href="#home" aria-label="Aayan Amir home">
          <span className="brand-mark">AA</span>
          <span>
            <strong>{profile.name}</strong>
            <small>{profile.domain}</small>
          </span>
        </a>
        <nav aria-label="Portfolio links">
          <a href={profile.github}>GitHub</a>
          <a href={`mailto:${profile.email}`}>Contact</a>
        </nav>
      </header>

      <section className="hero" id="home">
        <p className="eyebrow">{profile.role} / {profile.location}</p>
        <h1>{profile.name}</h1>
        <p className="intro">{profile.headline}</p>
        <p className="summary">{profile.summary}</p>

        <div className="actions" aria-label="Primary links">
          <a className="button primary" href={activeProject.repo}>
            Open Active Repo
          </a>
          <button
            className="button"
            type="button"
            onClick={() => setBoostOn((value) => !value)}
          >
            {boostOn ? "Boost On" : "Boost Off"}
          </button>
          <button
            className="button"
            type="button"
            onClick={() => setScannerOn((value) => !value)}
          >
            {scannerOn ? "Scanner On" : "Scanner Off"}
          </button>
        </div>
      </section>

      <aside className="mission-panel" aria-label="Selected project">
        <div className="panel-kicker">
          <span>{activeProject.number}</span>
          <span>{activeProject.type}</span>
        </div>
        <h2>{activeProject.title}</h2>
        <p>{activeProject.text}</p>
        <div className="chip-row" aria-label="Technology stack">
          {activeProject.stack.map((item) => (
            <span className="chip" key={item}>
              {item}
            </span>
          ))}
        </div>
        <div className="stat-grid">
          {activeProject.stats.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </aside>

      <section className="project-dock" aria-label="Project selector">
        {projects.map((project, index) => (
          <button
            className={project.id === activeId ? "dock-item active" : "dock-item"}
            key={project.id}
            onClick={() => setActiveId(project.id)}
            style={{ "--project-color": project.color }}
            type="button"
          >
            <span>{index + 1}</span>
            <strong>{project.title}</strong>
          </button>
        ))}
      </section>

      <section className="systems">
        <div className="systems-copy">
          <p className="eyebrow">Professional summary</p>
          <h2>Business software with game-interface energy.</h2>
          <p>
            Your CV and GitHub history point in the same direction: inventory,
            POS, ERP modules, authentication, RBAC, dashboards, reports, CRUD
            apps, databases, and production-minded workflows.
          </p>
        </div>

        <div className="capability-grid" aria-label="Capabilities">
          {capabilities.map((capability) => (
            <span key={capability}>{capability}</span>
          ))}
        </div>
      </section>

      <section className="resume-grid" aria-label="Resume details">
        <div className="resume-column">
          <p className="eyebrow">Experience</p>
          {experience.map((item) => (
            <article className="resume-card" key={`${item.company}-${item.role}`}>
              <div>
                <h3>{item.role}</h3>
                <span>
                  {item.company} / {item.location} / {item.dates}
                </span>
              </div>
              <ul>
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="resume-column">
          <p className="eyebrow">Education</p>
          <article className="resume-card education-card">
            <h3>{education.degree}</h3>
            <span>{education.school}</span>
            <p>{education.detail}</p>
            <p>{education.focus}</p>
          </article>

          <p className="eyebrow strengths-title">Strengths</p>
          <div className="strength-grid">
            {strengths.map((strength) => (
              <span key={strength}>{strength}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="timeline" aria-label="Recent GitHub activity">
        <p className="eyebrow">Recent GitHub signal</p>
        <div className="timeline-list">
          {timeline.map((item) => (
            <article key={`${item.repo}-${item.title}`}>
              <span>{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.repo}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <span>Use mouse movement, click the 3D nodes, or press 1-5.</span>
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
      </footer>
    </main>
  );
}
