export type ModelType = {
  id: string; // "Полонский" (имя без расширения)
  name: string; // "Полонский.glb"
  previewUrl?: string;
  description?: string;
  modelUrl: string;
  patternUrl: string;
  soundUrl?: string;
  videoUrl?: string;
}

export type ModelState = {
  models: ModelType[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | undefined;
  currentModel: ModelType | null;
}