import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  LazyMotion,
  MotionConfig,
  cubicBezier,
  domAnimation,
  m,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { profile, contact, projects, about, skills, achievements, nav } from "./data.js";

const EASE = [0.22, 1, 0.36, 1];
const easeFn = cubicBezier(...EASE);
const NAV_OFFSET = 80; // matches scroll-padding-top in styles.css
const INTRO_KEY = "intro-seen";

// Fades children up the first time they scroll into view. `delay` is in seconds.
// Hover lifts use the CSS `translate` property so they don't fight Framer's inline transform.
function Reveal({ as = "div", delay = 0, children, ...rest }) {
  const reduce = useReducedMotion();
  const Tag = m[as];
  return (
    <Tag
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

function shouldShowIntro() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    return sessionStorage.getItem(INTRO_KEY) !== "1";
  } catch (e) {
    return true;
  }
}

// Full-screen "RJ" card shown on the first visit of a session, then slides up to reveal the page
function Intro({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <m.div
          key="intro"
          className="intro"
          aria-hidden="true"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <div className="intro-mark">
            {[...profile.initials].map((ch, i) => (
              <span key={i} className="mask">
                <m.span
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.7, ease: EASE, delay: 0.1 + i * 0.08 }}
                >
                  {ch}
                </m.span>
              </span>
            ))}
          </div>
          <m.span
            className="intro-name"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.35 }}
          >
            {profile.name}
          </m.span>
        </m.div>
      )}
    </AnimatePresence>
  );
}

function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

// Tweens window scroll position; returns a function that cancels it
function scrollWindowTo(from, to, duration) {
  let frame;
  const start = performance.now();
  const step = (now) => {
    const t = Math.min(1, (now - start) / (duration * 1000));
    window.scrollTo(0, from + (to - from) * easeFn(t));
    if (t < 1) frame = requestAnimationFrame(step);
  };
  frame = requestAnimationFrame(step);
  return () => cancelAnimationFrame(frame);
}

// Eased scrolling for in-page links (navbar, hero buttons, footer)
function useSmoothAnchors() {
  const reduce = useReducedMotion();
  useEffect(() => {
    let cancel;
    const stop = () => cancel?.();

    function onClick(e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = e.target.closest('a[href^="#"]');
      const id = link?.getAttribute("href").slice(1);
      const target = id && document.getElementById(id);
      if (!target) return;
      e.preventDefault();

      const from = window.scrollY;
      const to = Math.max(0, target.getBoundingClientRect().top + from - NAV_OFFSET);
      history.pushState(null, "", `#${id}`);
      stop();
      if (reduce) {
        window.scrollTo(0, to);
      } else {
        cancel = scrollWindowTo(from, to, Math.min(1.2, 0.6 + Math.abs(to - from) / 4000));
      }
      // Move focus for keyboard and screen-reader users without jumping the scroll
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }

    document.addEventListener("click", onClick);
    // Let the user take over mid-scroll
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("keydown", stop);
    return () => {
      stop();
      document.removeEventListener("click", onClick);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", stop);
    };
  }, [reduce]);
}

