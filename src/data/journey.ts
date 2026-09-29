export interface JourneyEntry {
  year: string
  title: string
  description: string
  tags?: string[]
  current?: boolean
}

export const journey: JourneyEntry[] = [
  {
    year: '2026',
    title: 'AI Engineering',
    description: 'Building advanced AI systems and products — agents, local LLMs, multimodal pipelines and MCP experiments.',
    tags: ['Agents', 'Local LLMs', 'MCP'],
    current: true,
  },
  {
    year: '2025',
    title: 'LENS Project',
    description: 'Visual intelligence platform for documents and figures — OCR, visual analysis and knowledge graphs.',
    tags: ['OCR', 'Vision', 'KG'],
  },
  {
    year: '2025',
    title: 'Company Policy AI',
    description: 'RAG-powered HR policy assistant with private knowledge base and cited answers.',
    tags: ['RAG', 'MongoDB'],
  },
  {
    year: '2025',
    title: 'Hackathons',
    description: 'Prathiyogitha-2 Hackathon at Kongu Engineering College, Erode — rapid prototyping in a team, plus workshops and mentoring juniors.',
    tags: ['Teamwork', 'Prototyping'],
  },
  {
    year: '2024',
    title: 'B.E. Computer Science',
    description: 'Started CSE at KGiSL Institute of Technology, Coimbatore — backend, databases, Linux, Docker and full-stack apps.',
    tags: ['CSE', '2024 — 2028'],
  },
  {
    year: '2023',
    title: 'Started My Journey',
    description: 'Exploring programming, web development and AI/ML — Python, OOP, HTML/CSS, JavaScript and Git.',
    tags: ['Python', 'Web'],
  },
]

export const philosophy = ['Idea', 'Research', 'Design', 'Build', 'Test', 'Iterate', 'Product']
