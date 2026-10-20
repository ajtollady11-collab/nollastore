import Image, { type ImageProps } from 'next/image';

/**
 * Thin wrapper around next/image.
 * Photos are served at high quality (90) by default: fabric and fur detail
 * falls apart at the usual 75. SVGs skip optimisation.
 */
export function SmartImage(props: ImageProps) {
  const src = typeof props.src === 'string' ? props.src : '';
  return <Image {...props} alt={props.alt} quality={props.quality ?? 90} unoptimized={props.unoptimized ?? src.endsWith('.svg')} />;
}
