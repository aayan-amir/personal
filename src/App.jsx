import { useEffect, useMemo, useState } from "react";
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

const modes = ["Projects", "Skills", "Resume"];
const skillGroups = ["All", "Frontend", "Backend", "Data", "Systems", "Desktop", "IT"];

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mode, setMode] = useState(modes[0]);
  const [skillGroup, setSkillGroup] = useState(skillGroups[0]);
  const [powerOn, setPowerOn] = useState(true);
  const [openExperience, setOpenExperience] = useState(0);

  const activeProject = projects[activeIndex];
  const filteredCapabilities = useMemo(
    () =>
      skillGroup === "All"
        ? capabilities
        : capabilities.filter((capability) => capability.group === skillGroup),
    [skillGroup],
  );

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "ArrowRight") {
        setActiveIndex((value) => (value + 1) % projects.length);
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((value) => (value - 1 + projects.length) % projects.length);
      }
      const number = Number(event.key);
      if (number >= 1 && number <= projects.length) {
        setActiveIndex(number - 1);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <main
      className="site-shell"
      style={{
        "--active": activeProject.color,
        "--active-secondary": activeProject.secondary,
        "--active-aura": activeProject.aura,
      }}
    >
      <Scene activeProject={activeProject} powerOn={powerOn} projects={projects} />

      <header className="topbar">
        <a className="brand" href="#home" aria-label="Aayan Amir home">
          <span className="brand-mark">AA</span>
          <span>
            <strong>{profile.name}</strong>
            <small>{profile.role}</small>
          </span>
        </a>

        <nav aria-label="Portfolio sections">
          {modes.map((item) => (
            <button
              className={mode === item ? "nav-pill active" : "nav-pill"}
              key={item}
              onClick={() => setMode(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </nav>
      </header>

      <section className="hero" id="home">
        <div className="hero-copy">
          <span className="level-tag">{profile.location}</span>
          <h1>{profile.name}</h1>
          <p className="hero-line">{profile.headline}</p>
          <div className="hero-actions" aria-label="Main actions">
            <a className="mega-button" href={activeProject.repo}>
              Launch {activeProject.title}
            </a>
            <button
              className={powerOn ? "mega-button ghost active" : "mega-button ghost"}
              onClick={() => setPowerOn((value) => !value)}
              type="button"
            >
              Neon Engine
            </button>
          </div>
        </div>

        <div className="player-card" aria-label="Current player profile">
          <span>Player Card</span>
          <strong>{profile.role}</strong>
          <p>{profile.summary}</p>
          <div className="meter-row">
            <span>BSCS</span>
            <span>CGPA 3.62</span>
            <span>CCNA Track</span>
          </div>
        </div>
      </section>

      <section className="level-select" aria-label="Project level select">
        <div className="section-title">
          <span>Project Worlds</span>
          <h2>Pick a level. The whole scene changes.</h2>
        </div>

        <div className="level-grid">
          {projects.map((project, index) => (
            <button
              className={activeIndex === index ? "level-card active" : "level-card"}
              key={project.id}
              onClick={() => setActiveIndex(index)}
              style={{
                "--card-color": project.color,
                "--card-secondary": project.secondary,
              }}
              type="button"
            >
              <span>{project.number}</span>
              <strong>{project.title}</strong>
              <small>{project.type}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="project-stage" aria-label="Active project details">
        <div className="project-marquee">
          <span>{activeProject.type}</span>
          <h2>{activeProject.title}</h2>
        </div>

        <div className="project-info">
          <p>{activeProject.text}</p>
          <div className="tag-wall" aria-label="Technology stack">
            {activeProject.stack.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>

        <div className="achievement-strip" aria-label="Project highlights">
          {activeProject.stats.map((item) => (
            <button key={item} type="button">
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className={mode === "Skills" ? "mode-panel show" : "mode-panel"}>
        <div className="section-title">
          <span>Skill Mixer</span>
          <h2>Switch the loadout.</h2>
        </div>

        <div className="filter-row" aria-label="Skill filters">
          {skillGroups.map((group) => (
            <button
              className={skillGroup === group ? "filter-button active" : "filter-button"}
              key={group}
              onClick={() => setSkillGroup(group)}
              type="button"
            >
              {group}
            </button>
          ))}
        </div>

        <div className="skill-grid">
          {filteredCapabilities.map((capability) => (
            <article className="skill-tile" key={capability.label}>
              <span>{capability.group}</span>
              <strong>{capability.label}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className={mode === "Resume" ? "mode-panel show" : "mode-panel"}>
        <div className="section-title">
          <span>Resume Run</span>
          <h2>Experience, education, and strengths.</h2>
        </div>

        <div className="resume-run">
          <div className="experience-stack">
            {experience.map((item, index) => (
              <button
                className={openExperience === index ? "experience-card active" : "experience-card"}
                key={`${item.company}-${item.role}`}
                onClick={() => setOpenExperience(index)}
                type="button"
              >
                <span>{item.dates}</span>
                <strong>{item.role}</strong>
                <small>{item.company} / {item.location}</small>
                {openExperience === index && (
                  <ul>
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                )}
              </button>
            ))}
          </div>

          <div className="education-panel">
            <span>Education</span>
            <h3>{education.degree}</h3>
            <p>{education.school}</p>
            <p>{education.detail}</p>
            <div className="strength-track">
              {strengths.map((strength) => (
                <button key={strength} type="button">
                  {strength}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="activity-rail" aria-label="Recent GitHub activity">
        <div className="section-title">
          <span>GitHub Activity</span>
          <h2>Recent work signal.</h2>
        </div>

        <div className="activity-track">
          {timeline.map((item, index) => (
            <article key={`${item.repo}-${item.title}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.label} / {item.repo}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <a href={profile.github}>github.com/{profile.handle}</a>
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
      </footer>
    </main>
  );
}
