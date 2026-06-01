export type ModelType = {
  id: number;
  name: string;
  fileName: string;
  displayName?: string;
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