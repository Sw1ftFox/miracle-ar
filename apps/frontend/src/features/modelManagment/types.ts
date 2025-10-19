export type ModelType = {
  id: string; // "Полонский" (имя без расширения)
  name: string; // "Полонский.glb"
  // modelUrl: string; // "/api/files/models/Полонский.glb"
  // patternUrl: string; // "/api/files/patterns/Полонский.patt"
  soundUrl?: string; // "/api/files/sounds/Полонский.mp3" (если есть)
  previewUrl?: string; // "/api/files/images/Полонский.jpg" (если есть)
  description?: string; // Текст из "/api/models/description/Полонский.txt"
  isCurrent: boolean; // Сравнить с /api/models/current
}

export type AppState = {
  models: ModelType[];
  currentModel: string | null;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
}