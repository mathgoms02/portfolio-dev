import { useMemo } from "react";
import { useLocale } from "../../i18n/LocaleContext";
import { ui } from "../../i18n/ui";
import { addDays } from "../../lib/format";
import { useCountUp } from "../../lib/useCountUp";
import { useInView } from "../../lib/useInView";
import { useGithub } from "../../lib/useGithub";
import styles from "./GithubActivity.module.css";

const MONTHS: Record<"pt" | "en", string[]> = {
  pt: [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez",
  ],
  en: [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ],
};

/** Five buckets, scaled to this particular year's ceiling. */
function level(count: number, max: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  const ratio = count / Math.max(max, 1);
  if (ratio <= 0.08) return 1;
  if (ratio <= 0.22) return 2;
  if (ratio <= 0.48) return 3;
  return 4;
}

export function GithubActivity() {
  const { locale, t } = useLocale();
  const { stats, provenance } = useGithub();
  const { ref, inView } = useInView<HTMLDivElement>({ amount: 0.15 });
  const total = useCountUp(stats.contributionsLastYear, inView, 1600);

  const { weeks, monthMarks, max } = useMemo(() => {
    const cal = stats.calendar;
    const ceiling = cal.reduce((m, c) => Math.max(m, c), 0);
    const cols: { count: number; date: Date }[][] = [];
    for (let i = 0; i < cal.length; i += 7) {
      cols.push(
        cal.slice(i, i + 7).map((count, d) => ({
          count,
          date: addDays(stats.calendarStart, i + d),
        })),
      );
    }
    // one label per column where the month rolls over
    const marks: { col: number; label: string }[] = [];
    let lastMonth = -1;
    cols.forEach((col, i) => {
      const m = col[0]?.date.getUTCMonth();
      if (m === undefined || m === lastMonth) return;
      lastMonth = m;
      // a label needs roughly three columns of room; drop the ones that
      // would collide with the mark before them (the first and last stubs)
      const prev = marks[marks.length - 1];
      if (prev && i - prev.col < 3) return;
      if (i > cols.length - 3) return;
      marks.push({ col: i, label: MONTHS[locale][m] });
    });
    return { weeks: cols, monthMarks: marks, max: ceiling };
  }, [stats.calendar, stats.calendarStart, locale]);

  const figures = [
    { value: stats.commitsLastYear, label: ui.github.commits[locale] },
    { value: stats.pullRequests, label: ui.github.prs[locale] },
    { value: stats.publicRepos, label: ui.github.repos[locale] },
    { value: stats.reposContributed, label: ui.github.contributed[locale] },
  ];

  return (
    <div ref={ref} className={styles.panel}>
      <header className={styles.head}>
        <h3 className={styles.title}>{ui.github.title[locale]}</h3>
        <a
          className={styles.source}
          href="https://github.com/mathgoms02"
          target="_blank"
          rel="noreferrer"
        >
          <span
            className={styles.dot}
            data-live={provenance !== "snapshot" || undefined}
            aria-hidden="true"
          />
          {/* {provenance === "snapshot"
            ? ui.common.cached[locale]
            : ui.common.live[locale]} */}
          <span className={styles.sourceHandle}>@{stats.login}</span>
        </a>
      </header>

      <p className={styles.total}>
        <span className={styles.totalValue}>
          {Math.round(total).toLocaleString(
            locale === "pt" ? "pt-BR" : "en-US",
          )}
        </span>
        <span className={styles.totalLabel}>
          {ui.github.contributions[locale]}
        </span>
      </p>

      <div className={styles.calendarWrap} data-anim={inView || undefined}>
        <div className={styles.months} aria-hidden="true">
          {monthMarks.map((m) => (
            <span key={`${m.col}-${m.label}`} style={{ gridColumn: m.col + 1 }}>
              {m.label}
            </span>
          ))}
        </div>

        <div
          className={styles.calendar}
          role="img"
          aria-label={`${stats.contributionsLastYear} ${ui.github.contributions[locale]}`}
        >
          {weeks.map((col, ci) => (
            <div key={ci} className={styles.week}>
              {col.map((day, di) => (
                <span
                  key={di}
                  className={styles.day}
                  data-level={level(day.count, max)}
                  style={{ animationDelay: `${ci * 7 + di * 2}ms` }}
                  title={`${day.date.toISOString().slice(0, 10)} · ${day.count}`}
                />
              ))}
            </div>
          ))}
        </div>

        <div className={styles.legend} aria-hidden="true">
          <span>{ui.github.less[locale]}</span>
          {[0, 1, 2, 3, 4].map((l) => (
            <span
              key={l}
              className={styles.day}
              data-level={l}
              data-static="true"
            />
          ))}
          <span>{ui.github.more[locale]}</span>
        </div>
      </div>

      <dl className={styles.figures}>
        {figures.map((f) => (
          <div key={f.label}>
            <dt>{f.label}</dt>
            <dd>{f.value}</dd>
          </div>
        ))}
      </dl>

      <div className={styles.langs}>
        <h4 className={styles.langTitle}>{ui.github.languages[locale]}</h4>
        <div className={styles.bar}>
          {stats.languages.map((l) => (
            <span
              key={l.name}
              className={styles.barSeg}
              style={{
                width: inView ? `${l.pct}%` : "0%",
                background: l.color,
              }}
              title={`${l.name} ${l.pct}%`}
            />
          ))}
        </div>
        <ul className={styles.langList}>
          {stats.languages.map((l) => (
            <li key={l.name}>
              <span
                className={styles.swatch}
                style={{ background: l.color }}
                aria-hidden="true"
              />
              {l.name}
              <span className={styles.pct}>{l.pct}%</span>
            </li>
          ))}
        </ul>
        <p className={styles.note}>{t(ui.github.note)}</p>
      </div>
    </div>
  );
}
