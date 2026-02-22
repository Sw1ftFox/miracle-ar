import {
  deleteFile,
  fetchFiles,
  resetUploadState,
  uploadFiles,
} from "@features/modelManagment/modelsSlice";
import { type AppDispatch, type RootState } from "@app/store";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppState } from "@features/modelManagment/types";
import { isSectionType } from "@features/modelManagment/types";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { files, isLoading, isSuccess, isError, errorMessage } = useSelector<
    RootState,
    AppState
  >((state) => state.modelsReducer);
  const dispatch = useDispatch<AppDispatch>();

  const fileType = type + "s";
  useEffect(() => {
    if (isSectionType(fileType)) {
      dispatch(fetchFiles(fileType));
    }
  }, []);

  useEffect(() => {
    if (isSuccess || isError) {
      const timer = setTimeout(() => {
        dispatch(resetUploadState());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [dispatch, isSuccess, isError]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    const fileName = selectedFile.name;
    const modelName = fileName.replace(/\.[^/.]+$/, "");
    formData.append("modelName", modelName);

    formData.append("type", type);

    dispatch(uploadFiles(formData))
      .unwrap()
      .finally(() => {
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      });
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
                <button onClick={() => handleDelete(type + "s", fileName)}>
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
          }}
        />

        <button type="submit" className={styles.btn}>
          {submitText}
        </button>
      </form>
      {isLoading ? (
        <div className={styles.uploadStatus} style={{ color: "#666" }}>
          Загрузка...
        </div>
      ) : null}
      {isSuccess ? (
        <div className={styles.uploadStatus} style={{ color: "green" }}>
          Успешно!
        </div>
      ) : null}
      {isError ? (
        <div className={styles.uploadStatus} style={{ color: "red" }}>
          {errorMessage}
        </div>
      ) : null}
    </div>
  );
};

export default Section;
