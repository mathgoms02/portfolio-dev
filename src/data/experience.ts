import type { Role, Achievement, EventItem, Course } from "./types";

export const roles: Role[] = [
  {
    id: "martinrea-pj",
    company: "Martinrea International",
    title: { pt: "Desenvolvedor de Software", en: "Software Engineer" },
    kind: { pt: "PJ · Tempo integral", en: "Contract · Full-time" },
    start: "2026-05",
    end: null,
    location: "Monte Mor, SP",
    accent: true,
    bullets: {
      pt: [
        "Industrialização de software: pego provas de conceito geradas por IA e as reescrevo como código estruturado, versionado e pronto para produção.",
        "Manutenção e evolução de um sistema corporativo em .NET Framework (C#), aprendendo um ecossistema novo do zero e entregando features nele.",
        "Refatoração guiada por leitura de domínio, entender a regra de negócio antes de tocar no código e system design.",
      ],
      en: [
        "Software industrialization: I take AI-generated proofs of concept and rewrite them as structured, versioned, production-ready code.",
        "Maintenance and evolution of a corporate .NET Framework (C#) system, learning a new ecosystem from scratch and shipping features in it.",
        "Domain-driven refactoring, understand the business rule before touching the code e system design.",
      ],
    },
    stack: ["C#", ".NET Framework", "Python", "SQL", "Git"],
  },
  {
    id: "freelance",
    company: "Freelance",
    title: {
      pt: "Desenvolvedor de Software Autônomo",
      en: "Independent Software Engineer",
    },
    kind: { pt: "Freelance · Remoto", en: "Freelance · Remote" },
    start: "2026-05",
    end: null,
    location: { pt: "Remoto", en: "Remote" },
    remote: true,
    companyNote: {
      pt: "Clínica odontológica · projeto sob NDA",
      en: "Dental clinic · project under NDA",
    },
    bullets: {
      pt: [
        "Sistema de gestão sob medida para o setor de saúde, do levantamento de requisitos ao deploy.",
        "Arquitetura e implementação de banco PostgreSQL robusto, com APIs seguras em Django + DRF.",
        "Interface em React estruturada rigorosamente com CSS Grid, garantindo responsividade total e acessibilidade.",
      ],
      en: [
        "Bespoke management system for the healthcare sector, from requirements to deployment.",
        "Architecture and implementation of a robust PostgreSQL database, with secure APIs on Django + DRF.",
        "React interface built rigorously on CSS Grid, guaranteeing full responsiveness and accessibility.",
      ],
    },
    stack: ["Python", "Django", "DRF", "PostgreSQL", "React", "CSS Grid"],
  },
  {
    id: "motorola",
    company: "Motorola Mobility",
    title: {
      pt: "Estagiário em Pesquisa & Desenvolvimento",
      en: "Research & Development Intern",
    },
    kind: { pt: "Estágio · P&D", en: "Internship · R&D" },
    start: "2024-04",
    end: "2026-04",
    location: "Jaguariúna, SP",
    accent: true,
    bullets: {
      pt: [
        "Ferramentas internas em Python (FastAPI) para automação de processos de engenharia.",
        "Automação de testes em dispositivos Android via ADB e Linux, rodando em lote sem operador.",
        "Coleta e análise de logs para investigação de estabilidade — da captura ao dashboard.",
        "Machine Learning (Random Forest) para classificação automática de issues, com pipeline de retreinamento em CI/CD.",
        "Integração de dados do Jira com interface em Vue.js.",
        "GitLab, Gerrit e Jenkins em ambiente corporativo; experimentação com IA generativa e NLP (Gemini API).",
      ],
      en: [
        "Internal tooling in Python (FastAPI) to automate engineering processes.",
        "Android device test automation over ADB and Linux, running in batch with no operator.",
        "Log collection and analysis for stability investigation — from capture to dashboard.",
        "Machine Learning (Random Forest) for automatic issue classification, with a CI/CD retraining pipeline.",
        "Jira data integration with a Vue.js interface.",
        "GitLab, Gerrit and Jenkins in a corporate environment; experimentation with generative AI and NLP (Gemini API).",
      ],
    },
    stack: [
      "Python",
      "FastAPI",
      "ADB",
      "Linux",
      "Jenkins",
      "GitLab",
      "Gerrit",
      "Vue.js",
      "scikit-learn",
    ],
  },
  {
    id: "martinrea-intern",
    company: "Martinrea International",
    title: {
      pt: "Estagiário em Automação e Qualidade",
      en: "Automation & Quality Intern",
    },
    kind: { pt: "Estágio", en: "Internship" },
    start: "2022-03",
    end: "2024-03",
    location: "Monte Mor, SP",
    bullets: {
      pt: [
        "Automação de processos administrativos com Python, MySQL e VBA.",
        "Desenvolvimento de CRUD em Java + MySQL que eliminou papel e digitação manual da operação.",
        "Dashboards em Power BI e Power Apps para acompanhamento de indicadores.",
        "Otimização de fluxos administrativos e operacionais junto às áreas de negócio.",
      ],
      en: [
        "Administrative process automation with Python, MySQL and VBA.",
        "Java + MySQL CRUD that removed paper and manual data entry from the operation.",
        "Power BI and Power Apps dashboards for indicator tracking.",
        "Optimization of administrative and operational workflows alongside business teams.",
      ],
    },
    stack: ["Python", "Java", "MySQL", "VBA", "Power BI", "Power Apps"],
  },
  {
    id: "unaspython",
    company: "UNASPYTHON — UNASP",
    title: { pt: "Professor e Monitor", en: "Instructor & Teaching Assistant" },
    kind: { pt: "Voluntariado", en: "Volunteer" },
    start: "2023-01",
    end: "2025-12",
    location: "Engenheiro Coelho, SP",
    bullets: {
      pt: [
        "Aulas gratuitas de Python conduzidas por alunos, supervisionadas por professores de Engenharia.",
        "Elaboração de material didático e ensino de lógica de programação do zero.",
      ],
      en: [
        "Free Python classes taught by students, supervised by Engineering faculty.",
        "Authored course material and taught programming logic from scratch.",
      ],
    },
    stack: ["Python", "Didática"],
  },
];

