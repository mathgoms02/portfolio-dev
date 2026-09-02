import { useCallback, useEffect, useState } from "react";
import { AsciiPortrait } from "./AsciiPortrait";
import portrait from "../../assets/portrait.webp";
import portraitDither from "../../assets/portrait-dither.webp";
import lqip from "../../assets/portrait-lqip.txt?raw";
import {
  availability,
  contact,
  cvFile,
  identity,
  summary,
} from "../../data/profile";
import { useLocale } from "../../i18n/LocaleContext";
import { ui } from "../../i18n/ui";
import { useScrollControl } from "../../lib/ScrollProvider";
// import { useLocalTime } from "../../lib/useLocalTime";
import { Magnetic } from "../ui/Magnetic";
import { Marquee } from "../ui/Marquee";
import { ScrambleText } from "../ui/ScrambleText";
import styles from "./Hero.module.css";

const TICKER = [
  "Python",
  "Django",
  "FastAPI",
  "React",
  "TypeScript",
  "PostgreSQL",
  "Docker",
  "Jenkins",
  "CSS Grid",
  "watsonx.ai",
  "llama.cpp",
  "C#",
  "scikit-learn",
  "Linux",
  "ADB",
  "Redis",
];

interface Props {
  /** Delays the entrance until the boot curtain has lifted. */
  ready: boolean;
}

export function Hero({ ready }: Props) {
  const { locale, t } = useLocale();
  const { scrollTo } = useScrollControl();
  // const time = useLocalTime();
  const [resolved, setResolved] = useState(false);
  const [hover, setHover] = useState(false);
  const [asciiReady, setAsciiReady] = useState(false);

  const handleAsciiReady = useCallback(() => setAsciiReady(true), []);

  // The portrait resolves out of its characters once the page is live.
  useEffect(() => {
    if (!ready) return;
    const id = window.setTimeout(() => setResolved(true), 950);
    return () => window.clearTimeout(id);
  }, [ready]);

  const cvHref = `${import.meta.env.BASE_URL}${cvFile}`;
  const email = contact[0];

  return (
    <section id="index" className={styles.hero} data-ready={ready || undefined}>
      <div className={styles.topline}>
        <span className={styles.kicker}>
          {ui.hero.kicker[locale]} <span className={styles.slash}>/</span> 2026
        </span>
        <span className={styles.status}>
          <span className={styles.pulseStatic} aria-hidden="true" />
          {t(availability.label)}
        </span>
      </div>

      <div className={styles.stage}>
        <h1 className={styles.name}>
          <span className={styles.line} data-line="1">
            <ScrambleText
              text={identity.first.toUpperCase()}
              immediate={ready}
              speed={30}
              scatter={6}
            />
          </span>
          <span className={styles.line} data-line="2">
            <ScrambleText
              text={identity.last.toUpperCase()}
              immediate={ready}
              speed={30}
              scatter={9}
            />
          </span>
        </h1>

        <figure
          className={styles.plate}
          data-resolved={resolved || undefined}
          data-ascii={asciiReady || undefined}
          onPointerEnter={() => setHover(true)}
          onPointerLeave={() => setHover(false)}
        >
          <span className={styles.frame} aria-hidden="true">
            <i data-corner="tl" />
            <i data-corner="tr" />
            <i data-corner="bl" />
            <i data-corner="br" />
          </span>
          <span className={styles.imageWrap}>
            <img
              className={styles.lqip}
              src={lqip.trim()}
              alt=""
              aria-hidden="true"
            />
            <img
              className={styles.real}
              src={portrait}
              width={1100}
              height={1345}
              alt={`${identity.full} — ${t(identity.role)}`}
              fetchPriority="high"
              decoding="async"
            />
            <img
              className={styles.dither}
              src={portraitDither}
              width={1100}
              height={1345}
              alt=""
              aria-hidden="true"
              decoding="async"
            />
            <AsciiPortrait
              src={portrait}
              resolved={resolved}
              hover={hover}
              onReady={handleAsciiReady}
            />
            <span className={styles.scan} aria-hidden="true" />
          </span>
          <figcaption className={styles.caption}>
            <span>{t(identity.role)}</span>
            <span className={styles.captionMeta}>fig. 01</span>
          </figcaption>
        </figure>
      </div>

      <div className={styles.under}>
        <div className={styles.left}>
          <p className={styles.signature}>
            <span className={styles.caret}>&gt;</span> software.engineer
            <span className={styles.punct}>(</span>
            <span className={styles.arg}>python</span>,{" "}
            <span className={styles.arg}>ai</span>,{" "}
            <span className={styles.arg}>automation</span>
            <span className={styles.punct}>)</span>
          </p>
          <p className={styles.lead}>{t(summary)}</p>

          <div className={styles.cta}>
            <Magnetic strength={8}>
              <a
                className={styles.primary}
                href={email.href}
                data-cursor="link"
              >
                <span>{ui.contact.emailCta[locale]}</span>
                <svg
                  viewBox="0 0 20 12"
                  width="20"
                  height="12"
                  aria-hidden="true"
                >
                  <path
                    d="M0 6h18M13 1l5 5-5 5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                </svg>
              </a>
            </Magnetic>
            <a className={styles.secondary} href={cvHref} download>
              {ui.hero.cv[locale]}
            </a>
          </div>
        </div>

        <div className={styles.right}>
          <dl className={styles.facts}>
            <div>
              <dt>{ui.hero.based[locale]}</dt>
              <dd>
                {identity.city}, {identity.region} — {identity.country}
                {/* <span className={styles.coords}>
                  {Math.abs(identity.coords.lat).toFixed(2)}° S ·{" "}
                  {Math.abs(identity.coords.lon).toFixed(2)}° W
                </span> */}
              </dd>
            </div>
            {/* <div>
              <dt>{ui.hero.localTime[locale]}</dt>
              <dd className={styles.mono}>
                {time} <span className={styles.tz}>BRT</span>
              </dd>
            </div> */}
            <div>
              <dt>GitHub</dt>
              <dd>
                <a
                  href="https://github.com/mathgoms02"
                  target="_blank"
                  rel="noreferrer"
                  className={styles.inline}
                >
                  @{identity.handle}
                </a>
              </dd>
            </div>
          </dl>

          <button
            type="button"
            className={styles.scrollHint}
            onClick={() => scrollTo("profile")}
          >
            <span>{ui.hero.scrollHint[locale]}</span>
            <span className={styles.hintLine} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className={styles.tickerRow}>
        <Marquee
          duration={54}
          items={TICKER.map((x) => (
            <span key={x} className={styles.tick}>
              {x}
            </span>
          ))}
        />
      </div>
    </section>
  );
}
