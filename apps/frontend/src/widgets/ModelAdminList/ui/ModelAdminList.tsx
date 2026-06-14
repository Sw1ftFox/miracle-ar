import { useEffect, useState } from "react";
import { Table, Button, Space, Popconfirm, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import {
  deleteModel,
  fetchModelsAdmin,
  type AdminModelState,
} from "@/features/modelManagment/modelAdminSlice";
import { ModelForm } from "@/widgets/ModelForm";
import type { ModelType } from "@/features/modelManagment/modelTypes";

export const ModelAdminList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { models, isLoading } = useSelector<RootState, AdminModelState>(
    (state) => state.modelAdminReducer,
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [editingModel, setEditingModel] = useState<ModelType | null>(null);

  useEffect(() => {
    dispatch(fetchModelsAdmin());
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteModel(id)).unwrap();
      message.success("Модель удалена");
    } catch {
      message.error("Ошибка удаления");
    }
  };

  const columns: ColumnsType<ModelType> = [
    { title: "Имя файла", dataIndex: "fileName", key: "fileName" },
    {
      title: "Отображаемое название",
      dataIndex: "displayName",
      key: "displayName",
    },
    {
      title: "Описание",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Действия",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingModel(record);
              setModalVisible(true);
            }}
          />
          <Popconfirm
            title="Удалить?"
            onConfirm={() => handleDelete(record.id)}
            cancelText="Нет"
            okText="Да"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button
        color="purple"
        variant="solid"
        icon={<PlusOutlined />}
        onClick={() => {
          setEditingModel(null);
          setModalVisible(true);
        }}
        style={{ marginBottom: 16 }}
      >
        Добавить модель
      </Button>
      <Table
        dataSource={models}
        columns={columns}
        loading={isLoading}
        rowKey="id"
        pagination={false}
        scroll={{ x: 600 }}
      />
      <ModelForm
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        editingModel={editingModel}
      />
    </div>
  );
};
