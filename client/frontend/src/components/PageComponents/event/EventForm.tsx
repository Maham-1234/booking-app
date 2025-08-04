import { useFormContext } from 'react-hook-form';
import type { EventFormValues } from '@/types'; // We'll define this type next
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface EventFormProps {
  onSubmit: (data: EventFormValues) => void;
  isSubmitting: boolean;
  submitButtonText?: string;
}

export default function EventForm({ onSubmit, isSubmitting, submitButtonText = "Submit" }: EventFormProps) {
  // useFormContext allows us to access the form state provided by a FormProvider wrapper
  const { register, handleSubmit, formState: { errors } } = useFormContext<EventFormValues>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>Fill out the information for your event.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input id="title" {...register("title", { required: "Event title is required." })} />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description", { required: "A short description is required." })} />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...register("location", { required: "Location is required." })} />
            {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="eventDate">Event Date & Time</Label>
            <Input id="eventDate" type="datetime-local" {...register("eventDate", { required: "Event date is required." })} />
            {errors.eventDate && <p className="text-sm text-red-500">{errors.eventDate.message}</p>}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input id="price" type="number" step="0.01" {...register("price", { required: "Price is required.", valueAsNumber: true, min: { value: 0, message: "Price must be positive." } })} />
            {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
          </div>

          {/* Total Seats */}
          <div className="space-y-2">
            <Label htmlFor="totalSeats">Total Seats</Label>
            <Input id="totalSeats" type="number" {...register("totalSeats", { required: "Total seats are required.", valueAsNumber: true, min: { value: 1, message: "There must be at least one seat." } })} />
            {errors.totalSeats && <p className="text-sm text-red-500">{errors.totalSeats.message}</p>}
          </div>

           {/* Image URL */}
           <div className="md:col-span-2 space-y-2">
            <Label htmlFor="image">Image URL (Optional)</Label>
            <Input id="image" placeholder="https://example.com/image.png" {...register("image")} />
            {errors.image && <p className="text-sm text-red-500">{errors.image.message}</p>}
          </div>

          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="rounded-2xl w-full md:w-auto">
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {submitButtonText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}