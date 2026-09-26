import { getImageProps, type ImageProps } from "next/image";

/**
 * `next/image` optimisation without its client component. `getImageProps` resolves
 * the same responsive `srcset` on the server and returns a plain `<img>`, so a page
 * of photographs adds no JavaScript. Blur placeholders are not supported this way.
 */
export function Photo(props: Omit<ImageProps, "placeholder">) {
  const { props: img } = getImageProps(props);
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- alt is required by ImageProps
  return <img {...img} />;
}
