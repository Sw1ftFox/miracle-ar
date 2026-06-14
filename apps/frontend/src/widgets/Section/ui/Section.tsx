import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@app/store";
import { isSectionType } from "@/features/filesManagment/fileTypes";
import { fetchFiles } from "@/features/filesManagment/filesSlice";
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

export const Section = ({ type, title, id }: SectionProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const fileType = type + "s";

  useEffect(() => {
    if (isSectionType(fileType)) {
      dispatch(fetchFiles(fileType));
    }
  }, [dispatch, fileType]);

  return (
    <div id={id}>
      <h2>{title}</h2>
      <FilesList sectionType={type} sectionId={id} />
    </div>
  );
};
