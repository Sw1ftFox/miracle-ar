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
      </div>
  );
};

export default Section;
