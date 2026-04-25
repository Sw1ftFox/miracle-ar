import { FilesItem } from "@/widgets/FilesItem";
import styles from "./FilesList.module.css";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import type { FilesState } from "@/features/filesManagment/fileTypes";

interface FilesListProps {
  sectionType: string;
  sectionId: string;
}

export const FilesList = ({ sectionId, sectionType }: FilesListProps) => {
  const { files } = useSelector<RootState, FilesState>(
    (state) => state.filesReducer,
  );

  return (
    <div id="items__list" className={styles.files}>
      {files?.map((fileName) => {
        if (fileName !== "default.patt")
          return (
            <FilesItem
              key={fileName + sectionId}
              fileName={fileName}
              type={sectionType}
            />
          );
      })}
    </div>
  );
};
