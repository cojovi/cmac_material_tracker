import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/hooks/use-auth";
import { loginSchema, type LoginCredentials } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { ChartLine, LogIn } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const { setUser } = useAuth();
  const [error, setError] = useState<string>("");

  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await apiRequest("POST", "/api/auth/login", credentials);
      return response.json();
    },
    onSuccess: (data) => {
      setUser(data.user);
      setLocation("/");
    },
    onError: (error: any) => {
      setError(error.message || "Login failed");
    },
  });

  const onSubmit = (data: LoginCredentials) => {
    if (loginMutation.isPending) return; // Prevent double submission
    setError("");
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass border-aurora-purple/30">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <ChartLine className="h-12 w-12 text-aurora-cyan" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">CMACMaterialTracker</CardTitle>
          <CardDescription className="text-gray-300">
            Sign in to access the material pricing dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert className="border-aurora-red/50 bg-aurora-red/10">
                <AlertDescription className="text-aurora-red">{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                className="bg-white/90 border-aurora-purple/30 text-black placeholder-gray-500 focus:border-aurora-cyan focus:ring-aurora-cyan/20"
                placeholder="Enter your email"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-aurora-red text-sm">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                className="bg-white/90 border-aurora-purple/30 text-black placeholder-gray-500 focus:border-aurora-cyan focus:ring-aurora-cyan/20"
                placeholder="Enter your password"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-aurora-red text-sm">{form.formState.errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-aurora-cyan hover:bg-aurora-bright-cyan text-aurora-navy font-semibold"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <LoadingSpinner className="mr-2 h-4 w-4" />
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
