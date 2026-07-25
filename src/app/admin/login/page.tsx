"use client";

import { useActionState } from "react";
import { login } from "./actions";

type LoginState = { error: string } | undefined;

async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const result = await login(formData);
  return result;
}

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center bg-heather-50 px-6">
      <div className="w-full max-w-sm bg-white rounded-3xl border border-heather-100 shadow-sm p-8">
        <span className="section-label block mb-2">Panel administracyjny</span>
        <h1 className="font-serif text-2xl font-semibold text-stone-900 mb-8">
          Zaloguj się do NURT
        </h1>

        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-600 mb-1.5">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full px-4 py-2.5 rounded-2xl border border-heather-200 text-sm
                         focus:outline-none focus:ring-2 focus:ring-heather-400 focus:border-heather-400
                         transition-all duration-300"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-stone-600 mb-1.5">
              Hasło
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full px-4 py-2.5 rounded-2xl border border-heather-200 text-sm
                         focus:outline-none focus:ring-2 focus:ring-heather-400 focus:border-heather-400
                         transition-all duration-300"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-2xl px-4 py-2.5">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="blob-btn w-full justify-center mt-2 disabled:opacity-60"
          >
            {pending ? "Logowanie…" : "Zaloguj się"}
          </button>
        </form>
      </div>
    </div>
  );
}
