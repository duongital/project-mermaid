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

type ViewMode = 'preview' | 'editor' | 'split';

function App() {
  const [code, setCode] = useState(defaultCode)
  const [viewMode, setViewMode] = useState<ViewMode>('preview')

  const handleViewModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setViewMode(e.target.value as ViewMode);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Mermaid Diagram Editor</h1>
        <div className="view-mode-selector">
          <label htmlFor="view-mode">View:</label>
          <select
            id="view-mode"
            value={viewMode}
            onChange={handleViewModeChange}
            className="view-mode-dropdown"
          >
            <option value="preview">◫ Preview</option>
            <option value="split">◧ Split</option>
            <option value="editor">✎ Editor</option>
          </select>
        </div>
      </header>
      <div className={`split-container view-mode-${viewMode}`}>
        {(viewMode === 'editor' || viewMode === 'split') && (
          <MermaidEditor code={code} onChange={setCode} />
        )}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <MermaidPreview code={code} />
        )}
      </div>
    </div>
  )
}

export default App
