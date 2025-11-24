import {
  resetUploadState,
  uploadFiles,
} from "@features/modelManagment/modelsSlice";
import { type AppDispatch, type RootState } from "@app/store";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppState } from "@features/modelManagment/types";
import UploadStatus from "@/shared/ui/uploadStatus/UploadStatus";

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
  const { isLoading, isSuccess, isError, errorMessage } = useSelector<
    RootState,
    AppState
  >((state) => state.modelsReducer);
  const dispatch = useDispatch<AppDispatch>();

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

  useEffect(() => {
    if (isSuccess || isError) {
      const timer = setTimeout(() => {
        dispatch(resetUploadState());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [dispatch, isSuccess, isError]);

  return (
    <div id={id}>
      <h2>{title}</h2>
      <div id="model-list" className={styles.file__list}></div>

      <form className={styles.upload__form} onSubmit={handleSubmit}>
        <input
          type={inputType}
          className={styles.upload__btn}
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
        <UploadStatus
          style={{
            color: "black",
            textAlign: "center",
            marginTop: "20px",
          }}
          text="Загрузка..."
        />
      ) : null}
      {isSuccess ? (
        <UploadStatus
          style={{
            color: "green",
            textAlign: "center",
            marginTop: "20px",
          }}
          text="Успешно!"
        />
      ) : null}
      {isError ? (
        <UploadStatus
          style={{
            color: "red",
            textAlign: "center",
            marginTop: "20px",
          }}
          text={errorMessage}
        />
      ) : null}
    </div>
  );
};

export default Section;
