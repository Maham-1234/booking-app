import { useEffect } from "react";
import { useForm, FormProvider, type SubmitHandler } from "react-hook-form";
import { useEvents } from "@/contexts/EventContext";
import type { Event, EventFormValues, UpdateEventData } from "@/types";

// Reusable Components
import EventForm from "./EventForm";

// UI Components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface UpdateEventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

const toDateTimeLocal = (date: Date): string => {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

export default function UpdateEventModal({
  event,
  isOpen,
  onClose,
}: UpdateEventModalProps) {
  const { updateEvent, error: apiError } = useEvents();

  const methods = useForm<EventFormValues>();
  const {
    reset,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (event) {
      reset({
        title: event.title,
        description: event.description ?? undefined,
        location: event.location,
        eventDate: toDateTimeLocal(new Date(event.eventDate)),
        price: event.price,
        totalSeats: event.totalSeats,
        imageUrl: event.image ?? undefined,
      });
    }
  }, [event, isOpen, reset]);

  const onSubmit: SubmitHandler<EventFormValues> = async (data) => {
    if (!event) return;

    try {
      const eventData: UpdateEventData = {
        ...data,
        eventDate: new Date(data.eventDate).toISOString(),
      };
      await updateEvent(event.id, eventData);
      onClose();
    } catch (err) {
      console.error("Failed to update event:", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Make changes to your event here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {apiError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}

          <FormProvider {...methods}>
            <EventForm
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
              submitButtonText="Save Changes"
            />
          </FormProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
}
