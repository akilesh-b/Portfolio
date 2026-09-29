import { Blocks, BrainCircuit, Box, Eye, FileSearch, Network, Bot, Cpu, Monitor, type LucideIcon } from 'lucide-react'
import { siBlender, siDocker, siGit, siMongodb, siNodedotjs, siPostgresql, siPython, siReact, siThreedotjs } from 'simple-icons'

export interface LabItem {
  title: string
  description: string
  icon: LucideIcon
  status: string
}

export const labItems: LabItem[] = [
  { title: 'RAG Experiments', description: 'Building RAG pipelines with different models, chunkers and retrievers.', icon: FileSearch, status: 'Ongoing' },
  { title: 'AI Agents', description: 'Building autonomous, tool-using agents and multi-step workflows.', icon: Bot, status: 'Exploring' },
  { title: 'Computer Vision', description: 'OCR, layout detection and document intelligence.', icon: Eye, status: 'Ongoing' },
  { title: 'Knowledge Graphs', description: 'Structuring and linking information with RDF & JSON-LD.', icon: Network, status: 'Research' },
  { title: 'Local LLMs', description: 'Running Qwen, Llama and DeepSeek Coder locally with Ollama.', icon: Cpu, status: 'Daily' },
  { title: '3D Experiences', description: 'Interactive 3D web experiments with Blender and Three.js.', icon: Blocks, status: 'Playground' },
]

/** ALIVE agent-based extraction pipeline */
export const alivePipeline = ['PDF Probe', 'Extraction', 'Structurer', 'Validator', 'Knowledge Graph']

export const heroStats = [
  { value: 10, suffix: '+', label: 'Projects' },
  { value: 3, suffix: '+', label: 'Hackathons', pad: true },
  { text: 'AI / ML', label: 'Focused' },
  { text: '∞', label: 'Ideas' },
]

export const aboutStats = [
  { value: 10, suffix: '+', label: 'Projects' },
  { value: 3, suffix: '+', label: 'Hackathons', pad: true },
  { value: 2, suffix: '+', label: 'Years of learning', pad: true },
  { text: '∞', label: 'Ideas' },
]

/** Right-hand focus cards in the hero */
export const heroServices: { title: string; sub: string; icon: LucideIcon; detail: string }[] = [
  { title: 'AI / ML', sub: 'LLM applications', icon: BrainCircuit, detail: 'LLM-powered apps, local models with Ollama, prompt workflows.' },
  { title: 'RAG Systems', sub: 'Knowledge graphs', icon: Network, detail: 'Private knowledge bases with source-aware answers, RDF & JSON-LD.' },
  { title: 'Computer Vision', sub: 'OCR & visual search', icon: Eye, detail: 'PaddleOCR, layout detection and document intelligence.' },
  { title: 'Web Development', sub: 'Modern web apps', icon: Monitor, detail: 'React, Node.js, FastAPI, PostgreSQL and MongoDB.' },
  { title: '3D / Interactive', sub: 'Creative experiences', icon: Box, detail: 'Blender → Three.js scenes and scroll-driven web experiences.' },
]

export const heroTools = [
  { name: 'Python', icon: siPython },
  { name: 'React', icon: siReact },
  { name: 'Node.js', icon: siNodedotjs },
  { name: 'MongoDB', icon: siMongodb },
  { name: 'PostgreSQL', icon: siPostgresql },
  { name: 'Docker', icon: siDocker },
  { name: 'Git', icon: siGit },
  { name: 'Blender', icon: siBlender },
  { name: 'Three.js', icon: siThreedotjs },
]
