import type { Project, LabItem } from './types'

export const projects: Project[] = [
  {
    id: 'bussense',
    repo: 'mathgoms02/BusSense',
    index: '001',
    name: 'BusSense',
    year: '2025',
    status: 'shipped',
    tint: '#ffb000',
    role: { pt: 'Autor · TCC', en: 'Author · Capstone' },
    tagline: {
      pt: 'Um ponto de ônibus que responde perguntas',
      en: 'A bus stop that answers questions',
    },
    summary: {
      pt: 'Assistente virtual para transporte público construído em torno de uma pergunta simples: como alguém com deficiência visual descobre qual ônibus está chegando, para onde ele vai e quanto falta? Trabalho de Conclusão de Curso.',
      en: 'A virtual assistant for public transport built around one simple question: how does a visually impaired person find out which bus is arriving, where it goes and how long it takes? Capstone project.',
    },
    problem: {
      pt: 'Informação de transporte público é visual por padrão — placas, painéis, aplicativos com mapa. Para quem não enxerga, o ponto de ônibus é uma caixa preta.',
      en: 'Public transport information is visual by default — signs, panels, map-driven apps. For someone who cannot see, the bus stop is a black box.',
    },
    approach: {
      pt: [
        'Base de dados montada do zero: como a EMTU não expõe API pública, escrevi um pipeline de OCR (pytesseract) que lê prints do aplicativo e devolve linha, tarifa e itinerário completo em JSON.',
        'Back-end em Django + DRF com MongoDB via MongoEngine, guardando rotas, paradas e horários.',
        'Rotas vetorizadas em embeddings, permitindo busca semântica: "quero ir pro centro" encontra a linha certa.',
        'LLM executando localmente com llama.cpp — sem depender de nuvem, sem custo por pergunta, sem enviar a localização de ninguém para fora.',
        'Camada de conversa em linguagem natural sobre os embeddings, com respostas curtas e faladas.',
      ],
      en: [
        'The dataset was built from scratch: with no public EMTU API, I wrote an OCR pipeline (pytesseract) that reads screenshots of the operator app and returns line, fare and full itinerary as JSON.',
        'Django + DRF back-end with MongoDB through MongoEngine, holding routes, stops and schedules.',
        'Routes vectorized into embeddings, enabling semantic search: "I want to go downtown" finds the right line.',
        'LLM running locally through llama.cpp — no cloud dependency, no per-question cost, nobody\'s location leaving the device.',
        'A natural-language conversation layer over the embeddings, with short spoken answers.',
      ],
    },
    outcome: {
      pt: [
        'Assistente funcional respondendo sobre rotas reais a partir de linguagem natural.',
        'Arquitetura offline-first: o modelo roda em CPU, viável para hardware embarcado no ponto.',
      ],
      en: [
        'A working assistant answering about real routes from natural language.',
        'Offline-first architecture: the model runs on CPU, viable for hardware embedded in the stop.',
      ],
    },
    stack: ['Python', 'Django', 'DRF', 'MongoDB', 'MongoEngine', 'llama.cpp', 'HuggingFace', 'Embeddings'],
    links: [{ label: { pt: 'Repositório', en: 'Repository' }, href: 'https://github.com/mathgoms02/BusSense', kind: 'repo' }],
  },
  {
    id: 'innovation',
    repo: 'mathgoms02/innovation-management-platform',
    index: '002',
    name: 'Innovation Management Platform',
    year: '2026',
    status: 'active',
    tint: '#00f0ff',
    role: { pt: 'Autor · Full-stack', en: 'Author · Full-stack' },
    tagline: {
      pt: 'A plataforma que roda o hackathon inteiro',
      en: 'The platform that runs the whole hackathon',
    },
    summary: {
      pt: 'Sistema completo de gestão de hackathons: inscrição, formação de times, submissão de projetos, avaliação por jurados com critérios ponderados e ranking dinâmico. Onze sprints, quatro papéis de usuário, observabilidade de ponta a ponta.',
      en: 'A complete hackathon management system: registration, team formation, project submission, weighted-criteria judging and dynamic ranking. Eleven sprints, four user roles, end-to-end observability.',
    },
    problem: {
      pt: 'Organizar um hackathon significa planilhas, formulários e um grupo de WhatsApp em chamas. As notas somem, os prazos escorrem e ninguém sabe quem avaliou o quê.',
      en: 'Running a hackathon means spreadsheets, forms and a WhatsApp group on fire. Scores vanish, deadlines slip and nobody knows who judged what.',
    },
    approach: {
      pt: [
        'Django 5 + DRF com SimpleJWT, controle de acesso por papel (Admin, Organizador, Participante, Jurado) e auditoria de login.',
        'Notificações em tempo real com Django Channels, Daphne e Redis — o participante sabe na hora que foi aceito no time.',
        'Cockpit do organizador em React 19 + TypeScript: criar evento, definir critérios e pesos, designar jurados, publicar anúncios — tudo pela interface, sem Django Admin.',
        'Observabilidade real: logging estruturado com structlog, trilha de auditoria de ações administrativas e health checks.',
        'LGPD desde o desenho: auto-cadastro restrito a participante, refresh automático de JWT e anonimização de dados na exclusão de conta.',
      ],
      en: [
        'Django 5 + DRF with SimpleJWT, role-based access control (Admin, Organizer, Participant, Judge) and login auditing.',
        'Real-time notifications with Django Channels, Daphne and Redis — participants know the moment they are accepted into a team.',
        'Organizer cockpit in React 19 + TypeScript: create events, set criteria and weights, assign judges, publish announcements — all through the UI, no Django Admin.',
        'Genuine observability: structured logging with structlog, an audit trail for administrative actions, and health checks.',
        'LGPD by design: self-registration restricted to participants, automatic JWT refresh and data anonymization on account deletion.',
      ],
    },
    outcome: {
      pt: [
        'Ranking calculado automaticamente a partir de critérios ponderados, exportável em CSV.',
        'Fluxo de solicitação de entrada em time com aprovação do líder e uma liderança por evento.',
        'Sprint de performance dedicada à eliminação de N+1 e ao refino de UX.',
      ],
      en: [
        'Ranking computed automatically from weighted criteria, exportable to CSV.',
        'Team join-request flow with leader approval and one leadership per event.',
        'A dedicated performance sprint for N+1 elimination and UX refinement.',
      ],
    },
    stack: ['Django 5', 'DRF', 'SimpleJWT', 'Channels', 'Redis', 'Daphne', 'structlog', 'React 19', 'TypeScript', 'Vite', 'Recharts', 'WebSocket'],
    links: [{ label: { pt: 'Repositório', en: 'Repository' }, href: 'https://github.com/mathgoms02/innovation-management-platform', kind: 'repo' }],
  },
  {
    id: 'impact',
    repo: 'mathgoms02/impact-orchestrator',
    index: '003',
    name: 'Impact Orchestrator',
    year: '2026',
    status: 'shipped',
    tint: '#0f62fe',
    role: { pt: 'Equipe · Hackathon IBM', en: 'Team · IBM Hackathon' },
    tagline: {
      pt: 'Em crise, tempo é vida — e triagem manual custa tempo',
      en: 'In a crisis, time is life — and manual triage costs time',
    },
    summary: {
      pt: 'Plataforma de orquestração de voluntariado para situações de desastre. Três agentes de IA sobre IBM watsonx.ai leem a demanda emergencial em linguagem natural, cruzam com o banco de voluntários e disparam a convocação.',
      en: 'A volunteering orchestration platform for disaster situations. Three AI agents on IBM watsonx.ai read the emergency demand in natural language, match it against the volunteer base and fire off the call-up.',
    },
    problem: {
      pt: 'O gargalo das ONGs em emergências não é falta de voluntário — é não conseguir alocar rápido a pessoa certa na necessidade certa.',
      en: "The bottleneck for NGOs in emergencies is not a shortage of volunteers — it is being unable to quickly match the right person to the right need.",
    },
    approach: {
      pt: [
        'Arquitetura de três deployments especializados no watsonx.ai: estruturação da crise, match de perfil e geração da comunicação.',
        'Painel duplo — instituições descrevem a emergência em texto livre; voluntários mantêm habilidades e disponibilidade.',
        'Back-end Django REST com SimpleJWT; front-end React (Vite) construído em CSS Grid.',
      ],
      en: [
        'Three specialized watsonx.ai deployments: crisis structuring, profile matching and communication generation.',
        'A dual dashboard — institutions describe the emergency in free text; volunteers keep skills and availability up to date.',
        'Django REST back-end with SimpleJWT; React (Vite) front-end built on CSS Grid.',
      ],
    },
    outcome: {
      pt: [
        'MVP funcional apresentado no Hackathon UNASP × IBM 2026, com vídeo de demonstração.',
        'Convocação automática gerada em linguagem natural a partir do match.',
      ],
      en: [
        'A working MVP presented at the UNASP × IBM Hackathon 2026, with a demo video.',
        'Automatic call-up messages generated in natural language from the match.',
      ],
    },
    stack: ['IBM watsonx.ai', 'Granite', 'Llama', 'Python', 'Django REST', 'SimpleJWT', 'React', 'Vite', 'CSS Grid'],
    links: [
      { label: { pt: 'Repositório', en: 'Repository' }, href: 'https://github.com/mathgoms02/impact-orchestrator', kind: 'repo' },
      { label: { pt: 'Vídeo da demo', en: 'Demo video' }, href: 'https://drive.google.com/file/d/1rbYigVBVMe6TLDxsGRAvrpbPFnI1xK2Y/view?usp=sharing', kind: 'video' },
    ],
  },
  {
    id: 'smartgym',
    repo: 'mathgoms02/gestao-de-treinos-api',
    index: '004',
    name: 'Smart Gym',
    year: '2026',
    status: 'active',
    tint: '#57d97b',
    role: { pt: 'Autor · API + Front', en: 'Author · API + Front' },
    tagline: {
      pt: 'Duas bases de código, um contrato',
      en: 'Two codebases, one contract',
    },
    summary: {
      pt: 'Gestão de treinos com front-end e API deliberadamente separados em repositórios independentes, comunicando por contrato. Exercício de disciplina arquitetural — e a interface foi construída com CSS Grid do zero, sem framework de UI.',
      en: 'Workout management with the front-end and the API deliberately split into independent repositories, talking through a contract. An exercise in architectural discipline — and the interface was built with CSS Grid from scratch, with no UI framework.',
    },
    approach: {
      pt: [
        'API em TypeScript, containerizada com Docker, independente do cliente que a consome.',
        'Front-end em Next.js + TypeScript, com layouts complexos resolvidos estritamente em CSS Grid.',
        'Recusa consciente de soluções genéricas de layout, para manter controle total sobre responsividade e performance visual.',
      ],
      en: [
        'TypeScript API, containerized with Docker, independent from whichever client consumes it.',
        'Next.js + TypeScript front-end, with complex layouts solved strictly in CSS Grid.',
        'A deliberate refusal of generic layout solutions, to keep full control over responsiveness and visual performance.',
      ],
    },
    stack: ['TypeScript', 'Node.js', 'Docker', 'Next.js', 'CSS Grid', 'REST'],
    links: [
      { label: { pt: 'API', en: 'API' }, href: 'https://github.com/mathgoms02/gestao-de-treinos-api', kind: 'repo' },
      { label: { pt: 'Front-end', en: 'Front-end' }, href: 'https://github.com/mathgoms02/gestao-de-treinos-frontend', kind: 'repo' },
    ],
  },
  {
    id: 'empregaai',
    repo: 'mathgoms02/EmpregaAI',
    index: '005',
    name: 'EmpregaAI',
    year: '2025',
    status: 'shipped',
    tint: '#ff4d1c',
    role: { pt: 'Autor · Full-stack', en: 'Author · Full-stack' },
    tagline: {
      pt: 'Um chatbot que escreve o seu currículo',
      en: 'A chatbot that writes your résumé',
    },
    summary: {
      pt: 'Assistente de carreira que entrevista o candidato, monta o currículo a partir das respostas e devolve um PDF pronto — além de sugerir vagas compatíveis com o perfil levantado.',
      en: 'A career assistant that interviews the candidate, assembles a résumé from the answers and returns a finished PDF — plus job suggestions matched to the profile it just built.',
    },
    approach: {
      pt: [
        'Entrevista conduzida por agente sobre a API do Google Gemini, coletando experiência, habilidades e objetivos.',
        'Geração do currículo em HTML estruturado e conversão para PDF com WeasyPrint.',
        'Agente buscador separado, responsável por sugerir vagas a partir do perfil consolidado.',
        'Back-end Flask com front-end próprio em HTML, CSS e JavaScript.',
      ],
      en: [
        'An agent-led interview over the Google Gemini API, collecting experience, skills and goals.',
        'Résumé generation as structured HTML and conversion to PDF with WeasyPrint.',
        'A separate search agent responsible for suggesting roles from the consolidated profile.',
        'Flask back-end with a hand-written HTML, CSS and JavaScript front-end.',
      ],
    },
    stack: ['Python', 'Flask', 'Google Gemini', 'WeasyPrint', 'HTML', 'CSS', 'JavaScript'],
    links: [{ label: { pt: 'Repositório', en: 'Repository' }, href: 'https://github.com/mathgoms02/EmpregaAI', kind: 'repo' }],
  },
  {
    id: 'shekinah',
    index: '006',
    name: 'Shekinah Manager',
    year: '2026',
    status: 'active',
    tint: '#e8b4a0',
    role: { pt: 'Autor · Mobile', en: 'Author · Mobile' },
    restricted: {
      pt: 'Repositório privado — sistema de um produtor rural.',
      en: 'Private repository — a smallholder farm\u2019s own system.',
    },
    tagline: {
      pt: 'O caderno do sítio virou aplicativo',
      en: 'The farm ledger became an app',
    },
    summary: {
      pt: 'Aplicativo Android para o Sítio Shekinah registrar coleta e venda de ovos, ração, custos e mão de obra. Substitui o caderno de anotações por dados sincronizados na nuvem — e devolve o mês fechado em planilha ou PDF.',
      en: 'An Android app for Sítio Shekinah to record egg collection and sales, feed, costs and labour. It replaces the paper notebook with cloud-synced data — and hands back the closed month as a spreadsheet or PDF.',
    },
    problem: {
      pt: 'Quem toca um sítio anota tudo à mão e só descobre se o mês fechou no azul quando alguém senta para somar. O dado existe, mas não é utilizável.',
      en: 'Whoever runs a smallholding writes everything down by hand and only finds out whether the month closed in the black when someone sits down to add it up. The data exists, but it is not usable.',
    },
    approach: {
      pt: [
        'React Native com Expo e TypeScript, entregue como app Android instalável — o usuário final não abre terminal.',
        'Firebase Firestore para sincronização em nuvem, com AsyncStorage guardando o estado local: o sítio nem sempre tem sinal.',
        'Exportação para XLSX e PDF direto do aparelho, para o produtor mandar ao contador sem intermediário.',
        'Interface e nomes de tela em português e no vocabulário de quem usa — bandeja, cesto, ração — não no vocabulário do banco de dados.',
      ],
      en: [
        'React Native with Expo and TypeScript, delivered as an installable Android app — the end user never opens a terminal.',
        'Firebase Firestore for cloud sync, with AsyncStorage holding local state: the farm does not always have signal.',
        'XLSX and PDF export straight from the device, so the owner can send it to the accountant with nobody in between.',
        'Screens named in the vocabulary of the people using them — trays, baskets, feed — not in the vocabulary of the database.',
      ],
    },
    stack: ['React Native', 'Expo', 'TypeScript', 'Firebase', 'Firestore', 'XLSX', 'expo-print'],
    links: [],
  },
  {
    id: 'clinica',
    index: '007',
    name: 'Clinic Manager',
    year: '2026',
    status: 'active',
    tint: '#7aa7ff',
    role: { pt: 'Freelance · Full-stack', en: 'Freelance · Full-stack' },
    restricted: {
      pt: 'Projeto sob acordo de confidencialidade — sem repositório público.',
      en: 'Project under a confidentiality agreement — no public repository.',
    },
    tagline: {
      pt: 'Software de saúde tem outro padrão de erro',
      en: 'Healthcare software has a different error bar',
    },
    summary: {
      pt: 'Sistema de gestão sob medida para uma clínica odontológica, do levantamento de requisitos ao deploy. Projeto sob NDA — o que dá para contar é a engenharia.',
      en: 'A bespoke management system for a dental clinic, from requirements gathering to deployment. Under NDA — what can be told is the engineering.',
    },
    problem: {
      pt: 'Clínica é um domínio onde um registro errado não é um bug: é um paciente atendido com a informação errada. E software genérico de gestão não fala a língua do consultório.',
      en: 'A clinic is a domain where a wrong record is not a bug: it is a patient treated on wrong information. And off-the-shelf management software does not speak the practice\u2019s language.',
    },
    approach: {
      pt: [
        'Modelagem de um banco PostgreSQL robusto, desenhado a partir do fluxo real da clínica e não de um template.',
        'APIs seguras em Django + Django REST, com autenticação e controle de acesso por papel.',
        'Front-end em React estruturado rigorosamente em CSS Grid, para responsividade total e acessibilidade — a recepção usa desktop, o dentista usa tablet.',
      ],
      en: [
        'A robust PostgreSQL model, designed from the clinic\u2019s real workflow rather than from a template.',
        'Secure APIs on Django + Django REST, with authentication and role-based access control.',
        'A React front-end built rigorously on CSS Grid for full responsiveness and accessibility — the front desk is on desktop, the dentist is on a tablet.',
      ],
    },
    stack: ['Python', 'Django', 'DRF', 'PostgreSQL', 'React', 'CSS Grid'],
    links: [],
  },
]

