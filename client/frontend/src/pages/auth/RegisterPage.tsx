import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Mail, User, AlertCircle } from "lucide-react";

// Import reusable components
import { AuthLayout } from "@/components/PageComponents/AuthLayout";
import { WelcomePanel } from "@/components/PageComponents/WelcomePanel";
import { GoogleAuthButton } from "@/components/PageComponents/GoogleAuthButton";
import { SeparatorWithText } from "@/components/PageComponents/SeperatorWithText";
import { PasswordInput } from "@/components/PageComponents/PasswordInput";
import { AuthFormLink } from "@/components/PageComponents/AuthFormLink";

import { useAuth } from "@/contexts/AuthContext";
import type { RegisterData } from "@/types";

const RegisterPage = () => {
  const {
    register: registerUser,
    isLoading,
    error: authError,
    clearError,
    isAuthenticated,
  } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<RegisterData>();

  // Watch the password field to validate the confirmation field
  const password = watch("password");

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/user/home", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (authError) {
      setError("root.serverError", { type: "manual", message: authError });
    }
  }, [authError, setError]);

  const handleInputChange = () => {
    if (authError) {
      clearError();
      clearErrors("root.serverError");
    }
  };

  const onSubmit: SubmitHandler<RegisterData> = async (data) => {
    clearError();
    try {
      await registerUser(data);
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  if (isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <AuthLayout aside={<WelcomePanel />}>
      <Card className="w-full max-w-md glass-card border-0">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Create an Account
          </CardTitle>
          <CardDescription>
            Start your journey with EventFlow today
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {errors.root?.serverError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {errors.root.serverError.message}
              </AlertDescription>
            </Alert>
          )}

          <GoogleAuthButton isLoading={isLoading} />
          <SeparatorWithText>Or register with email</SeparatorWithText>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  className="pl-10 rounded-2xl"
                  disabled={isLoading}
                  {...register("name", { required: "Your name is required" })}
                  onChange={handleInputChange}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10 rounded-2xl"
                  disabled={isLoading}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                  onChange={handleInputChange}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                placeholder="Create a password"
                disabled={isLoading}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                onChange={handleInputChange}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Confirm Password</Label>
              <PasswordInput
                id="password_confirmation"
                placeholder="Confirm your password"
                disabled={isLoading}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                onChange={handleInputChange}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full rounded-2xl"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>

          <AuthFormLink
            to="/login"
            promptText="Already have an account?"
            linkText="Sign In"
          />
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default RegisterPage;
