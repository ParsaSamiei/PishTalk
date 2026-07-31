"use client";

import * as React from "react";

import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import type { FaqFormValues } from "@/features/admin/types/faqForm";

interface FaqFormProps {
  readonly defaultValues?: Partial<FaqFormValues>;
  readonly onSubmit: (values: FaqFormValues) => Promise<{ success: boolean; error?: string }>;
  readonly submitLabel: string;
}

function FaqForm({ defaultValues, onSubmit, submitLabel }: FaqFormProps) {
  const [question, setQuestion] = React.useState(defaultValues?.question ?? "");
  const [answer, setAnswer] = React.useState(defaultValues?.answer ?? "");
  const [questionEn, setQuestionEn] = React.useState(defaultValues?.questionEn ?? "");
  const [answerEn, setAnswerEn] = React.useState(defaultValues?.answerEn ?? "");
  const [sortOrder, setSortOrder] = React.useState(defaultValues?.sortOrder ?? 0);
  const [published, setPublished] = React.useState(defaultValues?.published ?? true);
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await onSubmit({
      question,
      answer,
      questionEn,
      answerEn,
      sortOrder,
      published,
    });

    setIsSubmitting(false);
    if (!result.success) setError(result.error ?? "خطایی رخ داد.");
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="question">سوال</Label>
        <Input id="question" value={question} onChange={(e) => setQuestion(e.target.value)} required />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="answer">پاسخ</Label>
        <Textarea
          id="answer"
          rows={4}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
        />
      </div>

      {/* English translation. Optional — the public site shows the Persian
          text to English visitors when these are left empty. */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="questionEn">
          سوال (انگلیسی){" "}
          <span className="font-normal text-text-secondary">(اختیاری)</span>
        </Label>
        <Input
          id="questionEn"
          dir="ltr"
          value={questionEn}
          onChange={(e) => setQuestionEn(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="answerEn">
          پاسخ (انگلیسی){" "}
          <span className="font-normal text-text-secondary">(اختیاری)</span>
        </Label>
        <Textarea
          id="answerEn"
          rows={4}
          dir="ltr"
          value={answerEn}
          onChange={(e) => setAnswerEn(e.target.value)}
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="sortOrder">ترتیب نمایش</Label>
          <Input
            id="sortOrder"
            type="number"
            min={0}
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
          />
        </div>
        <label className="mt-7 flex items-center gap-2 text-sm text-text-primary">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="size-4 rounded border-border accent-accent"
          />
          نمایش در سایت
        </label>
      </div>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <Button type="submit" isLoading={isSubmitting} className="self-start">
        {submitLabel}
      </Button>
    </form>
  );
}

export { FaqForm };
