import { type AppDispatch, type RootState } from "@app/store";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PageLoader } from "@/shared/ui/pageLoader/PageLoader";
import UploadStatus from "@/shared/ui/uploadStatus/UploadStatus";
import {
  isSectionType,
  type FilesState,
} from "@/features/filesManagment/fileTypes";
import {
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
import { useCompressModel } from "@/shared/hooks/useCompressModel";
import { CompressionStats } from "@/shared/ui/CompressionStats/CompressionStats";
import CompressionOptions from "@/shared/ui/CompressionOptions/CompressionOptions";
import { FilesList } from "@/widgets/FilesList";

type SectionProps = {
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

export const Section = ({
  type,
  title,
  id,
  accept,
  submitText,
}: SectionProps) => {
  const screens = useBreakpoint();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isLoading, isSuccess, isError, errorMessage } = useSelector<
    RootState,
    FilesState
  >((state) => state.filesReducer);
  const dispatch = useDispatch<AppDispatch>();

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const {
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
  } = useCompressModel();

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

    const finalFileName = fileList[0].name;

    if (type === "model") {
      compressModel(fileList[0]);
    }
    const formData = new FormData();
    formData.append(
      "file",
      type === "modell"
        ? (fileToUpload as FileType)
        : (fileList[0] as FileType),
      finalFileName,
    );
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

  return (
    <div id={id}>
      <h2>{title}</h2>
      <FilesList sectionType={type} sectionId={id} />

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
          <CompressionOptions
            compressEnabled={compressEnabled}
            compressError={compressError}
            isCompressing={isCompressing}
            setCompressEnabled={setCompressEnabled}
          />
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
        <CompressionStats
          compressedSize={compressedSize}
          originalSize={originalSize}
        />
      )}
    </div>
  );
};
