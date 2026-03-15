import {
  deleteFile,
  downloadFile,
  fetchFiles,
  resetUploadState,
  uploadFiles,
} from "@features/modelManagment/modelsSlice";
import { type AppDispatch, type RootState } from "@app/store";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppState } from "@features/modelManagment/types";
import { isSectionType } from "@features/modelManagment/types";
import { PageLoader } from "@/shared/ui/pageLoader/PageLoader";
import UploadStatus from "@/shared/ui/uploadStatus/UploadStatus";
import { compressGLB } from "@features/modelManagment/utils/compressModel";

type PropsType = {
  styles: CSSModuleClasses;
  type: string;
  title: string;
  id: string;
  inputType: string;
  accept: string;
  required: boolean;
  submitText: string;
};

const Section = ({
  styles,
  type,
  title,
  id,
  inputType,
  accept,
  required,
  submitText,
}: PropsType) => {
  const [selectedFile, setSelectedFile] = useState<File | null>();
  const [isFileLoaded, setIsFileLoaded] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { files, isLoading, isSuccess, isError, errorMessage } = useSelector<
    RootState,
    AppState
  >((state) => state.modelsReducer);
  const dispatch = useDispatch<AppDispatch>();

  const [compressEnabled, setCompressEnabled] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressError, setCompressError] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);

  const fileType = type + "s";
  useEffect(() => {
    if (isSectionType(fileType)) {
      dispatch(fetchFiles(fileType));
    }
  }, []);

  useEffect(() => {
    if (isSectionType(fileType) && isSuccess) {
      dispatch(fetchFiles(fileType));
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isSuccess || isError) {
      setIsFileLoaded(false);
      const timer = setTimeout(() => {
        dispatch(resetUploadState());
        setCompressError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [dispatch, isSuccess, isError]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    let fileToUpload: File | Blob = selectedFile;
    const finalFileName = selectedFile.name;

    // Сжатие для моделей
    if (type === "model" && compressEnabled) {
      setIsCompressing(true);
      setCompressError(null);
      try {
        const compressedBlob = await compressGLB(selectedFile, "medium");
        setCompressedSize(compressedBlob.size);
        fileToUpload = compressedBlob;
      } catch (err) {
        console.error("Ошибка сжатия:", err);
        setCompressError("Не удалось сжать модель");
        setIsCompressing(false);
        return;
      }
      setIsCompressing(false);
    }

    const formData = new FormData();
    formData.append("file", fileToUpload, finalFileName);
    const fileName = selectedFile.name;
    const modelName = fileName.replace(/\.[^/.]+$/, "");
    formData.append("modelName", modelName);
    formData.append("type", type);

    dispatch(uploadFiles(formData))
      .unwrap()
      .finally(() => {
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      });
  };

  const handleDownload = (type: string, fileName: string) => {
    if (isSectionType(type)) {
      dispatch(downloadFile({ type, fileName }));
    }
  };

  const handleDelete = (type: string, fileName: string) => {
    if (isSectionType(type)) {
      dispatch(deleteFile({ type, fileName }));
    }
  };

  return (
    <div id={id}>
      <h2>{title}</h2>
      <div id="items__list" className={styles.filesList}>
        {files?.map((fileName) => {
          if (fileName !== "default.patt")
            return (
              <div className={styles.files__item}>
                <div className={styles.files__fileName}>{fileName}</div>
                <button
                  className={styles.btn__download}
                  onClick={() => handleDownload(type + "s", fileName)}
                >
                  Скачать
                </button>
                <button
                  className={styles.btn__delete}
                  onClick={() => handleDelete(type + "s", fileName)}
                >
                  Удалить
                </button>
              </div>
            );
        })}
      </div>

      <form className={styles.upload__form} onSubmit={handleSubmit}>
        <input
          type={inputType}
          accept={accept}
          required={required}
          ref={fileInputRef}
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setSelectedFile(file);
            setIsFileLoaded(true);
            if (file) {
              setOriginalSize(file.size);
              setCompressedSize(null);
            }
          }}
        />
        <span className={styles.file__label} style={{ color: "black" }}>
          {isFileLoaded ? (
            <span className={styles.file__label__text}>
              Выбранный файл
              <span
                className={styles.file__label__name}
                style={{ color: "green" }}
              >
                {" "}
                {selectedFile?.name}
              </span>
            </span>
          ) : (
            "Файл не выбран"
          )}
        </span>

        {type === "model" && selectedFile && (
          <div className={styles.compressionOptions}>
            <label>
              <input
                type="checkbox"
                checked={compressEnabled}
                onChange={(e) => setCompressEnabled(e.target.checked)}
              />
              Сжать модель для ускорения загрузки?
            </label>
            {isCompressing && <PageLoader />}
            {compressError && (
              <UploadStatus style={{ color: "red" }} text={compressError} />
            )}
          </div>
        )}

        <div style={{ flexBasis: "100%", height: "0" }}></div>
        <button type="submit" className={styles.btn}>
          {submitText}
        </button>
      </form>

      <div className={styles.upload__status}>
        {isLoading ? <PageLoader /> : null}
        {isSuccess ? (
          <UploadStatus
            style={{ color: "green", position: "absolute" }}
            text="Успешно!"
          />
        ) : null}
        {isError ? (
          <UploadStatus style={{ color: "red" }} text={errorMessage} />
        ) : null}
      </div>

      {originalSize && compressedSize && (
        <div className={styles.compressionStats}>
          <p>
            Размер: {(originalSize / 1024).toFixed(2)} КБ →{" "}
            {(compressedSize / 1024).toFixed(2)} КБ
            <br />
            Сжатие: {Math.round((1 - compressedSize / originalSize) * 100)}%
          </p>
        </div>
      )}
    </div>
  );
};

export default Section;
