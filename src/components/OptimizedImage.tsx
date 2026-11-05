import Image, { ImageProps } from "next/image"

export function OptimizedImage(props: ImageProps) {
  // Refactored Image wrapper for standard optimizations
  return (
    <Image
      {...props}
      placeholder={props.placeholder || "empty"}
      quality={props.quality || 85}
      style={{
        ...props.style,
        maxWidth: "100%",
        height: "auto",
      }}
    />
  )
}
