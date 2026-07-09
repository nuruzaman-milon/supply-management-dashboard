"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2, Zap } from "lucide-react";
import { login } from "../actions/auth.actions";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await login(email, password);
      const redirect = new URLSearchParams(window.location.search).get(
        "redirect"
      );
      router.push(redirect || "/dashboard");
    } catch (error) {
      console.error("Login failed", error);
      alert((error as Error).message || "Login failed");
    }
    setIsLoading(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background flex items-center justify-center px-4">
      {/* Soft background glow blobs */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 size-150 rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-40 size-125 rounded-full opacity-10 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-105">
        {/* Card */}
        <div className="rounded-2xl border border-border bg-card shadow-2xl shadow-black/5 overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1 w-full bg-primary" />

          <div className="px-8 py-10">
            {/* Logo + heading */}
            <div className="mb-8 flex flex-col items-center text-center gap-4">
              <div
                className="flex size-12 items-center justify-center rounded-xl bg-primary shadow-lg"
                style={{ boxShadow: "0 8px 24px hsl(var(--primary) / 0.35)" }}
              >
                <Zap
                  className="size-6 text-primary-foreground"
                  strokeWidth={2.5}
                />
              </div>
              <div>
                <h1 className="text-[1.6rem] font-bold tracking-tight text-foreground">
                  Sign in
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Enter your credentials to access the dashboard
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-foreground"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all duration-150 hover:border-muted-foreground/40 focus:ring-2 focus:ring-primary/25 focus:border-primary"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-foreground"
                  >
                    Password
                  </label>
                  <a
                    href="/forgot-password"
                    className="text-xs font-medium text-primary hover:underline underline-offset-2 transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 pr-11 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all duration-150 hover:border-muted-foreground/40 focus:ring-2 focus:ring-primary/25 focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2.5">
                <input
                  id="remember"
                  type="checkbox"
                  className="size-4 rounded border-input accent-primary cursor-pointer"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-muted-foreground cursor-pointer select-none"
                >
                  Keep me signed in for 30 days
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all duration-150 hover:bg-primary/90 hover:shadow-lg hover:-translate-y-px active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                style={{ boxShadow: "0 4px 16px hsl(var(--primary) / 0.3)" }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign in to Dashboard"
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="border-t border-border bg-muted/30 px-8 py-4 text-center">
            <p className="text-xs text-muted-foreground">
              Access is restricted to authorized personnel.{" "}
              <a
                href="mailto:admin@company.com"
                className="font-medium text-foreground hover:underline underline-offset-2"
              >
                Contact admin
              </a>{" "}
              for access.
            </p>
          </div>
        </div>

        {/* Bottom label */}
        <p className="mt-5 text-center text-xs text-muted-foreground/60">
          © {new Date().getFullYear()} Aydin Bazar · All rights reserved
        </p>
      </div>
    </div>
  );
}
