import { PageLoader } from "../pageLoader/PageLoader";
import UploadStatus from "../uploadStatus/UploadStatus";
import styles from "./CompressionOptions.module.css";

interface CompressionOptionsProps {
  compressEnabled: boolean;
  setCompressEnabled: (prevCompressionEnabled: boolean) => void;
  isCompressing: boolean;
  compressError: string | null;
}

const CompressionOptions = ({
  compressEnabled,
  setCompressEnabled,
  isCompressing,
  compressError,
}: CompressionOptionsProps) => {
  return (
    <div className={styles.compression__options}>
      <label>
        <input
          type="checkbox"
          checked={compressEnabled}
          onChange={(e) => setCompressEnabled(e.target.checked)}
        />
        Сжать модель (рекомендуется)?
      </label>
      {isCompressing && <PageLoader />}
      {compressError && (
        <UploadStatus style={{ color: "red" }} text={compressError} />
      )}
    </div>
  );
};

export default CompressionOptions;
