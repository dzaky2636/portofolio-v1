/** Main page section ids — order matches nav / scroll chapters. */
export const MAIN_SECTION_IDS = [
  'profile',
  'inventory',
  'realms',
  'logs',
  'contact',
] as const;

export type MainSectionId = (typeof MAIN_SECTION_IDS)[number];
