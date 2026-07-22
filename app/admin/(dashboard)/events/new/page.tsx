"use client";

import { EventForm } from "@/features/admin/components/EventForm";
import { createEvent } from "@/features/admin/actions/eventActions";
import type { EventFormValues } from "@/features/admin/types/eventForm";

export default function NewEventPage() {
  async function handleSubmit(values: EventFormValues) {
    return createEvent(values);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">رویداد جدید</h1>
        <p className="text-text-secondary">اطلاعات رویداد را وارد کنید</p>
      </div>
      <EventForm onSubmit={handleSubmit} submitLabel="ایجاد رویداد" />
    </div>
  );
}
