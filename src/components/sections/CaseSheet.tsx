import { useEffect, useRef } from "react";
import type { Project } from "../../data/types";
import { useLocale } from "../../i18n/LocaleContext";
import { ui } from "../../i18n/ui";
import { relativeTime } from "../../lib/format";
import { useScrollControl } from "../../lib/ScrollProvider";
import type { RepoMeta } from "../../lib/useGithub";
import styles from "./CaseSheet.module.css";

interface Props {
  project: Project | null;
  repo?: RepoMeta;
  onClose: () => void;
}

export function CaseSheet({ project, repo, onClose }: Props) {
  const { locale, t } = useLocale();
  const { stop, start } = useScrollControl();
  const panelRef = useRef<HTMLDivElement>(null);
  const open = project !== null;

  useEffect(() => {
    if (!open) {
      start();
      return;
    }
    stop();
    document.body.style.overflow = "hidden";
    const id = requestAnimationFrame(() => panelRef.current?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      start();
    };
  }, [open, onClose, start, stop]);

  if (!project) return null;

  const blocks = [
    {
      label: ui.common.problem[locale],
      body: project.problem ? [t(project.problem)] : null,
    },
    {
      label: ui.common.approach[locale],
      body: project.approach ? t(project.approach) : null,
    },
    {
      label: ui.common.outcome[locale],
      body: project.outcome ? t(project.outcome) : null,
    },
  ].filter((b) => b.body && b.body.length > 0);

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={project.name}
    >
      <button
        type="button"
        className={styles.scrim}
        onClick={onClose}
        aria-label={ui.common.close[locale]}
      />

      <article
        ref={panelRef}
        className={styles.panel}
        tabIndex={-1}
        style={{ ["--tint" as string]: project.tint ?? "var(--amber)" }}
      >
        <header className={styles.head}>
          <div className={styles.headTop}>
            <span className={styles.index}>{project.index}</span>
            <span className={styles.meta}>
              {project.year} · {ui.status[project.status][locale]}
            </span>
            <button type="button" className={styles.close} onClick={onClose}>
              <span>{ui.common.close[locale]}</span>
              <svg
                viewBox="0 0 14 14"
                width="12"
                height="12"
                aria-hidden="true"
              >
                <path
                  d="M1 1l12 12M13 1L1 13"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              </svg>
            </button>
          </div>

          <h2 className={styles.name}>{project.name}</h2>
          <p className={styles.tagline}>{t(project.tagline)}</p>
          <p className={styles.role}>{t(project.role)}</p>
        </header>

        <div className={styles.content}>
          <p className={styles.summary}>{t(project.summary)}</p>

          {blocks.map((block) => (
            <section key={block.label} className={styles.block}>
              <h3 className={styles.blockLabel}>{block.label}</h3>
              {block.body!.length === 1 ? (
                <p className={styles.blockText}>{block.body![0]}</p>
              ) : (
                <ul className={styles.blockList}>
                  {block.body!.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <section className={styles.block}>
            <h3 className={styles.blockLabel}>{ui.common.stackUsed[locale]}</h3>
            <ul className={styles.stack}>
              {project.stack.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>

          {repo ? (
            <section className={styles.block}>
              <h3 className={styles.blockLabel}>GitHub</h3>
              <dl className={styles.repoStats}>
                <div>
                  <dt>{ui.common.stars[locale]}</dt>
                  <dd>{repo.stars}</dd>
                </div>
                <div>
                  <dt>forks</dt>
                  <dd>{repo.forks}</dd>
                </div>
                <div>
                  <dt>{ui.common.updated[locale]}</dt>
                  <dd>{relativeTime(repo.pushedAt, locale)}</dd>
                </div>
              </dl>
            </section>
          ) : null}
        </div>

        <footer className={styles.foot}>
          {project.links.length === 0 && project.restricted ? (
            <p className={styles.restricted}>
              <svg viewBox="0 0 10 12" width="9" height="11" aria-hidden="true">
                <path
                  d="M1 5V3.5a3 3 0 0 1 6 0V5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.1"
                />
                <rect
                  x="0.5"
                  y="5"
                  width="9"
                  height="6.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.1"
                />
              </svg>
              {t(project.restricted)}
            </p>
          ) : null}
          {project.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className={styles.link}
            >
              <span>{t(link.label)}</span>
              <svg
                viewBox="0 0 14 14"
                width="11"
                height="11"
                aria-hidden="true"
              >
                <path
                  d="M3 11L11 3M4.5 3H11v6.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              </svg>
            </a>
          ))}
        </footer>
      </article>
    </div>
  );
}
