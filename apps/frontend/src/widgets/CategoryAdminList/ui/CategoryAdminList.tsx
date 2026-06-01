import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import {
  fetchCategories,
  createCategory,
  deleteCategory,
} from "@/features/categories/categoriesSlice";
import type { CategoryType } from "@/features/categories/categoriesSlice";
import { useAuth } from "@/shared/hooks/useAuth";

export const CategoryAdminList = () => {
  const { role } = useAuth();
  const isAdmin = role === "ROLE_ADMIN";

  const dispatch = useDispatch<AppDispatch>();
  const { categories, isLoading } = useSelector(
    (state: RootState) => state.categoriesReducer,
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAdd = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await dispatch(createCategory(values)).unwrap();
      message.success("Категория создана");
      setIsModalVisible(false);
    } catch (error) {
      message.error("Ошибка создания категории");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteCategory(id)).unwrap();
      message.success("Категория удалена");
    } catch {
      message.error("Ошибка удаления");
    }
  };

  const columns = [
    { title: "Название", dataIndex: "name", key: "name" },
    {
      title: "Описание",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Действия",
      key: "actions",
      render: (_: unknown, record: CategoryType) => (
        <Space>
          {isAdmin && (
            <Popconfirm
              title="Удалить категорию?"
              onConfirm={() => handleDelete(record.id)}
              okText="Да"
              cancelText="Нет"
            >
              <Button icon={<DeleteOutlined />} danger />
            </Popconfirm>
          )}
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
        onClick={handleAdd}
        style={{ marginBottom: 16 }}
      >
        Добавить категорию
      </Button>
      <Table
        dataSource={categories}
        columns={columns}
        loading={isLoading}
        rowKey="id"
        pagination={false}
        scroll={{ x: 600 }}
      />
      <Modal
        title="Новая категория"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        cancelText="Отмена"
        okText="Добавить"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Название"
            rules={[{ required: true, message: "Введите название категории" }]}
          >
            <Input placeholder="например: БЖД" />
          </Form.Item>
          <Form.Item name="description" label="Описание">
            <Input.TextArea rows={3} placeholder="Краткое описание категории" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
