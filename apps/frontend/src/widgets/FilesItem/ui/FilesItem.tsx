import type { AppDispatch } from "@/app/store";
import { deleteFile, downloadFile } from "@/features/filesManagment/filesSlice";
import { isSectionType } from "@/features/filesManagment/fileTypes";
import { Button, message, Popconfirm } from "antd";
import { useDispatch } from "react-redux";
import styles from "./FilesItem.module.css";

interface FilesItemProps {
  fileName: string;
  type: string;
}

export const FilesItem = ({ fileName, type }: FilesItemProps) => {
  const dispatch = useDispatch<AppDispatch>();

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
      <Popconfirm
        title="Удалить файл?"
        onConfirm={() => handleDelete(type + "s", fileName)}
        cancelText="Нет"
        okText="Да"
      >
        <Button variant="outlined" color="danger" style={{ fontWeight: 500 }}>
          Удалить
        </Button>
      </Popconfirm>
    </div>
  );
};
