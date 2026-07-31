export type EventStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED" | "CANCELLED";

export interface EventTimelineItem {
  readonly id: string;
  readonly time: string;
  readonly title: string;
  readonly titleEn: string | null;
  readonly description: string | null;
  readonly descriptionEn: string | null;
  readonly sortOrder: number;
}

export interface EventSummary {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly titleEn: string | null;
  readonly subtitle: string | null;
  readonly subtitleEn: string | null;
  readonly coverImage: string | null;
  readonly date: Date;
  readonly startTime: string;
  readonly location: string;
  readonly locationEn: string | null;
  readonly status: EventStatus;
}

export interface EventDetail extends EventSummary {
  readonly description: string;
  readonly descriptionEn: string | null;
  readonly endTime: string | null;
  readonly speakerName: string | null;
  readonly speakerNameEn: string | null;
  readonly speakerBio: string | null;
  readonly speakerBioEn: string | null;
  readonly timeline: readonly EventTimelineItem[];
}
