# Project Mermaid - Interactive Diagram Editor

## Overview
Project Mermaid is a React-based web application for creating, editing, and managing Mermaid diagrams with a modern, user-friendly interface. It runs entirely in the browser with no backend required.

## Package Management
- use pnpm to install or uninstall packages

## Core Features

### 1. Diagram Editor & Preview
- Real-time Mermaid diagram editor with live preview
- Code editor with monospace font for writing Mermaid syntax
- Interactive preview with pan and zoom capabilities (using panzoom library)
- Zoom controls: zoom in/out, center, reset zoom with percentage display
- View modes: Preview-only, Editor-only, or Split view (toggle between them)

### 2. Diagram Management
- Create, edit, rename, and delete diagrams
- Persistent storage using IndexedDB for client-side data persistence
- Auto-save functionality (saves 1 second after editing stops)
- Sidebar navigation showing all saved diagrams
- URL-based routing for individual diagrams (`/:id`)

## Technical Stack

### Frontend
- **Framework**: React 19.1 with TypeScript
- **Build Tool**: Vite 7.1
- **Routing**: React Router DOM 7.9
- **Styling**: Tailwind CSS with shadcn/ui component library (Radix UI primitives)
- **Diagram Rendering**: Mermaid 11.12
- **Interactions**: Panzoom 9.4 for diagram navigation
- **State Management**: React hooks (useState, useEffect)
- **Database**: IndexedDB for browser-based persistence

### Development Tools
- TypeScript 5.9
- ESLint 9.36
- React Compiler (enabled for optimizations)
- Autoprefixer & PostCSS

## Project Structure

```
src/
├── App.tsx                     # Main app with routing logic
├── main.tsx                    # Application entry point
├── components/
│   ├── MermaidEditor.tsx       # Code editor component
│   ├── MermaidPreview.tsx      # Preview with zoom/pan controls
│   ├── app-sidebar.tsx         # Diagram list sidebar
│   └── DiagramModal.tsx        # Create/edit diagram modal
├── services/
│   └── diagramDB.ts            # IndexedDB wrapper for persistence
├── lib/
│   ├── utils.ts                # Utility functions
│   └── hooks/
│       └── use-mobile.tsx      # Mobile detection hook
└── ui/                         # shadcn/ui components (40+ components)
    ├── button.tsx
    ├── card.tsx
    ├── sidebar.tsx
    ├── dialog.tsx
    ├── alert-dialog.tsx
    └── ... (other shadcn/ui components)
```

## Key Functionality

### Auto-save
- Diagrams automatically save 1 second after code changes
- Prevents data loss with automatic persistence

### Database Operations (IndexedDB)
- **Create**: Add new diagrams with name and code
- **Read**: Load all diagrams or specific diagram by ID
- **Update**: Modify diagram name or code with automatic updatedAt timestamp
- **Delete**: Remove diagrams with confirmation dialog

### Navigation & Routing
- `/` - Home view (default diagram)
- `/:id` - Specific diagram view
- URL-based navigation with diagram IDs
- Auto-redirect if diagram not found

### Error Handling
- Gracefully handles diagram rendering errors
- Displays error messages in preview when Mermaid syntax is invalid
- Database initialization error handling

## Component Details

### App.tsx (src/App.tsx:1)
Main application component with:
- React Router setup for navigation
- Database initialization on mount
- Auto-save logic for diagrams
- View mode state management (preview/editor/split)

### MermaidEditor.tsx (src/components/MermaidEditor.tsx:1)
- Textarea-based code editor
- Monospace font styling
- Real-time onChange updates
- Card-based layout

### MermaidPreview.tsx (src/components/MermaidPreview.tsx:1)
- Mermaid diagram rendering with error handling
- Panzoom integration for interactive navigation
- Zoom controls (in/out/center/reset)
- Automatic diagram centering and fit-to-view

### app-sidebar.tsx (src/components/app-sidebar.tsx:1)
- Lists all saved diagrams
- Create/edit/delete diagram actions
- Active diagram highlighting
- Modal dialogs for create/edit operations
- Confirmation dialog for deletions

### diagramDB.ts (src/services/diagramDB.ts:1)
IndexedDB wrapper providing:
- Database initialization with proper schema
- CRUD operations with Promise-based API
- Automatic timestamp management
- Type-safe Diagram interface

## Data Model

```typescript
interface Diagram {
  id?: number;              // Auto-incremented primary key
  name: string;             // Diagram name
  code: string;             // Mermaid syntax code
  createdAt: Date;          // Creation timestamp
  updatedAt: Date;          // Last update timestamp
}
```

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run linter
pnpm lint

# Preview production build
pnpm preview
```

## Notable Features

- **Modern UI**: Uses shadcn/ui components for consistent, accessible design
- **No Backend**: Fully client-side application using IndexedDB
- **Fast Development**: Vite HMR for instant feedback
- **Type Safety**: Full TypeScript coverage
- **React Compiler**: Automatic optimizations enabled
- **Responsive Design**: Tailwind CSS for mobile-friendly layouts
