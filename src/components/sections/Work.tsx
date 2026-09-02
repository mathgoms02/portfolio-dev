import { useState } from "react";
import { projects } from "../../data/projects";
import { useLocale } from "../../i18n/LocaleContext";
import { ui } from "../../i18n/ui";
import { relativeTime } from "../../lib/format";
import { useGithub } from "../../lib/useGithub";
import { Reveal } from "../ui/Reveal";
import { SectionHead } from "../ui/SectionHead";
import { CaseSheet } from "./CaseSheet";
import type { Project } from "../../data/types";
import styles from "./Work.module.css";

export function Work() {
  const { locale, t } = useLocale();
  const { repos, provenance } = useGithub();
  const [open, setOpen] = useState<Project | null>(null);

  return (
    <section id="work" className={styles.section}>
      <div className="wrap">
        <SectionHead
          index="03"
          label={ui.nav.work[locale]}
          title={ui.section.work[locale]}
          lead={
            locale === "pt"
              ? "Sete projetos que representam o que sei fazer. Cada um resolve um problema que existia antes de eu aparecer. Dois deles são fechados, e desses conto a engenharia, não o cliente."
              : "Seven projects that show what I can do. Each one solves a problem that existed before I showed up. Two are closed, and for those I tell the engineering, not the client."
          }
        />

        <ol className={styles.list}>
          {projects.map((project, i) => {
            const repo = project.repo
              ? repos[project.repo.toLowerCase()]
              : undefined;
            return (
              <Reveal
                as="li"
                key={project.id}
                variant="up"
                delay={i * 0.05}
                className={styles.row}
                style={{ ["--tint" as string]: project.tint ?? "var(--amber)" }}
              >
                <button
                  type="button"
                  id={`project-${project.id}`}
                  className={styles.trigger}
                  onClick={() => setOpen(project)}
                  data-cursor="view"
                  data-cursor-label={ui.common.readCase[locale]}
                >
                  <span className={styles.sweep} aria-hidden="true" />

                  <span className={styles.index}>{project.index}</span>

                  <span className={styles.main}>
                    <span className={styles.name}>{project.name}</span>
                    <span className={styles.tagline}>{t(project.tagline)}</span>
                    <span className={styles.stack}>
                      {project.stack.slice(0, 6).map((s) => (
                        <span key={s}>{s}</span>
                      ))}
                      {project.stack.length > 6 ? (
                        <span className={styles.more}>
                          +{project.stack.length - 6}
                        </span>
                      ) : null}
                    </span>
                  </span>

                  <span className={styles.aside}>
                    <span className={styles.year}>{project.year}</span>
                    <span
                      className={styles.status}
                      data-status={project.status}
                    >
                      {ui.status[project.status][locale]}
                    </span>
                    {repo ? (
                      <span className={styles.repoMeta}>
                        {repo.stars > 0 ? <span>★ {repo.stars}</span> : null}
                        <span>{relativeTime(repo.pushedAt, locale)}</span>
                      </span>
                    ) : project.restricted ? (
                      <span className={styles.restricted}>
                        <svg
                          viewBox="0 0 10 12"
                          width="8"
                          height="10"
                          aria-hidden="true"
                        >
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
                        {locale === "pt" ? "fechado" : "closed"}
                      </span>
                    ) : null}
                  </span>

                  <span className={styles.arrow} aria-hidden="true">
                    <svg viewBox="0 0 24 14" width="24" height="14">
                      <path
                        d="M0 7h22M16 1l6 6-6 6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </span>
                </button>
              </Reveal>
            );
          })}
        </ol>

        <p className={styles.provenance}>
          <span
            className={styles.dot}
            data-live={provenance !== "snapshot" || undefined}
            aria-hidden="true"
          />
          {provenance === "snapshot"
            ? locale === "pt"
              ? "dados do GitHub em cache local"
              : "GitHub data from local cache"
            : `${ui.common.live[locale]} · api.github.com`}
        </p>
      </div>

      <CaseSheet
        project={open}
        repo={open?.repo ? repos[open.repo.toLowerCase()] : undefined}
        onClose={() => setOpen(null)}
      />
    </section>
  );
}
