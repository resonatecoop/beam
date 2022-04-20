export const ImageWithPlaceholder: React.FC<{
  src?: string;
  alt: string;
  size: number;
  className?: string;
}> = ({ src, alt, size, className }) => {
  return (
    <>
      {src && (
        <img
          src={src}
          alt={alt}
          width={size}
          height={size}
          className={className}
        />
      )}
      {!src && (
        <div
          style={{
            backgroundColor: "#bbb",
            display: "block",
            width: `${size}px`,
            height: `${size}px`,
          }}
          className={className}
        />
      )}
    </>
  );
};

export default ImageWithPlaceholder;
