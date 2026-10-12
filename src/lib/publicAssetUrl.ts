/** Root-absolute URL for files in `/public` (avoids `/en/...` resolution under locale routes). */
export function publicAssetUrl(pathFromPublicRoot: string): string {
  const path = pathFromPublicRoot.startsWith('/')
    ? pathFromPublicRoot
    : `/${pathFromPublicRoot}`;

  if (typeof window === 'undefined') {
    return path;
  }

  return `${window.location.origin}${path}`;
}
