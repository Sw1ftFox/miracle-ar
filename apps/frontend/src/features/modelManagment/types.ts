export type ModelType = {
  id: string; // "Полонский" (имя без расширения)
  name: string; // "Полонский.glb"
  previewUrl?: string; 
  description?: string; 
  modelUrl: string; 
  patternUrl: string; 
  soundUrl?: string; 
}

export type AppState = {
  models: ModelType[];
  files: string[];
  isSuccess: boolean;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | undefined;
  currentModel: ModelType | null;
}

export const FileTypes = {
  DEFAULT: "default",
  MODELS: "models",
  SOUNDS: "sounds",
  PREVIEWS: "previews",
  DESCRIPTIONS: "descriptions",
  PATTERNS: "patterns",
} as const;

export type SectionType = typeof FileTypes[keyof typeof FileTypes];

const SECTION_SET = new Set(Object.values(FileTypes));

export function isSectionType(value: string): value is SectionType {
  return SECTION_SET.has(value as SectionType);
}

export type FileResponse = {
  type: SectionType;
  data: string[];
}

export type FileDelete = {
  type: SectionType;
  fileName: string;
}