import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { m, useReducedMotion } from "framer-motion";
import { profile } from "./data.js";
import { ArrowIcon, EASE, ProjectImage, Reveal, imageLayoutId } from "./shared.jsx";

const IMAGE_TRANSITION = { layout: { duration: 0.7, ease: EASE } };
// The "Next project" thumbnail shares a layoutId with that project's card, so it must never
// animate itself. It only acts as the starting point when the next page's header takes over.
const SNAP = { layout: { duration: 0 } };

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

// A project's detail page. It sits in its own full-screen scroll container above the home page,
// so the home page keeps its scroll position and the header image can fly back into its card.
export default function ProjectPage({ project, next, nextState, animateImage, onClose }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  // The home page can't scroll while a project is open, so pinning this layer at the current
  // scroll offset covers the screen like position: fixed would. Unlike fixed, it keeps the
  // header image in the same page coordinates as the card, which the shared animation relies on.
  const [top] = useState(() => window.scrollY);

  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, []);

  // When the image is flying in, let it land before the text starts
  const base = animateImage ? 0.35 : 0.1;
  const enter = (delay) =>
    reduce
      ? { initial: false }
      : {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE, delay } },
        };

  return (
    <m.div
      ref={ref}
      className="detail"
      tabIndex={-1}
      aria-labelledby="detail-title"
      style={{ top }}
      layoutScroll
      exit={{ opacity: 0, transition: { duration: reduce ? 0 : 0.25, ease: "easeOut" } }}
    >
      <div className="detail-bar">
        <div className="container detail-bar-inner">
          <button type="button" className="back-link" onClick={onClose}>
            <BackIcon /> All projects
          </button>
          <span className="brand">{profile.name}</span>
        </div>
      </div>

      <article className="container detail-inner">
        <m.div
          className="detail-media"
          layoutId={animateImage ? imageLayoutId(project.slug) : undefined}
          transition={IMAGE_TRANSITION}
          style={{ borderRadius: 18 }}
          {...(animateImage ? {} : enter(0))}
        >
          <ProjectImage project={project} eager />
        </m.div>

        <header className="detail-head">
          <m.h1 id="detail-title" className="detail-title" {...enter(base)}>
            {project.name}
          </m.h1>
          <m.p className="detail-summary" {...enter(base + 0.08)}>
            {project.summary}
          </m.p>
          <m.div className="btn-row detail-actions" {...enter(base + 0.16)}>
            <a href={project.demo} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Live Demo <ArrowIcon />
            </a>
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              GitHub <ArrowIcon />
            </a>
          </m.div>
        </header>

        <div className="detail-grid">
          <Reveal as="section" className="detail-section" delay={base + 0.24}>
            <h2>Overview</h2>
            <div className="detail-prose">
              {project.overview.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>
          <Reveal as="section" className="detail-section" delay={base + 0.32}>
            <h2>Tech stack</h2>
            <ul className="tags">
              {project.stack.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal as="section" className="detail-section">
          <h2>Key features</h2>
          <ul className="feature-list">
            {project.features.map((feature) => (
              <li key={feature}>
                <CheckIcon />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <section className="detail-section">
          <Reveal as="h2">Challenges and how I solved them</Reveal>
          <div className="challenges">
            {project.challenges.map((c, i) => (
              <Reveal key={c.title} className="card challenge" delay={i * 0.08}>
                <span className="challenge-num">{String(i + 1).padStart(2, "0")}</span>
                <h3>{c.title}</h3>
                <p>{c.detail}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <p className="note">Demos run on free hosting, so the first load may take up to a minute.</p>

        <Reveal>
          <Link to={`/projects/${next.slug}`} state={nextState} className="card next-project">
            <m.div
              className="next-media"
              layoutId={imageLayoutId(next.slug)}
              transition={SNAP}
              style={{ borderRadius: 12 }}
            >
              <ProjectImage project={next} />
            </m.div>
            <span className="next-text">
              <span className="next-label">Next project →</span>
              <strong>{next.name}</strong>
              <span className="next-summary">{next.summary}</span>
            </span>
          </Link>
        </Reveal>
      </article>
    </m.div>
  );
}
