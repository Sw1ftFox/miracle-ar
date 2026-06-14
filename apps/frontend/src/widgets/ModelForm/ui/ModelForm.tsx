import { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  message,
  Upload,
  Spin,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { uploadFiles, deleteFile } from "@/features/filesManagment/filesSlice";
import type { AppDispatch, RootState } from "@/app/store";
import {
  assignCategories,
  createModel,
  updateModel,
} from "@/features/modelManagment/modelAdminSlice";
import {
  fetchCategories,
  type CategoriesState,
} from "@/features/categories/categoriesSlice";
import type { ModelType } from "@/features/modelManagment/modelTypes";
import { removeFileExtension } from "@/shared/utils/removeFileExtension";
import { useCompressModel } from "@/shared/hooks/useCompressModel";
import { CompressionStats } from "@/shared/ui/CompressionStats/CompressionStats";
import CompressionOptions from "@/shared/ui/CompressionOptions/CompressionOptions";

interface ModelFormProps {
  visible: boolean;
  onClose: () => void;
  editingModel?: ModelType | null;
}

const PLURAL_TYPE_MAP: Record<string, string> = {
  model: "models",
  pattern: "patterns",
  preview: "previews",
  sound: "sounds",
  video: "videos",
};

const createFileFromUrl = (
  url: string | null | undefined,
  fileName: string,
  type?: string,
): UploadFile | undefined => {
  if (!url) return undefined;
  const name = url.split("/").pop() || fileName;
  return { uid: `${type || "file"}-${name}`, name, status: "done", url };
};

export const ModelForm = ({
  visible,
  onClose,
  editingModel,
}: ModelFormProps) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector<RootState, CategoriesState>(
    (state) => state.categoriesReducer,
  );
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<{
    model?: UploadFile;
    pattern?: UploadFile;
    preview?: UploadFile;
    sound?: UploadFile;
    video?: UploadFile;
  }>({});
  const [removedFileTypes, setRemovedFileTypes] = useState<Set<string>>(
    new Set(),
  );
  const [filesToDelete, setFilesToDelete] = useState<Record<string, string>>(
    {},
  );

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
  } = useCompressModel();

  // Загружаем категории при открытии формы
  useEffect(() => {
    if (visible) {
      dispatch(fetchCategories());
    }
  }, [visible, dispatch]);

  // Основной эффект: сброс формы и установка полей, кроме категорий
  useEffect(() => {
    if (visible) {
      form.resetFields();
      setUploading(false);

      dispatch(fetchCategories())
        .unwrap()
        .then(() => {
          if (editingModel) {
            form.setFieldsValue({
              fileName: editingModel.fileName,
              displayName: editingModel.displayName,
              description: editingModel.description,
              // categoryIds установим отдельно, когда категории загрузятся
            });
            setFileList({
              model: createFileFromUrl(
                `/api/files/models/${editingModel.fileName}.glb`,
                editingModel.fileName,
                "model",
              ),
              pattern: createFileFromUrl(
                editingModel.patternUrl,
                editingModel.fileName,
                "pattern",
              ),
              preview: createFileFromUrl(
                editingModel.previewUrl,
                editingModel.fileName,
                "preview",
              ),
              sound: createFileFromUrl(
                editingModel.soundUrl,
                editingModel.fileName,
                "sound",
              ),
              video: createFileFromUrl(
                editingModel.videoUrl,
                editingModel.fileName,
                "video",
              ),
            });
            setRemovedFileTypes(new Set());
            setFilesToDelete({});
          } else {
            setFileList({});
            setRemovedFileTypes(new Set());
            setFilesToDelete({});
          }
        })
        .catch(() => {
          message.error("Не удалось загрузить категории");
        });
    }
  }, [visible, editingModel, form, dispatch]);

  // Отдельно устанавливаем категории, когда categories загружены и редактируется модель
  useEffect(() => {
    if (visible && editingModel && categories.length > 0) {
      console.log("Setting categoryIds:", editingModel.categoryIds);
      console.log("Available categories:", categories);
      form.setFieldsValue({ categoryIds: editingModel.categoryIds || [] });
    }
  }, [visible, editingModel, categories, form]);

  const handleFileChange = (type: string, fileList: UploadFile[]) => {
    const file = fileList[0];
    if (type === "model" && file && file.originFileObj) {
      const name = removeFileExtension(file.originFileObj.name);
      form.setFieldsValue({ fileName: name });
      setCompressError(null);
      setOriginalSize(file.originFileObj.size || 0);
      setCompressedSize(null);
    }
    // Если загружен новый файл (с originFileObj), снимаем все метки удаления
    if (file && file.originFileObj) {
      setRemovedFileTypes((prev) => {
        const next = new Set(prev);
        next.delete(type);
        return next;
      });
      setFilesToDelete((prev) => {
        const next = { ...prev };
        delete next[type];
        return next;
      });
    }
    setFileList((prev) => ({ ...prev, [type]: file }));
  };

  const handleRemove = (type: string) => {
    const file = fileList[type as keyof typeof fileList];
    if (!file) return;

    // Если файл новый (есть originFileObj), просто убираем его из списка
    if (file.originFileObj) {
      setFileList((prev) => ({ ...prev, [type]: undefined }));
      return;
    }

    // Если файл с сервера – запоминаем для удаления
    if (file.name) {
      setFilesToDelete((prev) => ({ ...prev, [type]: file.name }));
      setRemovedFileTypes((prev) => new Set(prev).add(type));
      setFileList((prev) => ({ ...prev, [type]: undefined }));
    }
  };

  const onFinish = async (values: any) => {
    try {
      setUploading(true);

      const modelFile = fileList.model;
      let fileToUpload: File | Blob | undefined;

      if (modelFile && modelFile.originFileObj) {
        if (!editingModel) {
          fileToUpload = await compressModel(modelFile);
        } else {
          fileToUpload = modelFile.originFileObj as File;
        }
      }

      const uploadPromises = [];

      if (fileToUpload) {
        const formData = new FormData();
        const finalFile =
          fileToUpload instanceof File
            ? fileToUpload
            : new File([fileToUpload], values.fileName + ".glb", {
              type: fileToUpload.type,
            });
        formData.append("file", finalFile);
        formData.append("type", "model");
        formData.append("modelName", values.fileName);
        uploadPromises.push(dispatch(uploadFiles(formData)).unwrap());
      }

      for (const [fileType, file] of Object.entries(fileList)) {
        if (fileType === "model") continue;
        if (file && file.originFileObj) {
          const formData = new FormData();
          formData.append("file", file.originFileObj as File);
          formData.append("type", fileType);
          formData.append("modelName", values.fileName);
          uploadPromises.push(dispatch(uploadFiles(formData)).unwrap());
        }
      }

      await Promise.all(uploadPromises);

      const deletePromises = [];
      for (const type of removedFileTypes) {
        const pluralType = PLURAL_TYPE_MAP[type];
        const fileNameToDelete = filesToDelete[type];
        if (fileNameToDelete) {
          deletePromises.push(
            dispatch(
              deleteFile({
                type: pluralType as any,
                fileName: fileNameToDelete,
              }),
            ).unwrap(),
          );
        }
      }
      await Promise.all(deletePromises);

      const resolveUrl = (
        type: string,
        defaultExt: string,
      ): string | null | undefined => {
        const file = fileList[type as keyof typeof fileList];
        if (removedFileTypes.has(type)) return null;
        if (file && file.originFileObj) {
          const ext = file.originFileObj.name.split(".").pop() || defaultExt;
          return `/api/files/${type}s/${values.fileName}.${ext}`;
        }
        if (editingModel) {
          const editingUrls: Record<string, string | undefined | null> = {
            model: `/api/files/models/${editingModel.fileName}.glb`,
            pattern: editingModel.patternUrl,
            preview: editingModel.previewUrl,
            sound: editingModel.soundUrl,
            video: editingModel.videoUrl,
          };
          return editingUrls[type];
        }
        return undefined;
      };

      const fileUrls: Partial<ModelType> = {
        previewUrl: resolveUrl("preview", "png"),
        patternUrl: resolveUrl("pattern", "patt"),
        soundUrl: resolveUrl("sound", "mp3"),
        videoUrl: resolveUrl("video", "mp4"),
      };

      const modelData: Partial<ModelType> = {
        fileName: values.fileName,
        displayName: values.displayName,
        description: values.description,
        ...fileUrls,
      };

      if (editingModel && editingModel.id) {
        await dispatch(
          updateModel({ id: editingModel.id, data: modelData }),
        ).unwrap();

        const categoryIds: number[] = values.categoryIds || [];
        if (categoryIds.length > 0) {
          await dispatch(
            assignCategories({ modelName: values.fileName, categoryIds }),
          ).unwrap();
        }
        message.success("Модель обновлена");
      } else {
        await dispatch(createModel(modelData)).unwrap();
        let categoryIds: number[] = values.categoryIds || [];
        if (categoryIds.length === 0) {
          const otherCategory = categories.find((c) => c.name === "Другие");
          if (otherCategory) categoryIds = [otherCategory.id];
        }
        if (categoryIds.length > 0) {
          await dispatch(
            assignCategories({ modelName: values.fileName, categoryIds }),
          ).unwrap();
        }
        message.success("Модель создана");
      }
      onClose();
    } catch (error) {
      message.error("Ошибка сохранения модели");
    } finally {
      setUploading(false);
    }
  };

  const renderUpload = (
    label: string,
    accept: string,
    fileType: string,
    isModelFile?: boolean,
  ) => {
    if (isModelFile && editingModel) return null;
    return (
      <>
        <Form.Item label={label}>
          <Upload
            accept={accept}
            maxCount={1}
            beforeUpload={() => false}
            fileList={
              fileList[fileType as keyof typeof fileList]
                ? [fileList[fileType as keyof typeof fileList]!]
                : []
            }
            onChange={({ fileList }) => handleFileChange(fileType, fileList)}
            onRemove={() => handleRemove(fileType)}
          >
            <Button icon={<UploadOutlined />}>
              {fileList[fileType as keyof typeof fileList]
                ? "Заменить"
                : "Загрузить"}
            </Button>
          </Upload>
        </Form.Item>
        {!editingModel && fileType === "model" && fileList.model && (
          <CompressionOptions
            compressEnabled={compressEnabled}
            compressError={compressError}
            isCompressing={isCompressing}
            setCompressEnabled={setCompressEnabled}
          />
        )}
        {!editingModel &&
          fileType === "model" &&
          originalSize &&
          compressedSize && (
          <CompressionStats
            originalSize={originalSize}
            compressedSize={compressedSize}
          />
        )}
      </>
    );
  };

  return (
    <Modal
      title={editingModel ? "Редактировать модель" : "Новая модель"}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      destroyOnHidden
    >
      <Spin spinning={uploading}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="fileName" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="displayName"
            label="Отображаемое название"
            rules={[{ required: true }]}
          >
            <Input placeholder="например: 3D Модель" />
          </Form.Item>
          <Form.Item name="description" label="Описание">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="categoryIds" label="Категории">
            <Select
              mode="multiple"
              placeholder="Выберите категории"
              options={categories.map((cat) => ({
                value: cat.id,
                label: cat.name,
              }))}
            />
          </Form.Item>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            {renderUpload("3D модель (GLB)", ".glb", "model", true)}
            {renderUpload("Маркер (patt)", ".patt", "pattern")}
            {renderUpload("Превью (jpg/png)", "image/*", "preview")}
            {renderUpload("Звук (mp3)", ".mp3", "sound")}
            {renderUpload("Видео (mp4/webm)", ".mp4,.webm,.mov", "video")}
          </div>
          <Form.Item>
            <Button
              color="purple"
              variant="solid"
              htmlType="submit"
              loading={uploading}
            >
              {editingModel ? "Сохранить" : "Создать"}
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};
