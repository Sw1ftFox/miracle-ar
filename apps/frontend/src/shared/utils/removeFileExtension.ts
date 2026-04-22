export const removeFileExtension = (filename: string): string => {
  return filename.replace(/\.[^/.]+$/, "");
};