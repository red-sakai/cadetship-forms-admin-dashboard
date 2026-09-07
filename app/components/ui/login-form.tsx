"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

type LoginState = {
  ok: boolean;
  message: string;
};

type LoginFormProps = {
  action: (prevState: LoginState, formData: FormData) => Promise<LoginState>;
};

const initialState: LoginState = {
  ok: false,
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="login-submit anim"
      style={{ animationDelay: "220ms" }}
      disabled={pending}
    >
      {pending ? "Signing in..." : "Sign in"}
    </button>
  );
}

export default function LoginForm({ action }: LoginFormProps) {
  const [state, formAction] = useFormState(action, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      className="login-form"
      action={formAction}
      onKeyDown={(event) => {
        if (event.key === "Enter" && event.target instanceof HTMLInputElement) {
          event.preventDefault();
          event.currentTarget.requestSubmit();
        }
      }}
    >
      <div className="login-field anim" style={{ animationDelay: "100ms" }}>
        <label htmlFor="login-email">Email address</label>
        <div className="login-input-wrap">
          <span className="login-input-icon" aria-hidden="true">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-10 5L2 7" />
            </svg>
          </span>
          <input
            id="login-email"
            type="email"
            name="email"
            placeholder="you@company.com"
            autoComplete="email"
            required
          />
        </div>
      </div>

      <div className="login-field anim" style={{ animationDelay: "160ms" }}>
        <label htmlFor="login-password">Password</label>
        <div className="login-input-wrap">
          <span className="login-input-icon" aria-hidden="true">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </span>
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            className="login-input-action"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {showPassword ? (
                <>
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 11 8 11 8a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 1 12s4 8 11 8a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </>
              ) : (
                <>
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {state.message ? (
        <p
          className={`login-message ${state.ok ? "success" : "error"}`}
          role="status"
          aria-live="polite"
        >
          {state.message}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}