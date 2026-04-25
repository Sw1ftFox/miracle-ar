import ReactPlayer from "react-player";

interface VideoPlayerProps {
  videoUrl: string;
  imageUrl: string | undefined;
  altImage: string;
  altText: string;
  className: string;
}

export const VideoPlayer = ({
  videoUrl,
  imageUrl,
  altImage,
  altText,
  className,
}: VideoPlayerProps) => {
  return (
    <ReactPlayer
      playing={true}
      controls={true}
      volume={1}
      src={videoUrl || "https://www.youtube.com/watch?v=LXb3EKWsInQ"}
      light={
        <img
          src={imageUrl ? imageUrl : altImage}
          alt={altText}
          className={className}
        />
      }
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
};
