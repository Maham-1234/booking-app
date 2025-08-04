import { useForm, FormProvider, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '@/contexts/EventContext';
import type { EventFormValues, CreateEventData } from '@/types';

import EventForm from '@/components/PageComponents/event/EventForm';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function CreateEventPage() {
  const navigate = useNavigate();
  const { createEvent, error: apiError } = useEvents();
  
  // 1. Initialize react-hook-form
  const methods = useForm<EventFormValues>();
  const { formState: { isSubmitting } } = methods;

  // 2. Define the submit handler
  const onSubmit: SubmitHandler<EventFormValues> = async (data) => {
    try {
      // The API expects `eventDate` as a Date object, so we convert it
      const eventData: CreateEventData = {
        ...data,
        eventDate: new Date(data.eventDate).toISOString(),
      };

      const response = await createEvent(eventData);
      
      if (response?.data?.event?.id) {
        navigate(`/events/${response.data.event.id}`);
      } else {
         navigate('/admin/dashboard'); 
      }

    } catch (err) {
      console.error("Failed to create event:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight">Create New Event</h1>
            <p className="text-lg text-muted-foreground mt-2">Bring your next great idea to life.</p>
        </div>

        {apiError && (
            <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{apiError}</AlertDescription>
            </Alert>
        )}

        <FormProvider {...methods}>
          <EventForm 
            onSubmit={onSubmit} 
            isSubmitting={isSubmitting} 
            submitButtonText="Create Event"
          />
        </FormProvider>
      </div>
    </div>
  );
}