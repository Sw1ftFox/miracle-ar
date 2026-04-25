import { useState } from "react";
import { compressGLB } from "../utils/compressModel";
import type { GetProp, UploadFile, UploadProps } from "antd";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export const useCompressModel = () => {
  const [compressEnabled, setCompressEnabled] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressError, setCompressError] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);

  let fileToUpload: FileType | Blob = new Blob();

  async function compressModel(file: UploadFile<unknown>) {
    if (compressEnabled) {
      setIsCompressing(true);
      setCompressError(null);
      try {
        const compressedBlob = await compressGLB(file as FileType, "medium");
        setCompressedSize(compressedBlob.size);
        fileToUpload = compressedBlob;
      } catch (err) {
        console.error("Ошибка сжатия:", err);
        setCompressError("Не удалось сжать модель");
        setIsCompressing(false);
        return;
      } finally {
        setIsCompressing(false);
      }
    }
  }

  return {
    compressModel,
    setCompressError,
    setOriginalSize,
    setCompressedSize,
    compressEnabled,
    setCompressEnabled,
    isCompressing,
    compressError,
    originalSize,
    compressedSize,
    fileToUpload,
  };
};
