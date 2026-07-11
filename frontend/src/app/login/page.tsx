"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BadgeCheck, LockKeyhole, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { useFirebase } from "@/utils/Firebase";

export default function LoginPage() {
  const firebase = useFirebase();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (firebase.isLoggedIn) {
      router.push("/");
    }
  }, [firebase.isLoggedIn, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      await firebase.signinUserWithEmailAndPassword(email, password);
      setMessage("Login successful.");
      router.push("/");
    } catch {
      setMessage("Login failed. Please verify your email and password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSubmit = async () => {
    setIsSubmitting(true);
    setMessage("");

    try {
      await firebase.signinUserWithGoogle();
      setMessage("Google sign-in successful.");
      router.push("/");
    } catch {
      setMessage("Google sign-in failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#f5f3ff_0%,_#edf6ff_45%,_#f8fafc_100%)] px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-violet-100 bg-white/95 shadow-[0_25px_90px_-30px_rgba(15,23,42,0.35)] lg:grid-cols-[1fr_1fr]">
        <section className="bg-[linear-gradient(135deg,_#4c1d95_0%,_#7c3aed_45%,_#0891b2_100%)] p-8 text-white">
          <div className="flex h-full flex-col justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                GrowEasy
              </div>
              <h1 className="mt-6 text-4xl font-black leading-tight">Welcome back</h1>
              <p className="mt-3 max-w-md text-sm leading-6 text-violet-100">
                Sign in to your GrowEasy CRM workspace and continue importing, validating, and tracking lead data safely.
              </p>
            </div>

            <div className="space-y-3">
              {[
                "Secure Firebase authentication",
                "Fast access to CRM lead workflows",
                "Professional import and AI-assisted processing",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200" />
                  <span className="text-sm text-white/90">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="p-8">
          <div className="mx-auto max-w-md">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-600">Access portal</p>
              <h2 className="mt-2 text-3xl font-black text-slate-900">Log In</h2>
              <p className="mt-2 text-sm text-slate-600">Use your Firebase account to continue.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Email</span>
                <div className="flex items-center gap-2 rounded-2xl border border-violet-200 bg-white px-3 py-2 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-100">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full bg-transparent text-sm text-slate-900 outline-none"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
                <div className="flex items-center gap-2 rounded-2xl border border-violet-200 bg-white px-3 py-2 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-100">
                  <LockKeyhole className="h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full bg-transparent text-sm text-slate-900 outline-none"
                  />
                </div>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-700 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-transform duration-200 hover:-translate-y-0.5"
              >
                {isSubmitting ? "Please wait..." : "Sign In"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                <span className="h-px flex-1 bg-slate-200" />
                Or continue with
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              <button
                type="button"
                onClick={handleGoogleSubmit}
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Sign In with Google
              </button>

              <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm text-slate-600">
                New to GrowEasy?{' '}
                <Link href="/sign-up" className="font-semibold text-violet-700 hover:text-violet-900">
                  Create an account
                </Link>
              </div>
            </div>

            {message && (
              <p className="mt-4 rounded-2xl bg-violet-50 px-4 py-3 text-sm font-medium text-violet-700">
                {message}
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
