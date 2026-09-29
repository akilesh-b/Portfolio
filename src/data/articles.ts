import { socialLinks } from '../lib/constants'

export type ArticleArt = 'journey' | 'rag' | 'tools'

export interface Article {
  category: string
  title: string
  description: string
  readingTime: string
  date: string
  art: ArticleArt
  /** Replace with the article's real URL once it is published. */
  url: string
}

export const articles: Article[] = [
  {
    category: 'AI Engineering',
    title: 'My Journey Into AI Engineering as a CSE Student',
    description: 'A reflection on learning by building — the challenges, the experiments and what comes next.',
    readingTime: '5 min read',
    date: 'Sep 2026',
    art: 'journey',
    url: socialLinks.medium,
  },
  {
    category: 'RAG / LLM',
    title: 'Building My First RAG System',
    description: 'How I built a private AI assistant using retrieval, MongoDB and open-source models.',
    readingTime: '7 min read',
    date: 'Sep 2026',
    art: 'rag',
    url: socialLinks.medium,
  },
  {
    category: 'Productivity',
    title: 'Tools I Use as a Developer',
    description: 'The editors, terminals, local models and notes that help me build, learn and stay productive.',
    readingTime: '4 min read',
    date: 'Aug 2026',
    art: 'tools',
    url: socialLinks.medium,
  },
]
