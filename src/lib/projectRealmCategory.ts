export type RealmCategory = 'saas' | 'civic' | 'academic' | 'personal';

export const REALM_CATEGORY_ORDER: RealmCategory[] = [
  'saas',
  'civic',
  'academic',
  'personal',
];

/** Maps localized realm labels to a stable filter bucket. */
export function getProjectRealmCategory(realm: string): RealmCategory | null {
  const r = realm.toLowerCase();
  if (r.includes('saas')) return 'saas';
  if (r.includes('civic') || r.includes('sipil')) return 'civic';
  if (
    r.includes('academic') ||
    r.includes('akademik') ||
    r.includes('campus') ||
    r.includes('kampus')
  ) {
    return 'academic';
  }
  if (r.includes('personal')) return 'personal';
  return null;
}
