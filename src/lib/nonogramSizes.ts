export const RANDOM_SIZES = [5, 8, 10] as const;
export type RandomSize = (typeof RANDOM_SIZES)[number];
