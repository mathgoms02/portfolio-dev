import { SECTIONS } from "../../data/sections";
import { useLocale } from "../../i18n/LocaleContext";
import { useActiveSection } from "../../lib/useActiveSection";
import { useLocalTime } from "../../lib/useLocalTime";
import { useScrollControl } from "../../lib/ScrollProvider";
import { useTransition } from "../../lib/TransitionProvider";
import { identity } from "../../data/profile";
import styles from "./Rail.module.css";

/** The fixed left index: section list, read progress, and the author's clock. */
export function Rail() {
  const { locale } = useLocale();
  const active = useActiveSection();
  const { scrollTo, progress } = useScrollControl();
  const { navigate } = useTransition();
  const time = useLocalTime();

  return (
    <nav
      className={styles.rail}
      aria-label={locale === "pt" ? "Índice das seções" : "Section index"}
    >
      <a
        className={styles.mark}
        href="#index"
        onClick={(e) => {
          e.preventDefault();
          scrollTo("index");
        }}
      >
        <span>MG</span>
        <span className={styles.markRule} aria-hidden="true" />
      </a>

      <ol className={styles.list}>
        {SECTIONS.map((s) => {
          const isActive = s.id === active;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={styles.item}
                data-active={isActive || undefined}
                aria-current={isActive ? "true" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(s.id);
                }}
              >
                <span className={styles.num}>{s.num}</span>
                <span className={styles.label}>{s.label[locale]}</span>
                <span className={styles.tick} aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ol>

      <div className={styles.foot}>
        <div className={styles.progress} aria-hidden="true">
          <span style={{ transform: `scaleY(${progress})` }} />
        </div>
        <p className={styles.clock}>
          <span>{identity.city.toUpperCase()}</span>
          {/* <span className={styles.time}>{time}</span> */}
        </p>
      </div>
    </nav>
  );
}
