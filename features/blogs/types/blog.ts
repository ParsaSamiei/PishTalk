export interface BlogSummary {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly coverImage: string | null;
  readonly categoryName: string | null;
  readonly readingTime: number | null;
  readonly publishedAt: Date | null;
}
