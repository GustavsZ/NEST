"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-nest-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-2xl font-semibold tracking-tight text-nest-primary">
            nest
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-nest-accent inline-block ml-0.5 mb-1" />
        </div>

        <Card className="bg-nest-surface border border-[rgba(255,255,255,0.08)] rounded-[14px]">
          <CardHeader className="pb-2 pt-6 px-6">
            <h1 className="text-lg font-medium text-nest-primary">Create your account</h1>
            <p className="text-sm text-nest-secondary mt-1">
              Get your system live in under 10 minutes.
            </p>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <form onSubmit={handleSignup} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-medium uppercase tracking-widest text-nest-muted">
                  Work email
                </label>
                <Input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-nest-surface-2 border-[rgba(255,255,255,0.14)] text-nest-primary placeholder:text-nest-muted focus-visible:ring-nest-accent h-10 text-sm rounded-[10px]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-medium uppercase tracking-widest text-nest-muted">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="bg-nest-surface-2 border-[rgba(255,255,255,0.14)] text-nest-primary placeholder:text-nest-muted focus-visible:ring-nest-accent h-10 text-sm rounded-[10px]"
                />
              </div>

              {error && (
                <p className="text-nest-danger text-sm">{error}</p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-nest-accent hover:bg-nest-accent/90 text-white rounded-[10px] h-10 text-sm font-medium mt-2 transition-colors duration-150"
              >
                {loading ? "Creating account..." : "Get started free"}
              </Button>
            </form>

            <p className="text-center text-sm text-nest-secondary mt-5">
              Already have an account?{" "}
              <Link href="/login" className="text-nest-accent hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-nest-muted mt-4">
          By signing up you agree to Captomatic&apos;s Terms of Service.
        </p>
      </div>
    </div>
  );
}
