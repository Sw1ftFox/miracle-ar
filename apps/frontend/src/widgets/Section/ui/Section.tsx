import { type AppDispatch, type RootState } from "@app/store";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PageLoader } from "@/shared/ui/pageLoader/PageLoader";
import UploadStatus from "@/shared/ui/uploadStatus/UploadStatus";
import { compressGLB } from "@/shared/utils/compressModel";
import {
  isSectionType,
  type FilesState,
} from "@/features/filesManagment/fileTypes";
import {
  deleteFile,
  downloadFile,
  fetchFiles,
  resetUploadState,
  uploadFiles,
} from "@/features/filesManagment/filesSlice";
import styles from "./Section.module.css";
import {
  Button,
  Grid,
  message,
  Upload,
  type GetProp,
  type UploadFile,
  type UploadProps,
} from "antd";
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";

type PropsType = {
  type: string;
  title: string;
  id: string;
  inputType: string;
  accept: string;
  required: boolean;
  submitText: string;
};

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const { useBreakpoint } = Grid;

export const Section = ({ type, title, id, accept, submitText }: PropsType) => {
  const screens = useBreakpoint();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { files, isLoading, isSuccess, isError, errorMessage } = useSelector<
    RootState,
    FilesState
  >((state) => state.filesReducer);
  const dispatch = useDispatch<AppDispatch>();

  const [compressEnabled, setCompressEnabled] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressError, setCompressError] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

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
        setCompressError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [dispatch, isSuccess, isError]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!fileList[0]) return;

    let fileToUpload: UploadFile<unknown> | Blob = fileList[0];
    const finalFileName = fileList[0].name;

    // Сжатие для моделей
    if (type === "model" && compressEnabled) {
      setIsCompressing(true);
      setCompressError(null);
      try {
        const compressedBlob = await compressGLB(
          fileList[0] as FileType,
          "medium",
        );
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
    formData.append("file", fileToUpload as FileType, finalFileName);
    const fileName = fileList[0].name;
    const modelName = fileName.replace(/\.[^/.]+$/, "");
    formData.append("modelName", modelName);
    formData.append("type", type);

    dispatch(uploadFiles(formData))
      .unwrap()
      .then(() => {
        message.success("Успешно загружено!");
        if (isSectionType(fileType)) {
          dispatch(fetchFiles(fileType));
        }
      })
      .catch(() => {
        message.error("Ошибка загрузки!");
      })
      .finally(() => {
        setFileList([]);
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
      dispatch(deleteFile({ type, fileName }))
        .unwrap()
        .then(() => {
          message.success("Успешно удалено!");
        })
        .catch(() => {
          message.error("Ошибка удаления!");
        });
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
                <Button
                  variant="outlined"
                  color="green"
                  style={{
                    fontWeight: 500,
                  }}
                  onClick={() => handleDownload(type + "s", fileName)}
                >
                  Скачать
                </Button>
                <Button
                  variant="outlined"
                  color="danger"
                  style={{
                    fontWeight: 500,
                  }}
                  onClick={() => handleDelete(type + "s", fileName)}
                >
                  Удалить
                </Button>
              </div>
            );
        })}
      </div>

      <form className={styles.upload__form} onSubmit={handleSubmit}>
        <Upload
          accept={accept}
          name="file"
          maxCount={1}
          fileList={fileList}
          beforeUpload={(file) => {
            setFileList([file]);
            if (file) {
              setOriginalSize(file?.size || 0);
              setCompressedSize(null);
            }
            return false;
          }}
          onRemove={() => {
            setFileList([]);
          }}
        >
          <Button icon={<UploadOutlined />}>Прикрепить файл</Button>
        </Upload>

        {type === "model" && fileList.length > 0 && (
          <div className={styles.compressionOptions}>
            <label>
              <input
                type="checkbox"
                checked={compressEnabled}
                onChange={(e) => setCompressEnabled(e.target.checked)}
              />
              Сжать модель (рекомендуется)?
            </label>
            {isCompressing && <PageLoader />}
            {compressError && (
              <UploadStatus style={{ color: "red" }} text={compressError} />
            )}
          </div>
        )}

        <div style={{ flexBasis: "100%", height: "0" }}></div>
        <Button
          variant="solid"
          color="purple"
          style={{
            fontWeight: 500,
            padding: screens.xs ? 0 : 18,
            borderRadius: 12,
            fontSize: screens.xs ? "" : "1rem",
            display: "flex",
            margin: screens.xs ? "" : "0 auto",
          }}
          htmlType="submit"
          disabled={fileList.length <= 0}
        >
          <DownloadOutlined /> {submitText}
        </Button>
      </form>

      <div className={styles.upload__status}>
        {isLoading ? <PageLoader /> : null}

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
