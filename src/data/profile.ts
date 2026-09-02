import type { L, Link, Metric } from "./types";

export const identity = {
  first: "Matheus",
  last: "Gomes",
  full: "Matheus Filipe da Silva Gomes",
  handle: "mathgoms02",
  role: { pt: "Desenvolvedor de Software", en: "Software Engineer" } as L,
  city: "Monte Mor · SP",
  region: "São Paulo",
  country: "BR",
  timezone: "America/Sao_Paulo",
  coords: { lat: -22.9469, lon: -47.3153 },
  since: 2022,
};

export const availability = {
  open: true,
  label: {
    pt: "Aberto a novas oportunidades",
    en: "Open to new opportunities",
  } as L,
};

export const contact: Link[] = [
  {
    label: "Email",
    href: "mailto:math.gomsx3@gmail.com",
    handle: "math.gomsx3@gmail.com",
  },
  {
    label: "GitHub",
    href: "https://github.com/mathgoms02",
    handle: "@mathgoms02",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/mathgomsit/",
    handle: "/in/mathgomsit",
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/5519991390927",
    handle: "+55 19 99139-0927",
  },
];

export const cvFile = "matheus-gomes-cv.pdf";

/**
 * The one-paragraph pitch. Kept deliberately short — the sections below
 * carry the evidence.
 */
export const summary: L = {
  pt: "Engenheiro de Computação graduado pelo UNASP. Passei quatro anos entre o chão de fábrica e o laboratório de P&D: automatizei o que era manual na Martinrea, construí ferramentas internas e pipelines de Machine Learning na Motorola, e hoje transformo protótipos gerados por IA em software de produção.",
  en: "Computer Engineer, graduated from UNASP. I spent four years between the factory floor and the R&D lab: I automated manual work at Martinrea, built internal tooling and Machine Learning pipelines at Motorola, and today I turn AI-generated prototypes into production software.",
};

export const positioning: L<string[]> = {
  pt: [
    "Python e automação como base. SSH, ADB, Linux, scripts que rodam sem ninguém olhando.",
    "APIs seguras com Django REST e FastAPI, com autenticação, auditoria e controle de acesso por papel.",
    "Front-end construído com CSS Grid de verdade: layout pensado, responsivo e acessível(não empilhamento de componentes prontos).",
    "IA aplicada a problema real: LLMs locais, embeddings, watsonx.ai, Gemini. Sempre resolvendo algo que dói.",
  ],
  en: [
    "Python and automation as the foundation. SSH, ADB, Linux, scripts that run unattended.",
    "Secure APIs with Django REST and FastAPI, with authentication, audit trails and role-based access control.",
    "Front-end built on real CSS Grid: deliberate, responsive and accessible layout (not a stack of off-the-shelf components).",
    "AI applied to real problems: local LLMs, embeddings, watsonx.ai, Gemini. Always solving something that hurts.",
  ],
};

export const metrics: Metric[] = [
  {
    id: "years",
    value: 4,
    suffix: "+",
    label: { pt: "anos escrevendo software", en: "years shipping software" },
    note: { pt: "desde 2022", en: "since 2022" },
  },
  {
    id: "hours",
    value: 10,
    suffix: "h",
    label: { pt: "devolvidas por semana", en: "given back every week" },
    note: {
      pt: "coleta via SSH em múltiplas máquinas, automatizada",
      en: "multi-machine SSH collection, automated",
    },
  },
  {
    id: "manual",
    value: 100,
    suffix: "%",
    label: {
      pt: "do trabalho manual de logs eliminado",
      en: "of manual log work eliminated",
    },
    note: {
      pt: "extração e upload via Jenkins",
      en: "extraction and upload via Jenkins",
    },
  },
  {
    id: "hackathons",
    value: 3,
    label: {
      pt: "maratonas e hackathons",
      en: "hackathons and code marathons",
    },
    note: {
      pt: "Motorola (2x), UNASP + IBM",
      en: "Motorola (2x), UNASP + IBM",
    },
  },
];

export const education = {
  degree: {
    pt: "Engenharia da Computação — Bacharelado",
    en: "Computer Engineering — Bachelor's",
  } as L,
  school: "UNASP",
  schoolFull: {
    pt: "Centro Universitário Adventista de São Paulo",
    en: "Adventist University Center of São Paulo",
  } as L,
  start: "2021-07",
  end: "2026-07",
  status: { pt: "Concluído", en: "Completed" } as L,
};

export const spokenLanguages = [
  {
    name: { pt: "Português", en: "Portuguese" } as L,
    level: { pt: "Nativo", en: "Native" } as L,
    dots: 5,
  },
  {
    name: { pt: "Inglês", en: "English" } as L,
    level: { pt: "Avançado", en: "Advanced" } as L,
    dots: 4,
  },
];
