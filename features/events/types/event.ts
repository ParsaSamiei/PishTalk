export type EventStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED" | "CANCELLED";

export interface EventTimelineItem {
  readonly id: string;
  readonly time: string;
  readonly title: string;
  readonly description: string | null;
  readonly sortOrder: number;
}

export interface EventSummary {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly subtitle: string | null;
  readonly coverImage: string | null;
  readonly date: Date;
  readonly startTime: string;
  readonly location: string;
  readonly status: EventStatus;
}

export interface EventDetail extends EventSummary {
  readonly description: string;
  readonly endTime: string | null;
  readonly speakerName: string | null;
  readonly speakerBio: string | null;
  readonly timeline: readonly EventTimelineItem[];
}
