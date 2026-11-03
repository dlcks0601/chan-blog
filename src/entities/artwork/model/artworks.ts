/** Collection 에 걸리는 작품 한 점. 작품마다 페이지는 따로 만든다(/collection/[slug]). */
export interface Artwork {
  slug: string;
  title: string;
  medium: string;
  year: number;
}

export const ARTWORKS = [
  { slug: 'logo', title: 'logo', medium: 'Pixel letters, motion', year: 2026 },
] as const satisfies readonly Artwork[];

export type ArtworkSlug = (typeof ARTWORKS)[number]['slug'];

export function getArtwork(slug: ArtworkSlug): Artwork {
  return ARTWORKS.find(artwork => artwork.slug === slug)!;
}