/** Smaller experiments, coursework and one-offs — the sketchbook. */
export const lab: LabItem[] = [
  { repo: 'mathgoms02/Facial-Recognition-using-Fourier-Transform-with-Python', name: 'Facial Recognition · Fourier', year: '2025', tags: ['Python', 'DSP'], note: { pt: 'Reconhecimento facial via transformada de Fourier, para Linguagens Formais e Autômatos.', en: 'Face recognition through the Fourier transform, for Formal Languages and Automata.' } },
  { repo: 'mathgoms02/emtu-data-from-prints', name: 'EMTU OCR', year: '2025', tags: ['Python', 'OCR', 'Tesseract'], note: { pt: 'Pipeline que lê prints do app da EMTU e devolve linha, tarifa e itinerário em JSON — a base de dados do BusSense.', en: 'A pipeline that reads screenshots of the EMTU app and returns line, fare and itinerary as JSON — the dataset behind BusSense.' } },
  { repo: 'mathgoms02/computacao_grafica', name: 'Computação Gráfica', year: '2026', tags: ['OpenGL', 'NumPy'], note: { pt: 'OpenGL, padrões de Moiré, serrilhado e histogramas de cor — o semestre que explica a estética desta página.', en: 'OpenGL, Moiré patterns, aliasing and colour histograms — the semester that explains this page\u2019s aesthetic.' } },
  { repo: 'mathgoms02/cat-dog', name: 'cat-dog', year: '2025', tags: ['TensorFlow', 'CNN'], note: { pt: 'Primeiro projeto de IA: classificador de imagens com TensorFlow.', en: 'First AI project: an image classifier with TensorFlow.' } },
  { repo: 'mathgoms02/pix2pix_pjr', name: 'pix2pix', year: '2025', tags: ['Python', 'GAN'], note: { pt: 'Tradução imagem-para-imagem com rede adversarial condicional.', en: 'Image-to-image translation with a conditional adversarial network.' } },
  { repo: 'mathgoms02/carro_robo', name: 'carro robô', year: '2025', tags: ['C++', 'Robotics'], note: { pt: 'Carro autônomo montado e programado na disciplina de robótica.', en: 'Autonomous car assembled and programmed in the robotics course.' } },
  { repo: 'mathgoms02/sistemas_controles', name: 'Sistemas de Controle', year: '2024', tags: ['Python', 'Control'], note: { pt: 'Simulações de sistemas de controle do oitavo semestre.', en: 'Control systems simulations from the eighth semester.' } },
  { repo: 'mathgoms02/digital-ordering-system', name: 'Digital Ordering', year: '2026', tags: ['Django', 'React'], note: { pt: 'Sistema de pedidos construído apenas com documentação oficial, começando pelo back-end.', en: 'An ordering system built purely from official documentation, starting with the back-end.' } },
  { repo: 'mathgoms02/DjangoBookstore', name: 'Django Bookstore', year: '2024', tags: ['Django'], note: { pt: 'Livraria completa em Django — primeiro contato sério com o framework.', en: 'A full bookstore in Django — the first serious contact with the framework.' } },
  { repo: 'mathgoms02/imersao-dados-alura', name: 'Imersão Dados', year: '2025', tags: ['Pandas', 'Notebook'], note: { pt: 'Análise exploratória de dados em notebooks.', en: 'Exploratory data analysis in notebooks.' } },
  { repo: 'mathgoms02/termo_de_cria', name: 'termo de cria', year: '2024', tags: ['Python', 'CLI'], note: { pt: 'Clone do jogo Termo rodando no terminal.', en: 'A terminal-based clone of the game Termo.' } },
  { repo: 'mathgoms02/barcode_codification', name: 'barcode', year: '2024', tags: ['Python'], note: { pt: 'Gerador de código de barras para uso interno.', en: 'A barcode generator for internal use.' } },
  { repo: 'mathgoms02/qr_codificator', name: 'qr codificator', year: '2024', tags: ['Python'], note: { pt: 'Gerador de QR Codes.', en: 'A QR Code generator.' } },
  { repo: 'mathgoms02/criando_primeiro_app', name: 'primeiro app', year: '2024', tags: ['React Native'], note: { pt: 'Primeiro aplicativo em React Native, base para o projeto de faculdade.', en: 'First React Native app, groundwork for the university project.' } },
]