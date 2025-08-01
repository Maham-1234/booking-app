import { useEffect, useRef, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import type { UpdateProfileData } from "@/types"; 
import ProfileSectionCard from "@/components/PageComponents/ProfileSectionCard";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, AlertCircle, KeyRound, User as UserIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

type ProfileFormValues = {
  name: string;
  currentPassword?: string;
  newPassword?: string;
};

export default function ProfilePage() {
  const {
    user,
    isLoading,
    error,
    updateProfile,
    uploadAvatar,
    deleteAvatar,
    clearError,
  } = useAuth();

  const avatarFileRef = useRef<HTMLInputElement>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch, 
    formState: { errors, isSubmitting, isDirty }, 
  } = useForm<ProfileFormValues>();

  const newPasswordValue = watch("newPassword");

  useEffect(() => {
    if (user) {
      reset({ name: user.name });
    }
  }, [user, reset]);

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const onProfileUpdate: SubmitHandler<ProfileFormValues> = async (data) => {
    clearError();
    setSuccessMessage(null);
    try {
      const updateData: UpdateProfileData = { name: data.name };
      if (data.currentPassword && data.newPassword) {
        updateData.currentPassword = data.currentPassword;
        updateData.newPassword = data.newPassword;
      }

      await updateProfile(updateData);
      setSuccessMessage("Profile updated successfully!");
      reset({ name: data.name, currentPassword: "", newPassword: "" }); 
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      console.error("Profile update failed:", err);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      clearError();
      setSuccessMessage(null);
      try {
        await uploadAvatar(file);
        setSuccessMessage("Avatar updated successfully!");
        setTimeout(() => setSuccessMessage(null), 4000);
      } catch (err) {
        console.error("Avatar upload failed:", err);
      }
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
        <p className="text-muted-foreground mb-8">
          Manage your profile, password, and account settings.
        </p>

        {/* General Error/Success Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {successMessage && (
          <Alert
            variant="default"
            className="mb-6 bg-green-500/10 border-green-500/50 text-green-700"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Avatar */}
          <div className="md:col-span-1 space-y-4 items-center">
            <h2 className="text-lg font-semibold">Profile Picture</h2>
            <Avatar className="w-40 h-40 border-4 border-primary/20 iterms-center">
              <AvatarImage src={`http://localhost:3000/uploads/avatars/${user.avatar}`} alt={user.name} p-2 m-2 />
              <AvatarFallback className="text-4xl bg-muted">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <input
              type="file"
              ref={avatarFileRef}
              onChange={handleAvatarUpload}
              className="hidden"
              accept="image/png, image/jpeg"
            />
            <div className="flex flex-col space-y-2">
              <Button
                onClick={() => avatarFileRef.current?.click()}
                disabled={isLoading}
              >
                {isLoading && isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}{" "}
                Change Avatar
              </Button>
              <Button
                variant="ghost"
                onClick={deleteAvatar}
                disabled={isLoading || !user.avatar}
              >
                Remove
              </Button>
            </div>
          </div>

          {/* Right Column: Main Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit(onProfileUpdate)}>
              <ProfileSectionCard
                title="Profile & Security"
                description="Update your personal details and password here."
                footer={
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading || !isDirty}>
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : null}
                      Save Changes
                    </Button>
                  </div>
                }
              >
                <div className="space-y-6">
                  {/* Personal Info Section */}
                  <div>
                    <h3 className="text-lg font-medium flex items-center mb-4">
                      <UserIcon className="w-5 h-5 mr-3 text-primary" />
                      Personal Information
                    </h3>
                    <div className="space-y-4 pl-8 border-l-2 border-primary/20">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          {...register("name", {
                            required: "Name is required",
                          })}
                        />
                        {errors.name && (
                          <p className="text-sm text-red-500">
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={user.email}
                          disabled
                          className="bg-muted/50 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Password Section */}
                  <div>
                    <h3 className="text-lg font-medium flex items-center mb-4">
                      <KeyRound className="w-5 h-5 mr-3 text-primary" />
                      Change Password
                    </h3>
                    <div className="space-y-4 pl-8 border-l-2 border-primary/20">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">
                          Current Password
                        </Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          placeholder="Leave blank to keep current password"
                          {...register("currentPassword", {
                            // This field is only required if the newPassword field has a value
                            validate: (value) =>
                              !!newPasswordValue
                                ? !!value ||
                                  "Current password is required to set a new one"
                                : true,
                          })}
                        />
                        {errors.currentPassword && (
                          <p className="text-sm text-red-500">
                            {errors.currentPassword.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder="Leave blank to keep current password"
                          {...register("newPassword", {
                            minLength: {
                              value: 8,
                              message: "Password must be at least 8 characters",
                            },
                          })}
                        />
                        {errors.newPassword && (
                          <p className="text-sm text-red-500">
                            {errors.newPassword.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </ProfileSectionCard>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
