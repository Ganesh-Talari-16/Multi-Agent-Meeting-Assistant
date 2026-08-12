import React, { useState } from 'react';
import { LogIn, UserPlus, KeyRound, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { loginUser, registerUser, forgotPassword } from '../utils/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // login, register, forgot
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Member');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

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
        setTimeout(() => onClose(), 1000);
      } else if (mode === 'forgot') {
        const res = await forgotPassword(email);
        setMessage(res.message || `Password reset instructions sent to ${email}`);
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-sky-100 rounded-3xl p-7 w-full max-w-md space-y-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sky-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-sky-600 to-cyan-500 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                {mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Create Account' : 'Reset Password'}
              </h3>
              <span className="text-[11px] text-sky-700 font-semibold">Meeting AI Platform</span>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
        </div>

        {/* Message / Error Alerts */}
        {message && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {message}
          </div>
        )}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full ui-input px-3.5 py-2.5 text-xs"
              />
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Organization Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full ui-input px-3.5 py-2.5 text-xs font-semibold"
              >
                <option value="Admin">Product Lead / Admin</option>
                <option value="Member">Engineering Member</option>
                <option value="Auditor">Executive Auditor</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full ui-btn-primary py-3 text-xs font-bold flex items-center justify-center gap-2"
          >
            {mode === 'login' ? (
              <><LogIn className="w-4 h-4" /> Sign In with JWT</>
            ) : mode === 'register' ? (
              <><UserPlus className="w-4 h-4" /> Register Enterprise Account</>
            ) : (
              <><KeyRound className="w-4 h-4" /> Send Reset Link</>
            )}
          </button>
        </form>

        {/* Footer Mode Switcher */}
        <div className="pt-3 border-t border-sky-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          {mode === 'login' ? (
            <>
              <button onClick={() => setMode('forgot')} className="hover:text-sky-700 underline">Forgot Password?</button>
              <button onClick={() => setMode('register')} className="text-sky-700 font-bold hover:underline">Create Account</button>
            </>
          ) : (
            <button onClick={() => setMode('login')} className="text-sky-700 font-bold hover:underline w-full text-center">
              Back to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