export const achievements: Achievement[] = [
  {
    id: "ssh",
    at: "Motorola Mobility",
    figure: "10h",
    figureNote: { pt: "por semana", en: "per week" },
    headline: { pt: "Automação com Python", en: "Automation with Python" },
    detail: {
      pt: "A coleta de informações era feita máquina por máquina, à mão. Escrevi um coletor em Python sobre SSH que varre todas as máquinas em paralelo e devolve o resultado consolidado — dez horas semanais que voltaram para o time.",
      en: "Information was collected machine by machine, by hand. I wrote a Python collector over SSH that sweeps every machine in parallel and returns a consolidated result — ten weekly hours handed back to the team.",
    },
  },
  {
    id: "logs",
    at: "Motorola Mobility",
    figure: "100%",
    figureNote: { pt: "do manual eliminado", en: "of manual work gone" },
    headline: { pt: "Pipeline de logs", en: "Log pipeline" },
    detail: {
      pt: "Extração e upload de logs deixaram de exigir qualquer intervenção humana: um job no Jenkins captura, trata e publica sozinho. A investigação de estabilidade passou a começar com o dado já na mesa.",
      en: "Log extraction and upload stopped requiring any human intervention: a Jenkins job captures, processes and publishes on its own. Stability investigations now start with the data already on the table.",
    },
  },
  {
    id: "ml",
    at: "Motorola Mobility",
    figure: "CI/CD",
    figureNote: { pt: "retreino automático", en: "automated retraining" },
    headline: {
      pt: "Pipeline de Machine Learning",
      en: "Machine Learning pipeline",
    },
    detail: {
      pt: "Migrei o pipeline do GitLab para o Jenkins e o transformei em esteira de retreinamento: o modelo Random Forest de classificação de issues volta a treinar sozinho a cada novo lote de dados rotulados.",
      en: "I migrated the pipeline from GitLab to Jenkins and turned it into a retraining conveyor: the Random Forest issue-classification model retrains itself on every new batch of labelled data.",
    },
  },
  {
    id: "crud",
    at: "Martinrea International",
    figure: "0",
    figureNote: { pt: "papel na operação", en: "paper in the operation" },
    headline: {
      pt: "Digitalização de processos",
      en: "Process digitalization",
    },
    detail: {
      pt: "Um CRUD em Java sobre MySQL substituiu formulários impressos e digitação manual de dados operacionais. O processo deixou de depender de quem lembrava de preencher.",
      en: "A Java CRUD over MySQL replaced printed forms and manual entry of operational data. The process stopped depending on whoever remembered to fill it in.",
    },
  },
];

export const events: EventItem[] = [
  {
    id: "ibm",
    name: { pt: "Hackathon UNASP × IBM", en: "UNASP × IBM Hackathon" },
    org: "IBM · watsonx.ai",
    year: "2026",
    detail: {
      pt: "Solução de orquestração de voluntários em crises, com agentes de IA sobre watsonx.ai.",
      en: "Crisis volunteer orchestration solution, with AI agents on watsonx.ai.",
    },
  },
  {
    id: "moto",
    name: { pt: "Hackathon interno 24/25", en: "Internal Hackathon 24/25" },
    org: "Motorola Mobility",
    year: "2024 — 2025",
    detail: {
      pt: "Duas edições consecutivas, com soluções focadas em pesquisa e desenvolvimento.",
      en: "Two consecutive editions, with solutions focused on research and development.",
    },
  },
  {
    id: "maratona",
    name: { pt: "Maratona de Programação", en: "Programming Marathon" },
    org: "UNASP",
    year: "2023",
    detail: {
      pt: "72 horas em equipe para resolver um problema real proposto pela banca avaliadora.",
      en: "72 hours as a team solving a real problem posed by the judging panel.",
    },
  },
];

export const courses: Course[] = [
  {
    name: {
      pt: "Python Avançado para Desenvolvimento e Automação",
      en: "Advanced Python for Development & Automation",
    },
  },
  {
    name: {
      pt: "Full Stack com JavaScript e TypeScript — Node.js, React, APIs e Arquitetura",
      en: "Full Stack with JavaScript & TypeScript — Node.js, React, APIs and Architecture",
    },
  },
  {
    name: {
      pt: "Processamento de Linguagem Natural e Large Language Models",
      en: "Natural Language Processing and Large Language Models",
    },
  },
  {
    name: {
      pt: "Programação Orientada a Objetos com Java",
      en: "Object-Oriented Programming with Java",
    },
  },
];
