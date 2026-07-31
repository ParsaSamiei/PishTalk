export type ResourceType =
  | "PDF"
  | "PRESENTATION"
  | "GITHUB"
  | "VIDEO"
  | "RESEARCH_PAPER"
  | "EXTERNAL_LINK";

export interface ResourceSummary {
  readonly id: string;
  readonly title: string;
  readonly titleEn: string | null;
  readonly description: string | null;
  readonly descriptionEn: string | null;
  readonly resourceType: ResourceType;
  readonly fileUrl: string | null;
  readonly externalUrl: string | null;
}
