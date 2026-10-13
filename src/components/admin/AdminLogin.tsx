import React, { useState } from 'react';
import { Shield, Lock, Mail, Eye, EyeOff, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { adminLogin, AdminUser } from '../../lib/api';

interface AdminLoginProps {
  onLoginSuccess: (admin: AdminUser) => void;
  onBackToPublicSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToPublicSite,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ username?: string; password?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    const errors: { username?: string; password?: string } = {};
    if (!username.trim()) {
      errors.username = 'Please enter your administrative email or username.';
    }
    if (!password) {
      errors.password = 'Please enter your password.';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    setIsLoading(true);

    try {
      const response = await adminLogin(username.trim(), password);

      if (response.success && response.admin) {
        onLoginSuccess(response.admin);
      } else {
        setErrorMessage(
          response.message || 'Invalid administrative credentials. Please verify your email and password.'
        );
      }
    } catch {
      setErrorMessage('Network error during authentication. Please ensure the backend server is reachable.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between text-slate-100 px-4 py-8 sm:px-6 lg:px-8 selection:bg-teal-600 selection:text-white">
      {/* Top Bar with Return to Public Site */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <button
          onClick={onBackToPublicSite}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800"
        >
          <ArrowLeft className="w-4 h-4 text-teal-400" />
          <span>Return to Public Website</span>
        </button>

        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
          <Shield className="w-3.5 h-3.5 text-teal-500" />
          <span>Internal Security Zone</span>
        </div>
      </div>

      {/* Center Auth Card */}
      <div className="max-w-md w-full mx-auto my-auto py-10">
        <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-800/90 rounded-2xl shadow-2xl p-8 sm:p-10 relative overflow-hidden">
          {/* Subtle Top Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-teal-400 to-emerald-500" />

          {/* Header & Official Logo Branding */}
          <div className="text-center mb-8">
            <div className="inline-block bg-white p-2.5 rounded-2xl shadow-lg border border-slate-700/80 mb-4">
              <img
                src="/assets/chennaichemicalindustries_logo.png"
                alt="Chennai Chemical Industries"
                className="h-10 w-auto object-contain"
              />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Chennai Chemical Industries
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Quotation Management & Commercial Administration
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-start gap-3 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed flex-1">{errorMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username / Email */}
            <div>
              <label
                htmlFor="admin-username"
                className="block text-xs font-semibold text-slate-300 mb-1.5"
              >
                Administrative Email / Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="admin-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (validationErrors.username) {
                      setValidationErrors((prev) => ({ ...prev, username: undefined }));
                    }
                  }}
                  placeholder="admin@chennaichemicals.com"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all ${
                    validationErrors.username
                      ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                      : 'border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
                  }`}
                  disabled={isLoading}
                />
              </div>
              {validationErrors.username && (
                <p className="mt-1 text-[11px] text-red-400">{validationErrors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-semibold text-slate-300"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationErrors.password) {
                      setValidationErrors((prev) => ({ ...prev, password: undefined }));
                    }
                  }}
                  placeholder="••••••••••••"
                  className={`w-full pl-10 pr-11 py-2.5 bg-slate-950/80 border rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all ${
                    validationErrors.password
                      ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                      : 'border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500'
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-slate-400 hover:text-teal-300" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-400 hover:text-teal-300" />
                  )}
                </button>
              </div>
              {validationErrors.password && (
                <p className="mt-1 text-[11px] text-red-400">{validationErrors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white text-xs font-semibold shadow-md shadow-teal-900/40 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 text-teal-200" />
                  <span>Sign In to Admin Portal</span>
                </>
              )}
            </button>
          </form>

          {/* Security Policy Notice */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Restricted enterprise system. Authorized commercial personnel only. Public user registration is disabled.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Baseline */}
      <div className="max-w-6xl w-full mx-auto text-center text-[11px] text-slate-400">
        © {new Date().getFullYear()} Chennai Chemical Industries. Commercial Operations Division.
      </div>
    </div>
  );
};
