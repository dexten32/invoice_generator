import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, AlertCircle, Lock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import './SetupPasswordModal.css';

function getStrength(val) {
  if (!val) return null;
  let score = 0;
  if (val.length >= 6) score++;
  if (val.length >= 10) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  const levels = [
    { width: '20%', color: '#E24B4A', label: 'Too weak' },
    { width: '40%', color: '#EF9F27', label: 'Weak' },
    { width: '60%', color: '#EF9F27', label: 'Fair' },
    { width: '80%', color: '#1D9E75', label: 'Strong' },
    { width: '100%', color: '#1D9E75', label: 'Very strong' },
  ];
  return levels[Math.min(score - 1, 4)];
}

function SetupPasswordModal() {
  const { user, tempPassword, setupPassword } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fallbackPassword = React.useMemo(() => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+={}[]:'<>,.?/\|`~";
    return Array.from({ length: 12 }, () => charset.charAt(Math.floor(Math.random() * charset.length))).join('');
  }, []);

  if (!user || !user.requiresPasswordSetup) return null;

  const strength = getStrength(newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 6) return setError('Password must be at least 6 characters.');
    if (newPassword !== confirmPassword) return setError('Passwords do not match.');
    setIsLoading(true);
    const result = await setupPassword(newPassword);
    if (!result.success) { setError(result.message); setIsLoading(false); }
  };

  return (
    <div id="setup-password-modal-root">
      <div id="setup-password-modal-backdrop" />

      <div id="setup-password-modal-card">
        <div className="setup-modal-content">
          {/* Header */}
          <div className="setup-modal-header">
            <div className="setup-modal-icon-wrap">
              <Lock className="w-5 h-5 text-slate-800" />
            </div>
            <div>
              <h2 className="setup-modal-title">Secure your account</h2>
              <p className="setup-modal-subtitle">Create a password for workspace access</p>
            </div>
          </div>

          {/* Temp password block */}
          <div className="setup-modal-temp-box">
            <div className="setup-modal-label-row">
              <span className="setup-modal-label">Temporary reference</span>
              <span className="setup-modal-badge">Auto</span>
            </div>
            <code className="setup-modal-code">{tempPassword || fallbackPassword}</code>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-[10px] px-3 py-2.5 mb-4">
              <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span className="text-[12px] text-red-800 font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="setup-modal-form">
            {/* New Password */}
            <div className="setup-modal-field">
              <label className="setup-modal-label" style={{ display: 'block', marginBottom: '10px' }}>
                New password
              </label>
              <div className="setup-modal-input-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  required
                  className="setup-modal-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  tabIndex={-1}
                  className="setup-modal-toggle"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Strength Indicators */}
              <div className="setup-modal-strength-track">
                <div
                  className="setup-modal-strength-bar"
                  style={{ width: strength?.width ?? '0%', backgroundColor: strength?.color }}
                />
              </div>
            </div>

            {/* Separator Line */}
            <div className="setup-modal-divider" />

            {/* Confirm Password */}
            <div className="setup-modal-field" style={{ marginBottom: '2.5rem' }}>
              <label className="setup-modal-label" style={{ display: 'block', marginBottom: '10px' }}>
                Confirm password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                autoComplete="new-password"
                required
                className="setup-modal-input"
              />
            </div>

            {/* CTA Button */}
            <button type="submit" disabled={isLoading} className="setup-modal-submit">
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-200 border-t-slate-400 rounded-full animate-spin" />
                  <span>Processing…</span>
                </>
              ) : (
                <>
                  <span>Finish setup</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="setup-modal-footer">
            <span>256-bit encrypted</span>
            <div className="setup-modal-dot" />
            <span>Workspace 0x{user?.id?.slice(0, 6).toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SetupPasswordModal;