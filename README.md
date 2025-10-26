# Project Mermaid - Interactive Diagram Editor

## Project Architecture Flowchart

```mermaid
graph TB
    subgraph App["Application Layer"]
        AppTsx["App.tsx<br/>(Router Setup)"]
        MainTsx["main.tsx<br/>(Entry Point)"]
    end

    subgraph Components["UI Components"]
        Sidebar["app-sidebar.tsx<br/>(Diagram List)"]
        Editor["MermaidEditor.tsx<br/>(Code Editor)"]
        Preview["MermaidPreview.tsx<br/>(Live Preview)"]
        Modal["DiagramModal.tsx<br/>(Create/Edit)"]
    end

    subgraph Services["Services & Utils"]
        DB["diagramDB.ts<br/>(IndexedDB)"]
        Utils["utils.ts<br/>(Helpers)"]
        Hooks["use-mobile.tsx<br/>(Mobile Detection)"]
    end

    subgraph External["External Libraries"]
        Mermaid["Mermaid 11.12<br/>(Rendering)"]
        Panzoom["Panzoom 9.4<br/>(Navigation)"]
        Router["React Router DOM<br/>(Navigation)"]
        Tailwind["Tailwind CSS<br/>(Styling)"]
    end

    MainTsx --> AppTsx
    AppTsx --> Sidebar
    AppTsx --> Editor
    AppTsx --> Preview
    Sidebar --> Modal
    Editor --> Utils
    Editor --> DB
    Preview --> Mermaid
    Preview --> Panzoom
    Sidebar --> DB
    Modal --> DB
    AppTsx --> Router
    Components --> Tailwind
    Sidebar --> Hooks

    style AppTsx fill:#3b82f6,color:#fff
    style MainTsx fill:#3b82f6,color:#fff
    style Sidebar fill:#10b981,color:#fff
    style Editor fill:#10b981,color:#fff
    style Preview fill:#10b981,color:#fff
    style Modal fill:#10b981,color:#fff
    style DB fill:#f59e0b,color:#fff
    style Utils fill:#f59e0b,color:#fff
    style Hooks fill:#f59e0b,color:#fff
    style Mermaid fill:#8b5cf6,color:#fff
    style Panzoom fill:#8b5cf6,color:#fff
    style Router fill:#8b5cf6,color:#fff
    style Tailwind fill:#8b5cf6,color:#fff
```

---

## Getting Started

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Preview

```bash
pnpm preview
```

### Lint

```bash
pnpm lint
```

## Tech Stack

- **React 19.1** with TypeScript
- **Vite 7.1** for fast development and building
- **React Router DOM 7.9** for client-side routing
- **Tailwind CSS** with shadcn/ui component library
- **Mermaid 11.12** for diagram rendering
- **Panzoom 9.4** for interactive diagram navigation
- **IndexedDB** for persistent client-side storage
- **React Compiler** enabled for automatic optimizations

## Key Features

- Real-time Mermaid diagram editor with live preview
- Interactive zoom and pan controls
- Multiple view modes: Preview-only, Editor-only, Split view
- Create, edit, rename, and delete diagrams
- Auto-save functionality (1 second after editing stops)
- Persistent storage using IndexedDB
- URL-based routing for individual diagrams
- Responsive design for mobile and desktop
- Modern UI with shadcn/ui components
