import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogIn } from "lucide-react";
import type React from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface RequireAuthProps {
  children: React.ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const { login, loginStatus, identity, isInitializing } =
    useInternetIdentity();

  const isAuthenticated = !!identity;

  if (isInitializing) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle>Login Required</CardTitle>
            <CardDescription>
              You need to be logged in to access this page
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Button
              onClick={login}
              disabled={loginStatus === "logging-in"}
              size="lg"
              className="w-full"
            >
              <LogIn className="mr-2 h-5 w-5" />
              {loginStatus === "logging-in"
                ? "Logging in..."
                : "Login with Internet Identity"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
