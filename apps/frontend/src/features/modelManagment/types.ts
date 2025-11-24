export type ModelType = {
  id: string; // "Полонский" (имя без расширения)
  name: string; // "Полонский.glb"
  previewUrl?: string; // "/api/files/images/Полонский.jpg" (если есть)
  description?: string; // Текст из "/api/models/description/Полонский.txt"
  modelUrl: string; // "/api/files/models/Полонский.glb"
  patternUrl: string; // "/api/files/patterns/Полонский.patt"
  soundUrl?: string; // "/api/files/sounds/Полонский.mp3" (если есть)
  isCurrent: false;
}

export type AppState = {
  models: ModelType[];
  isSuccess: boolean;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | undefined;
}