export interface BlogSummary {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly titleEn: string | null;
  readonly excerpt: string;
  readonly excerptEn: string | null;
  readonly coverImage: string | null;
  readonly categoryName: string | null;
  readonly categoryNameEn: string | null;
  readonly readingTime: number | null;
  readonly publishedAt: Date | null;
}
