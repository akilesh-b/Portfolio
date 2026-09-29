import {
  siArduino,
  siBlender,
  siDocker,
  siEspressif,
  siFastapi,
  siFigma,
  siGit,
  siJavascript,
  siLangchain,
  siMongodb,
  siNodedotjs,
  siOllama,
  siOpencv,
  siPostgresql,
  siPython,
  siPytorch,
  siRaspberrypi,
  siReact,
  siSupabase,
  siTensorflow,
  siThreedotjs,
  siTypescript,
  siUbuntu,
  siVercel,
  type SimpleIcon,
} from 'simple-icons'

export interface Technology {
  name: string
  icon: SimpleIcon
  /** Contextual labels shown on hover / tap */
  context: string[]
}

export const technologies: Technology[] = [
  { name: 'Python', icon: siPython, context: ['AI', 'Backend', 'Automation'] },
  { name: 'JavaScript', icon: siJavascript, context: ['Web', 'Interactivity', 'Frontend'] },
  { name: 'TypeScript', icon: siTypescript, context: ['Type-safe', 'React', 'Tooling'] },
  { name: 'React', icon: siReact, context: ['Interfaces', 'Dashboards', 'SPA'] },
  { name: 'Node.js', icon: siNodedotjs, context: ['APIs', 'Backend', 'Realtime'] },
  { name: 'MongoDB', icon: siMongodb, context: ['Atlas', 'RAG store', 'Documents'] },
  { name: 'PostgreSQL', icon: siPostgresql, context: ['Relational', 'Admin', 'SQL'] },
  { name: 'Docker', icon: siDocker, context: ['Containers', 'Compose', 'Deploy'] },
  { name: 'Git', icon: siGit, context: ['Versioning', 'LFS', 'Teams'] },
  { name: 'Ubuntu', icon: siUbuntu, context: ['Daily driver', 'Linux', 'Servers'] },
  { name: 'Arduino', icon: siArduino, context: ['Embedded', 'Sensors', 'IoT'] },
  { name: 'Blender', icon: siBlender, context: ['3D', 'Modelling', 'GLB export'] },
  { name: 'Three.js', icon: siThreedotjs, context: ['WebGL', '3D web', 'Scroll scenes'] },
]

/** AI / ML libraries and other tools — shown as a secondary rail. */
export const toolbelt: { name: string; icon?: SimpleIcon }[] = [
  { name: 'FastAPI', icon: siFastapi },
  { name: 'PyTorch', icon: siPytorch },
  { name: 'TensorFlow', icon: siTensorflow },
  { name: 'OpenCV', icon: siOpencv },
  { name: 'LangChain', icon: siLangchain },
  { name: 'Ollama', icon: siOllama },
  { name: 'Supabase', icon: siSupabase },
  { name: 'ESP32', icon: siEspressif },
  { name: 'Raspberry Pi', icon: siRaspberrypi },
  { name: 'Figma', icon: siFigma },
  { name: 'Vercel', icon: siVercel },
  { name: 'PaddleOCR' },
  { name: 'Tesseract' },
  { name: 'Whisper' },
  { name: 'PyMuPDF' },
  { name: 'rdflib' },
]
