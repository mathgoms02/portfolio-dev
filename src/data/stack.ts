import type { StackGroup } from './types'

/** level: 3 = daily driver, 2 = comfortable, 1 = shipped with it */
export const stackGroups: StackGroup[] = [
  {
    id: 'lang',
    label: { pt: 'Linguagens', en: 'Languages' },
    items: [
      { name: 'Python', level: 3, note: { pt: 'linguagem principal', en: 'primary language' } },
      { name: 'TypeScript', level: 3 },
      { name: 'JavaScript', level: 3 },
      { name: 'SQL', level: 3 },
      { name: 'C#', level: 2, note: { pt: '.NET Framework em produção', en: '.NET Framework in production' } },
      { name: 'Java', level: 2 },
      { name: 'C++', level: 1 },
    ],
  },
  {
    id: 'backend',
    label: { pt: 'Back-end', en: 'Back-end' },
    items: [
      { name: 'Django', level: 3 },
      { name: 'Django REST', level: 3 },
      { name: 'FastAPI', level: 3 },
      { name: 'Flask', level: 2 },
      { name: 'Node.js', level: 2 },
      { name: '.NET Framework', level: 2 },
      { name: 'REST APIs', level: 3 },
      { name: 'WebSocket', level: 2 },
      { name: 'JWT', level: 3 },
    ],
  },
  {
    id: 'frontend',
    label: { pt: 'Front-end', en: 'Front-end' },
    items: [
      { name: 'React', level: 3 },
      { name: 'CSS Grid', level: 3, note: { pt: 'layout escrito à mão', en: 'layout written by hand' } },
      { name: 'Next.js', level: 2 },
      { name: 'Vite', level: 3 },
      { name: 'React Native', level: 1 },
      { name: 'Vue.js', level: 1 },
      { name: 'Recharts', level: 2 },
    ],
  },
  {
    id: 'data',
    label: { pt: 'Dados', en: 'Data' },
    items: [
      { name: 'PostgreSQL', level: 3 },
      { name: 'MySQL', level: 3 },
      { name: 'MongoDB', level: 2 },
      { name: 'Redis', level: 2 },
      { name: 'Pandas', level: 2 },
      { name: 'Power BI', level: 2 },
    ],
  },
  {
    id: 'ai',
    label: { pt: 'IA & Machine Learning', en: 'AI & Machine Learning' },
    items: [
      { name: 'scikit-learn', level: 2, note: { pt: 'Random Forest em produção', en: 'Random Forest in production' } },
      { name: 'TensorFlow', level: 1 },
      { name: 'HuggingFace', level: 2 },
      { name: 'llama.cpp', level: 2, note: { pt: 'LLM local em CPU', en: 'local LLM on CPU' } },
      { name: 'Embeddings', level: 2 },
      { name: 'IBM watsonx.ai', level: 2 },
      { name: 'Google Gemini', level: 2 },
      { name: 'NLP', level: 2 },
    ],
  },
  {
    id: 'devops',
    label: { pt: 'DevOps & Infra', en: 'DevOps & Infra' },
    items: [
      { name: 'Git', level: 3 },
      { name: 'Jenkins', level: 3, note: { pt: 'pipelines de CI/CD e retreino', en: 'CI/CD and retraining pipelines' } },
      { name: 'GitLab CI', level: 2 },
      { name: 'Gerrit', level: 2 },
      { name: 'Docker', level: 2 },
      { name: 'Linux', level: 3 },
      { name: 'SSH', level: 3 },
    ],
  },
  {
    id: 'qa',
    label: { pt: 'Testes & Automação', en: 'Testing & Automation' },
    items: [
      { name: 'ADB', level: 3, note: { pt: 'automação em dispositivos Android', en: 'Android device automation' } },
      { name: 'Shell scripting', level: 3 },
      { name: 'Pytest', level: 2 },
      { name: 'VBA', level: 2 },
      { name: 'Scrum', level: 2 },
    ],
  },
]
