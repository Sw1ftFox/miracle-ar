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
  files: string[];
  currentModel: null | ModelType;
  isSuccess: boolean;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | undefined;
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