import { v4 as uuidv4 } from "uuid";

export interface Diagram {
  id?: string;
  name: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
}

const DB_NAME = "MermaidDiagramsDB";
const DB_VERSION = 1;
const STORE_NAME = "diagrams";

class DiagramDB {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error("Failed to open database"));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = db.createObjectStore(STORE_NAME, {
            keyPath: "id",
          });

          objectStore.createIndex("name", "name", { unique: false });
          objectStore.createIndex("createdAt", "createdAt", { unique: false });
          objectStore.createIndex("updatedAt", "updatedAt", { unique: false });
        }
      };
    });
  }

  private ensureDB(): IDBDatabase {
    if (!this.db) {
      throw new Error("Database not initialized. Call init() first.");
    }
    return this.db;
  }

  async create(diagram: Omit<Diagram, "id">): Promise<string> {
    const db = this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      const id = uuidv4();
      const diagramWithId = { ...diagram, id };
      const request = store.add(diagramWithId);

      request.onsuccess = () => {
        resolve(id);
      };

      request.onerror = () => {
        reject(new Error("Failed to create diagram"));
      };
    });
  }

  async getAll(): Promise<Diagram[]> {
    const db = this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result as Diagram[]);
      };

      request.onerror = () => {
        reject(new Error("Failed to get diagrams"));
      };
    });
  }

  async getById(id: string): Promise<Diagram | undefined> {
    const db = this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result as Diagram | undefined);
      };

      request.onerror = () => {
        reject(new Error("Failed to get diagram"));
      };
    });
  }

  async update(id: string, diagram: Partial<Diagram>): Promise<void> {
    const db = this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const existingDiagram = getRequest.result;
        if (!existingDiagram) {
          reject(new Error("Diagram not found"));
          return;
        }

        const updatedDiagram = {
          ...existingDiagram,
          ...diagram,
          id,
          updatedAt: new Date(),
        };

        const updateRequest = store.put(updatedDiagram);

        updateRequest.onsuccess = () => {
          resolve();
        };

        updateRequest.onerror = () => {
          reject(new Error("Failed to update diagram"));
        };
      };

      getRequest.onerror = () => {
        reject(new Error("Failed to get diagram for update"));
      };
    });
  }

  async delete(id: string): Promise<void> {
    const db = this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error("Failed to delete diagram"));
      };
    });
  }
}

export const diagramDB = new DiagramDB();
