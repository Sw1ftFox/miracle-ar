export type FilesState = {
  files: string[];
  isSuccess: boolean;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | undefined;
}

export const FileTypes = {
  DEFAULT: "default",
  MODELS: "models",
  CATEGORIES: "categories",
  SOUNDS: "sounds",
  PREVIEWS: "previews",
  // DESCRIPTIONS: "descriptions",
  PATTERNS: "patterns",
  VIDEOS: "videos",
} as const;

export type SectionType = typeof FileTypes[keyof typeof FileTypes];

const SECTION_SET = new Set(Object.values(FileTypes));

export function isSectionType(value: string): value is SectionType {
  return SECTION_SET.has(value as SectionType);
}

export type FileType = {
  type: SectionType;
  fileName: string;
}

export type FileResponse = {
  type: SectionType;
  data: string[];
}