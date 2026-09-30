import { useState } from "react";
import { m, useReducedMotion } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1];

// Shared-layout id that links a project's card screenshot to its detail page header
export const imageLayoutId = (slug) => `project-image-${slug}`;

// Fades children up the first time they scroll into view. `delay` is in seconds.
// Hover lifts use the CSS `translate` property so they don't fight Framer's inline transform.
export function Reveal({ as = "div", delay = 0, children, ...rest }) {
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

export function ProjectImage({ project, eager = false }) {
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
      loading={eager ? "eager" : "lazy"}
      onError={() => setFailed(true)}
    />
  );
}

export function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}
