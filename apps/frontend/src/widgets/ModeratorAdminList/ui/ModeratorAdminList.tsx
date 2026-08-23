import { useEffect, useState } from "react";
import { Table, Button, Popconfirm, Input, message, Flex, Grid } from "antd";
import { fetchWithAuth } from "@/shared/utils/fetchWithAuth";
import { API_BASE } from "@/app/api/config";

interface Moderator {
  id: number;
  email: string;
}

const { useBreakpoint } = Grid;

export const ModeratorAdminList = () => {
  const [moderators, setModerators] = useState<Moderator[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const screens = useBreakpoint();

  const fetchModerators = async () => {
    try {
      const res = await fetchWithAuth(`${API_BASE}/api/admin/moderators`);
      if (res.ok) {
        const data = await res.json();
        setModerators(data);
      }
    } catch {
      message.error("Ошибка загрузки модераторов");
    }
  };

  useEffect(() => {
    fetchModerators();
  }, []);

  const handleAdd = async () => {
    if (!email || !password) {
      message.warning("Введите email и пароль");
      return;
    }
    setLoading(true);
    try {
      const res = await fetchWithAuth(`${API_BASE}/api/admin/moderators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        message.success("Модератор создан");
        setEmail("");
        setPassword("");
        fetchModerators();
      } else {
        const err = await res.text();
        message.error(err);
      }
    } catch {
      message.error("Ошибка при создании");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetchWithAuth(
        `${API_BASE}/api/admin/moderators/${id}`,
        {
          method: "DELETE",
        },
      );
      if (res.ok) {
        message.success("Модератор удалён");
        fetchModerators();
      } else {
        const err = await res.text();
        message.error(err);
      }
    } catch {
      message.error("Ошибка удаления");
    }
  };

  const columns = [
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Действия",
      key: "actions",
      render: (_, record: { id: number }) => (
        <Popconfirm
          title="Удалить модератора?"
          onConfirm={() => handleDelete(record.id)}
          cancelText="Нет"
          okText="Да"
        >
          <Button danger>Удалить</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <Flex vertical gap={12} style={{ marginBottom: 16 }}>
        <Flex wrap gap={12} vertical={!screens.sm}>
          <Input
            placeholder="Email модератора"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: screens.sm ? 250 : "100%" }}
          />
          <Input.Password
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: screens.sm ? 250 : "100%" }}
          />
          <Button
            type="primary"
            onClick={handleAdd}
            loading={loading}
            style={{ width: screens.sm ? "auto" : "100%" }}
          >
            Добавить
          </Button>
        </Flex>
      </Flex>
      <Table
        dataSource={moderators}
        columns={columns}
        rowKey="id"
        pagination={false}
        loading={loading}
        scroll={{ x: 600 }}
      />
    </div>
  );
};
