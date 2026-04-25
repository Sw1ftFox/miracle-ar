import styles from "./CompressionStats.module.css";

interface CompressionStatsProps {
  originalSize: number;
  compressedSize: number;
}

export const CompressionStats = ({
  originalSize,
  compressedSize,
}: CompressionStatsProps) => {
  return (
    <div className={styles.compression__stats}>
      <p>
        Размер: {(originalSize / 1024).toFixed(2)} КБ →{" "}
        {(compressedSize / 1024).toFixed(2)} КБ
        <br />
        Сжатие: {Math.round((1 - compressedSize / originalSize) * 100)}%
      </p>
    </div>
  );
};
