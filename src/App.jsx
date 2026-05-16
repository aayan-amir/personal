import Scene from "./Scene.jsx";

const projects = [
  {
    number: "01",
    title: "Game-Like Portfolio",
    text: "A future explorable world for case studies, experiments, and little secrets.",
  },
  {
    number: "02",
    title: "Creative Tools",
    text: "Small apps, prototypes, and useful interfaces with personality.",
  },
  {
    number: "03",
    title: "Selected Work",
    text: "Polished projects with notes on process, decisions, and outcomes.",
  },
];

export default function App() {
  return (
    <main className="stage" aria-label="Portfolio homepage">
      <Scene />

      <section className="hero">
        <p className="eyebrow">Interactive Portfolio</p>
        <h1>Your Name</h1>
        <p className="intro">
          I build thoughtful digital things with motion, craft, and a lot of
          curiosity.
        </p>

        <div className="actions" aria-label="Primary links">
          <a className="button primary" href="mailto:you@example.com">
            Contact
          </a>
          <a className="button" href="https://github.com/your-username">
            GitHub
          </a>
        </div>
      </section>

      <section className="projects" aria-label="Featured projects">
        {projects.map((project) => (
          <article className="project-tile" key={project.number}>
            <span>{project.number}</span>
            <h2>{project.title}</h2>
            <p>{project.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
