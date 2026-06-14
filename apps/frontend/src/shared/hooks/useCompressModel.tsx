import { useState } from "react";
import { compressGLB } from "../utils/compressModel";
import type { UploadFile } from "antd";

export const useCompressModel = () => {
  const [compressEnabled, setCompressEnabled] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressError, setCompressError] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);

  async function compressModel(
    file: UploadFile<unknown>,
  ): Promise<File | Blob> {
    if (!compressEnabled) {
      return file.originFileObj as File;
    }

    setIsCompressing(true);
    setCompressError(null);
    try {
      const compressedBlob = await compressGLB(
        file.originFileObj as File,
        "medium",
      );
      setCompressedSize(compressedBlob.size);
      return compressedBlob;
    } catch (err) {
      console.error("Ошибка сжатия:", err);
      setCompressError("Не удалось сжать модель");
      throw err;
    } finally {
      setIsCompressing(false);
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
  };
};
