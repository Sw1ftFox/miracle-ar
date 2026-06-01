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
import { uploadFiles } from "@/features/filesManagment/filesSlice";
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

  useEffect(() => {
    if (visible) {
      dispatch(fetchCategories());
      if (editingModel) {
        form.setFieldsValue(editingModel);
      } else {
        form.resetFields();
        setFileList({});
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
    setFileList((prev) => ({ ...prev, [type]: file }));
  };

  const onFinish = async (values: any) => {
    try {
      setUploading(true);

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

      const fileUrls: Partial<ModelType> = {};
      if (fileList.preview && fileList.preview.originFileObj) {
        const ext = fileList.preview.originFileObj.name.split(".").pop();
        fileUrls.previewUrl = `/api/files/previews/${values.fileName}.${ext}`;
      }
      if (fileList.pattern) {
        fileUrls.patternUrl = `/api/files/patterns/${values.fileName}.patt`;
      }
      if (fileList.sound) {
        fileUrls.soundUrl = `/api/files/sounds/${values.fileName}.mp3`;
      }
      if (fileList.video) {
        fileUrls.videoUrl = `/api/files/videos/${values.fileName}.mp4`;
      }

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
          if (otherCategory) {
            categoryIds = [otherCategory.id];
          } else {
            console.warn(
              "Category 'Другие' not found, model not assigned to any category",
            );
          }
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
            rules={[{ required: true, message: "Введите название модели" }]}
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
            {!editingModel ? (
              <Form.Item label="3D модель (GLB)">
                <Upload
                  accept=".glb"
                  maxCount={1}
                  beforeUpload={() => false}
                  fileList={fileList.model ? [fileList.model] : []}
                  onChange={({ fileList }) =>
                    handleFileChange("model", fileList)
                  }
                >
                  <Button icon={<UploadOutlined />}>Загрузить</Button>
                </Upload>
              </Form.Item>
            ) : null}
            <Form.Item label="Маркер (patt)">
              <Upload
                accept=".patt"
                maxCount={1}
                beforeUpload={() => false}
                fileList={fileList.pattern ? [fileList.pattern] : []}
                onChange={({ fileList }) =>
                  handleFileChange("pattern", fileList)
                }
              >
                <Button icon={<UploadOutlined />}>Загрузить</Button>
              </Upload>
            </Form.Item>
            <Form.Item label="Превью (jpg/png)">
              <Upload
                accept="image/*"
                maxCount={1}
                beforeUpload={() => false}
                fileList={fileList.preview ? [fileList.preview] : []}
                onChange={({ fileList }) =>
                  handleFileChange("preview", fileList)
                }
              >
                <Button icon={<UploadOutlined />}>Загрузить</Button>
              </Upload>
            </Form.Item>
            <Form.Item label="Звук (mp3)">
              <Upload
                accept=".mp3"
                maxCount={1}
                beforeUpload={() => false}
                fileList={fileList.sound ? [fileList.sound] : []}
                onChange={({ fileList }) => handleFileChange("sound", fileList)}
              >
                <Button icon={<UploadOutlined />}>Загрузить</Button>
              </Upload>
            </Form.Item>
            <Form.Item label="Видео (mp4/webm)">
              <Upload
                accept=".mp4,.webm,.mov"
                maxCount={1}
                beforeUpload={() => false}
                fileList={fileList.video ? [fileList.video] : []}
                onChange={({ fileList }) => handleFileChange("video", fileList)}
              >
                <Button icon={<UploadOutlined />}>Загрузить</Button>
              </Upload>
            </Form.Item>
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
