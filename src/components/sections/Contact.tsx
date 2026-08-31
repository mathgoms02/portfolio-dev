import { useState } from "react";
import { availability, contact, cvFile, identity } from "../../data/profile";
import { useLocale } from "../../i18n/LocaleContext";
import { ui } from "../../i18n/ui";
import { useGithub } from "../../lib/useGithub";
import { Magnetic } from "../ui/Magnetic";
import { Reveal } from "../ui/Reveal";
import { SectionHead } from "../ui/SectionHead";
import styles from "./Contact.module.css";

const EMAIL = "math.gomsx3@gmail.com";

export function Contact() {
  const { locale, t } = useLocale();
  const { stats, provenance } = useGithub();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <section id="contact" className={styles.section}>
      <div className="wrap">
        <SectionHead
          index="07"
          label={ui.nav.contact[locale]}
          title={ui.section.contact[locale]}
          lead={ui.contact.lead[locale]}
        />

        <Reveal variant="up" className={styles.emailRow}>
          <Magnetic strength={10}>
            <a
              className={styles.email}
              href={`mailto:${EMAIL}`}
              data-cursor="link"
            >
              {EMAIL}
            </a>
          </Magnetic>
          <button
            type="button"
            className={styles.copy}
            onClick={copy}
            data-copied={copied || undefined}
          >
            {copied ? ui.common.copied[locale] : ui.common.copy[locale]}
          </button>
        </Reveal>

        <div className={styles.grid}>
          <Reveal variant="up" delay={0.06} className={styles.block}>
            <h3 className={styles.blockLabel}>
              {ui.contact.elsewhere[locale]}
            </h3>
            <ul className={styles.links}>
              {contact.slice(1).map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.link}
                  >
                    <span className={styles.linkLabel}>{link.label}</span>
                    <span className={styles.linkHandle}>{link.handle}</span>
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
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal variant="up" delay={0.12} className={styles.block}>
            <h3 className={styles.blockLabel}>
              {locale === "pt" ? "Situação" : "Status"}
            </h3>
            <p className={styles.status}>{t(availability.label)}</p>
            <p className={styles.statusNote}>
              {locale === "pt"
                ? `Baseado em ${identity.city} — ${identity.region}. Disponível para remoto, híbrido e presencial na região de Campinas.`
                : `Based in ${identity.city} — ${identity.region}, Brazil. Available for remote, hybrid and on-site work in the Campinas region.`}
            </p>
            <a
              className={styles.cv}
              href={`${import.meta.env.BASE_URL}${cvFile}`}
              download
            >
              {ui.hero.cv[locale]}
              <svg
                viewBox="0 0 12 14"
                width="10"
                height="12"
                aria-hidden="true"
              >
                <path
                  d="M6 0v10M2 6.5 6 10.5 10 6.5M0.5 13.5h11"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                />
              </svg>
            </a>
          </Reveal>
        </div>
      </div>

      <footer className={styles.footer}>
        <div className="wrap">
          <div className={styles.footInner}>
            <p className={styles.built}>{ui.footer.built[locale]}</p>
            <p className={styles.rights}>
              © {new Date().getFullYear()} {identity.full}.{" "}
              {ui.footer.rights[locale]}
            </p>
            <p className={styles.build}>
              <span>
                {stats.publicRepos} repos · {stats.contributionsLastYear}{" "}
                contrib
              </span>
              <span className={styles.prov}>
                {provenance === "snapshot"
                  ? ui.common.cached[locale]
                  : ui.common.live[locale]}
              </span>
            </p>
          </div>
        </div>
      </footer>
    </section>
  );
}
