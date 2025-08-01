import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
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
import { Calendar, Mail, AlertCircle } from "lucide-react";

import { AuthLayout } from "@/components/PageComponents/AuthLayout";
import { WelcomePanel } from "@/components/PageComponents/WelcomePanel";
import { GoogleAuthButton } from "@/components/PageComponents/GoogleAuthButton";
import { SeparatorWithText } from "@/components/PageComponents/SeperatorWithText";
import { PasswordInput } from "@/components/PageComponents/PasswordInput";

import { useAuth } from "@/contexts/AuthContext";
import type { LoginData } from "@/types";

const LoginPage = () => {
  const {
    login,
    isLoading,
    error: authError,
    clearError,
    isAuthenticated,
  } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<LoginData>();

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

  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    clearError();
    try {
      await login(data);
    } catch (err) {
      console.error("Login failed:", err);
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
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
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

          <SeparatorWithText>Or continue with</SeparatorWithText>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                placeholder="Enter your password"
                disabled={isLoading}
                {...register("password", { required: "Password is required" })}
                onChange={handleInputChange}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <Link
                to="/forgot-password"
                className="text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full rounded-2xl"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              Don't have an account?{" "}
            </span>
            <Link
              to="/register"
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default LoginPage;
