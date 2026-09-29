import Image from "next/image";

/**
 * Optimised image that fills its (relative) parent. Screens are served as AVIF/WebP at
 * display size; `sizes` tells the browser how wide the slot is.
 */
export default function Pic({
  src,
  alt,
  sizes,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} quality={80} className={className} draggable={false} />;
}
