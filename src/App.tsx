import { useState } from 'react'
import './App.css'
import MermaidEditor from './components/MermaidEditor'
import MermaidPreview from './components/MermaidPreview'

const defaultCode = `graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]`;

function App() {
  const [code, setCode] = useState(defaultCode)

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Mermaid Diagram Editor</h1>
      </header>
      <div className="split-container">
        <MermaidEditor code={code} onChange={setCode} />
        <MermaidPreview code={code} />
      </div>
    </div>
  )
}

export default App
