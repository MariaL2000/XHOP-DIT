import Image, { type ImageProps } from "next/image";

interface ProductImageProps extends Omit<ImageProps, "src" | "alt"> {
  src?: string;
  alt: string;
}

export const ProductImage = ({ src, alt, ...props }: ProductImageProps) => {
  let newSrc = "/imgs/placeholder.jpg";

  if (src) {
    if (src.startsWith("http")) {
      return <Image src={src} alt={alt} unoptimized {...props} />;
    }

    if (src.startsWith("/")) {
      newSrc = src;
    } else {
      newSrc = `/products/${src}`;
    }
  }

  return <Image src={newSrc} alt={alt} {...props} />;
};
