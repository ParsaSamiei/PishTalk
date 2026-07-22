"use client";

import { EventForm } from "@/features/admin/components/EventForm";
import { updateEvent } from "@/features/admin/actions/eventActions";
import type { EventFormValues } from "@/features/admin/types/eventForm";

interface EditEventFormProps {
  readonly eventId: string;
  readonly defaultValues: Partial<EventFormValues>;
}

function EditEventForm({ eventId, defaultValues }: EditEventFormProps) {
  async function handleSubmit(values: EventFormValues) {
    return updateEvent(eventId, values);
  }

  return <EventForm defaultValues={defaultValues} onSubmit={handleSubmit} submitLabel="ذخیره تغییرات" />;
}

export { EditEventForm };
