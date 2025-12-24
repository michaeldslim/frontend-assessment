/**
 * Converts pixel values to rem units
 * Assumes base font size of 16px
 * @param px - Pixel value to convert
 * @returns String in rem format
 */
export const pxrem = (px: number): string => {
  return `${px / 16}rem`;
};

