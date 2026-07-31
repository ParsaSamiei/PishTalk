export interface FaqItem {
  readonly id: string;
  readonly question: string;
  readonly questionEn: string | null;
  readonly answer: string;
  readonly answerEn: string | null;
}
