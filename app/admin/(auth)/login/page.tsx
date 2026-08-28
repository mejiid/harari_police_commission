"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";

interface FormErrors {
  email?: string;
  password?: string;
  submit?: string;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Clear field error when user starts typing
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const result = await signIn.email(
        { email, password },
        {
          onRequest: () => {
            // Called when request starts
          },
          onSuccess: () => {
            // Redirect on success
            router.push("/admin/dashboard");
          },
          onError: (ctx) => {
            // Handle specific error cases
            if (ctx.error.status === 401 || ctx.error.code === "INVALID_PASSWORD") {
              setErrors({
                submit: "Invalid email or password. Please try again.",
              });
            } else if (ctx.error.code === "USER_NOT_FOUND") {
              setErrors({
                submit: "No account found with this email address.",
              });
            } else if (ctx.error.code === "EMAIL_NOT_VERIFIED") {
              setErrors({
                submit: "Please verify your email before logging in.",
              });
            } else if (ctx.error.code === "USER_DISABLED") {
              setErrors({
                submit: "Your account has been disabled. Contact support.",
              });
            } else {
              setErrors({
                submit:
                  ctx.error.message ||
                  "An error occurred during login. Please try again.",
              });
            }
            setLoading(false);
          },
        }
      );
    } catch (error) {
      console.error("Login error:", error);
      setErrors({
        submit: "An unexpected error occurred. Please try again later.",
      });
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-sm p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold mb-3">
            PPC
          </div>
          <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
          <p className="text-sm text-text-muted mt-1">Prison Police Commission</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              disabled={loading}
              placeholder="admin@prisoncommission.gov.et"
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-colors ${
                errors.email
                  ? "border-error focus:ring-error"
                  : "border-border focus:ring-accent"
              } disabled:bg-gray-100 disabled:cursor-not-allowed`}
            />
            {errors.email && (
              <p className="text-error text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              disabled={loading}
              placeholder="••••••••"
              className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-colors ${
                errors.password
                  ? "border-error focus:ring-error"
                  : "border-border focus:ring-accent"
              } disabled:bg-gray-100 disabled:cursor-not-allowed`}
            />
            {errors.password && (
              <p className="text-error text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit/General Error */}
          {errors.submit && (
            <div className="bg-error/10 border border-error rounded px-3 py-2">
              <p className="text-error text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-semibold py-2.5 rounded hover:bg-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin mr-2">⏳</span>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Help Text */}
        <p className="text-center text-xs text-text-muted mt-6">
          Default credentials: admin@prisoncommission.gov.et / Admin@123456
        </p>
      </div>
    </div>
  );
}
