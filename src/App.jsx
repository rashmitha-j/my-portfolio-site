import { useEffect, useRef, useState } from "react";
import { profile, contact, projects, about, skills, achievements, nav } from "./data.js";

// Fades children in the first time they scroll into view
function Reveal({ as: Tag = "div", className = "", delay = 0, children, ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }
    let timer;
    // Stagger with a timeout rather than transition-delay so hover effects stay instant
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => setShown(true), delay);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, [delay]);

  return (
    <Tag
      ref={ref}
      className={`reveal ${shown ? "is-visible" : ""} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

function useTheme() {
  const [theme, setTheme] = useState(() => {
    const set = document.documentElement.dataset.theme;
    if (set) return set;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch (e) {}
    setTheme(next);
  }

  return [theme, toggle];
}

function ThemeToggle() {
  const [theme, toggle] = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      className="icon-btn"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
    >
      {dark ? (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  );
}

function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <a href="#top" className="brand">
          {profile.name}
        </a>
        <nav className="nav-links" aria-label="Primary">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

function Avatar() {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="avatar avatar-fallback" role="img" aria-label={profile.name}>
        {profile.initials}
      </div>
    );
  }
  return (
    <img
      className="avatar"
      src={profile.photo}
      alt={profile.name}
      width="320"
      height="320"
      onError={() => setFailed(true)}
    />
  );
}

function Hero() {
  return (
    <section id="top" className="hero">
      <div className="container hero-inner">
        <Reveal className="hero-text">
          <p className="eyebrow">Hi, I'm</p>
          <h1 className="hero-name">{profile.name.toUpperCase()}</h1>
          <p className="hero-tagline">{profile.tagline}</p>
          <div className="btn-row">
            <a href="#work" className="btn btn-primary">
              View my work
            </a>
            <a href="#contact" className="btn btn-secondary">
              Contact me
            </a>
          </div>
        </Reveal>
        <Reveal className="hero-photo" delay={120}>
          <Avatar />
        </Reveal>
      </div>
    </section>
  );
}

function ProjectImage({ project }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="project-placeholder" aria-hidden="true">
        <span>{project.name}</span>
      </div>
    );
  }
  return (
    <img
      src={project.image}
      alt={`${project.name} screenshot`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

function Work() {
  return (
    <section id="work" className="section">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">Selected work</p>
          <h2>Projects</h2>
        </Reveal>

        <div className="projects">
          {projects.map((project, i) => (
            <Reveal as="article" key={project.name} className="card project-card" delay={i * 80}>
              <div className="project-media">
                <ProjectImage project={project} />
              </div>
              <div className="project-body">
                <h3>{project.name}</h3>
                <p className="project-desc">{project.description}</p>
                <ul className="tags">
                  {project.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <div className="project-actions">
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                    GitHub <ArrowIcon />
                  </a>
                  <a href={project.demo} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                    Live Demo <ArrowIcon />
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="note">Demos run on free hosting, so the first load can take up to a minute.</p>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="section section-alt">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">About me</p>
          <h2>Building end-to-end, one project at a time</h2>
        </Reveal>

        <div className="about-grid">
          <Reveal className="about-text">
            {about.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </Reveal>
          <Reveal className="facts" delay={100}>
            {about.facts.map((fact) => (
              <div key={fact.label} className="card fact">
                <span className="fact-label">{fact.label}</span>
                <strong>{fact.value}</strong>
                <span className="fact-detail">{fact.detail}</span>
              </div>
            ))}
          </Reveal>
        </div>

        <Reveal as="h3" className="sub-head">
          Skills
        </Reveal>
        <div className="skills-grid">
          {skills.map((group, i) => (
            <Reveal key={group.group} className="card skill-card" delay={i * 60}>
              <h4>{group.group}</h4>
              <ul className="tags">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal as="h3" className="sub-head">
          Achievements
        </Reveal>
        <div className="achievements">
          {achievements.map((a, i) => (
            <Reveal key={a.title} className="card achievement" delay={i * 60}>
              <span className="achievement-stat">{a.stat}</span>
              <h4>{a.title}</h4>
              <p>{a.detail}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const items = [
    { label: "Email", value: contact.email, href: `mailto:${contact.email}` },
    { label: "Phone", value: contact.phone, href: contact.phoneHref },
    ...contact.links.map((l) => ({ label: l.label, value: l.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""), href: l.url, external: true })),
  ];

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <Reveal className="contact-head">
          <p className="eyebrow">Contact</p>
          <h2 className="contact-title">Let's build something together</h2>
          <p className="contact-lead">
            Open to internships, SDE roles and interesting projects. The fastest way to reach me is email.
          </p>
          <a href={`mailto:${contact.email}`} className="btn btn-primary btn-lg">
            {contact.email}
          </a>
        </Reveal>

        <div className="contact-grid">
          {items.map((item, i) => (
            <Reveal
              as="a"
              key={item.label}
              href={item.href}
              className="card contact-item"
              delay={i * 50}
              {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <span className="contact-label">{item.label}</span>
              <span className="contact-value">{item.value}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <a href="#top" className="brand">
          {profile.name}
        </a>
        <nav className="footer-links" aria-label="Footer">
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <p className="copy">© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Work />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
