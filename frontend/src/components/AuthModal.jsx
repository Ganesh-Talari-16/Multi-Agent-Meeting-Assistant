import React, { useState, useEffect } from 'react';
import {
  LogIn,
  UserPlus,
  KeyRound,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Zap,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { loginUser, registerUser, forgotPassword } from '../utils/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialMode = 'login', autoQuickDemo = false }) {
  const [mode, setMode] = useState(initialMode); // 'login', 'register', 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Member');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setMessage('');
      setError('');
      if (autoQuickDemo) {
        handleQuickDemoLogin();
      }
    }
  }, [isOpen, initialMode, autoQuickDemo]);

  if (!isOpen) return null;

  const handleQuickDemoLogin = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const demoEmail = 'alex.chen@company.com';
      const demoPassword = 'Password123!';
      const user = await loginUser(demoEmail, demoPassword);
      setMessage('Welcome to the Demo! Logging you into the workspace...');
      if (onAuthSuccess) onAuthSuccess(user);
      setTimeout(() => onClose(), 600);
    } catch (err) {
      setError('Quick Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      if (mode === 'login') {
        const user = await loginUser(email, password);
        if (onAuthSuccess) onAuthSuccess(user);
        onClose();
      } else if (mode === 'register') {
        await registerUser(email, password, fullName, role);
        setMessage("Account registered successfully! Logging you in...");
        const user = await loginUser(email, password);
        if (onAuthSuccess) onAuthSuccess(user);
        setTimeout(() => onClose(), 800);
      } else if (mode === 'forgot') {
        const res = await forgotPassword(email);
        setMessage(res.message || `Password reset instructions sent to ${email}`);
      }
    } catch (err) {
      setError(err.message || "An error occurred during authentication");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200/90 rounded-3xl p-7 w-full max-w-md space-y-5 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Decorative Glow Pill */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-sky-400/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-sky-600/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                {mode === 'login' ? 'Sign In to Workspace' : mode === 'register' ? 'Create Enterprise Account' : 'Reset Password'}
              </h3>
              <span className="text-[11px] text-sky-700 font-semibold">Multi-Agent Meeting Platform</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold text-xs flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Auth Mode Tabs Switcher */}
        {mode !== 'forgot' && (
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100/80 border border-slate-200/60 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); setMessage(''); }}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                mode === 'login'
                  ? 'bg-white text-sky-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); setMessage(''); }}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                mode === 'register'
                  ? 'bg-white text-sky-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>
        )}

        {/* Message / Error Alerts */}
        {message && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{message}</span>
          </div>
        )}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Chen"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full ui-input px-3.5 py-2.5 text-xs"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Work Email *</label>
            <input
              type="email"
              required
              placeholder="alex.chen@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full ui-input px-3.5 py-2.5 text-xs"
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full ui-input px-3.5 py-2.5 text-xs pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Organization Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full ui-input px-3.5 py-2.5 text-xs font-semibold text-slate-800"
              >
                <option value="Admin">Product Lead / Workspace Admin</option>
                <option value="Member">Engineering Member</option>
                <option value="Auditor">Executive Auditor</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full ui-btn-primary py-3 text-xs font-bold flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin" /> Authenticating...
              </span>
            ) : mode === 'login' ? (
              <><LogIn className="w-4 h-4" /> Sign In to Workspace</>
            ) : mode === 'register' ? (
              <><UserPlus className="w-4 h-4" /> Create Enterprise Account</>
            ) : (
              <><KeyRound className="w-4 h-4" /> Send Reset Instructions</>
            )}
          </button>
        </form>

        {/* Footer Mode Switcher */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          {mode === 'login' ? (
            <>
              <button
                type="button"
                onClick={() => { setMode('forgot'); setError(''); setMessage(''); }}
                className="hover:text-sky-700 underline text-slate-500"
              >
                Forgot Password?
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setError(''); setMessage(''); }}
                className="text-sky-700 font-bold hover:underline"
              >
                Need an Account? Register
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); setMessage(''); }}
              className="text-sky-700 font-bold hover:underline w-full text-center"
            >
              Back to Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
