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
  ); // type → полное имя файла

  useEffect(() => {
    if (visible) {
      dispatch(fetchCategories());
      if (editingModel) {
        form.setFieldsValue(editingModel);
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
        setFilesToDelete({}); // сброс
      } else {
        form.resetFields();
        setFileList({});
        setRemovedFileTypes(new Set());
        setFilesToDelete({});
        setUploading(false);
      }
    }
  }, [visible, editingModel, form, dispatch]);

  const handleFileChange = (type: string, fileList: UploadFile[]) => {
    const file = fileList[0];
    if (type === "model" && file && file.originFileObj) {
      const name = removeFileExtension(file.originFileObj.name);
      form.setFieldsValue({ fileName: name });
    }
    // Снимаем пометку удаления, только если загружен новый файл
    if (file && file.originFileObj) {
      setRemovedFileTypes((prev) => {
        const next = new Set(prev);
        next.delete(type);
        return next;
      });
      // Также сбрасываем запись в filesToDelete
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
    if (file && file.name) {
      setFilesToDelete((prev) => ({ ...prev, [type]: file.name })); // запоминаем полное имя
    }
    setRemovedFileTypes((prev) => new Set(prev).add(type));
    setFileList((prev) => ({ ...prev, [type]: undefined }));
  };

  const onFinish = async (values: any) => {
    try {
      setUploading(true);

      // загрузка новых файлов
      const uploadPromises = [];
      for (const [fileType, file] of Object.entries(fileList)) {
        if (file && file.originFileObj) {
          const formData = new FormData();
          formData.append("file", file.originFileObj as File);
          formData.append("type", fileType === "model" ? "model" : fileType);
          formData.append("modelName", values.fileName);
          uploadPromises.push(dispatch(uploadFiles(formData)).unwrap());
        }
      }
      await Promise.all(uploadPromises);

      // удаление файлов, помеченных на удаление
      const deletePromises = [];
      for (const type of removedFileTypes) {
        const pluralType = PLURAL_TYPE_MAP[type];
        const fileNameToDelete = filesToDelete[type]; // полное имя (с расширением)
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

      // формирование URL для модели
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
        const categoryIds = values.categoryIds || [];
        if (categoryIds.length) {
          await dispatch(
            assignCategories({ modelName: values.fileName, categoryIds }),
          ).unwrap();
        }
        message.success("Модель обновлена");
      } else {
        await dispatch(createModel(modelData)).unwrap();
        let categoryIds = values.categoryIds || [];
        if (categoryIds.length === 0) {
          const otherCategory = categories.find((c) => c.name === "Другие");
          if (otherCategory) categoryIds = [otherCategory.id];
        }
        if (categoryIds.length) {
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