// Small dot that trails the pointer and grows over links and buttons (mouse users only)
function CursorDot() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 600, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 600, damping: 40, mass: 0.4 });

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const over = (e) => setHovering(!!e.target.closest?.("a, button"));
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;
  return (
    <m.div
      className="cursor-dot"
      aria-hidden="true"
      style={{ x: sx, y: sy }}
      animate={{ scale: hovering ? 4 : 1, opacity: visible ? (hovering ? 0.22 : 0.9) : 0 }}
      transition={{ duration: 0.35, ease: EASE }}
    />
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

function Navbar({ ready }) {
  const reduce = useReducedMotion();
  const scrolled = useScrolled();
  return (
    <m.header
      className={`navbar ${scrolled ? "is-scrolled" : ""}`}
      initial={reduce ? false : { y: "-100%" }}
      animate={{ y: ready ? 0 : "-100%" }}
      transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
    >
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
    </m.header>
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

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (delay) => ({ opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, delay } }),
};

const letterUp = {
  hidden: { y: "110%" },
  show: (delay) => ({ y: 0, transition: { duration: 0.8, ease: EASE, delay } }),
};

const photoIn = {
  hidden: { opacity: 0, scale: 0.9 },
  show: (delay) => ({ opacity: 1, scale: 1, transition: { duration: 0.9, ease: EASE, delay } }),
};

// Entrance order: eyebrow → name letter by letter → tagline → buttons → photo
function Hero({ ready }) {
  const reduce = useReducedMotion();
  const motionProps = (variants, delay) => ({
    variants,
    custom: delay,
    initial: reduce ? false : "hidden",
    animate: ready ? "show" : "hidden",
  });

  const name = profile.name.toUpperCase();
  const words = name.split(" ");
  const LETTERS_START = 0.2;
  const LETTER_STAGGER = 0.035;
  let letterIndex = 0;

  return (
    <section id="top" className="hero">
      <div className="container hero-inner">
        <div className="hero-text">
          <m.p className="eyebrow" {...motionProps(fadeUp, 0.1)}>
            Hi, I'm
          </m.p>
          <h1 className="hero-name" aria-label={name}>
            {words.map((word, wi) => (
              <span key={wi}>
                <span className="word-mask" aria-hidden="true">
                  {[...word].map((ch, ci) => (
                    <m.span
                      key={ci}
                      className="letter"
                      {...motionProps(letterUp, LETTERS_START + letterIndex++ * LETTER_STAGGER)}
                    >
                      {ch}
                    </m.span>
                  ))}
                </span>
                {wi < words.length - 1 && " "}
              </span>
            ))}
          </h1>
          <m.p className="hero-tagline" {...motionProps(fadeUp, 0.65)}>
            {profile.tagline}
          </m.p>
          <m.div className="btn-row" {...motionProps(fadeUp, 0.8)}>
            <a href="#work" className="btn btn-primary">
              View my work
            </a>
            <a href="#contact" className="btn btn-secondary">
              Contact me
            </a>
          </m.div>
        </div>
        <m.div className="hero-photo" {...motionProps(photoIn, 0.95)}>
          <Avatar />
        </m.div>
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
            <Reveal as="article" key={project.name} className="card project-card" delay={i * 0.1}>
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
                    Live Demo
                    <span className="demo-arrow">
                      <ArrowIcon />
                    </span>
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
          <div className="facts">
            {about.facts.map((fact, i) => (
              <Reveal key={fact.label} className="card fact" delay={0.1 + i * 0.08}>
                <span className="fact-label">{fact.label}</span>
                <strong>{fact.value}</strong>
                <span className="fact-detail">{fact.detail}</span>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal as="h3" className="sub-head">
          Skills
        </Reveal>
        <div className="skills-grid">
          {skills.map((group, i) => (
            <Reveal key={group.group} className="card skill-card" delay={i * 0.08}>
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
            <Reveal key={a.title} className="card achievement" delay={i * 0.08}>
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
              delay={i * 0.06}
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
  const [showIntro, setShowIntro] = useState(shouldShowIntro);
  const [ready, setReady] = useState(!showIntro);
  useSmoothAnchors();

  useEffect(() => {
    if (!showIntro) return;
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch (e) {}
    const root = document.documentElement;
    root.style.overflow = "hidden";
    // Start the page entrance as the intro begins sliding away so the two overlap
    const timer = setTimeout(() => {
      setShowIntro(false);
      setReady(true);
      root.style.overflow = "";
    }, 1200);
    return () => {
      clearTimeout(timer);
      root.style.overflow = "";
    };
  }, [showIntro]);

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <Intro show={showIntro} />
        <CursorDot />
        <Navbar ready={ready} />
        <main>
          <Hero ready={ready} />
          <Work />
          <About />
          <Contact />
        </main>
        <Footer />
      </MotionConfig>
    </LazyMotion>
  );
}
