export type ModelType = {
  id: number;
  name: string;
  fileName: string;
  displayName?: string;
  description?: string;
  modelUrl: string;
  patternUrl: string | null;
  previewUrl?: string | null;
  soundUrl?: string | null;
  videoUrl?: string | null;
}

export type ModelState = {
  models: ModelType[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | undefined;
  currentModel: ModelType | null;
}