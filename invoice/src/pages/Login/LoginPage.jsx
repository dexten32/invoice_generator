import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LayoutDashboard, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

function LoginPage() {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message);
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setError('');
    const result = await googleLogin(credentialResponse.credential);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message);
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.');
  };

  return (
    <div className="login-page">
      {/* Left Panel — Brand */}
      <div className="login-left-panel">
        {/* Decorative blobs */}
        <div className="login-blob login-blob-1" />
        <div className="login-blob login-blob-2" />
        <div className="login-blob login-blob-3" />

        <div className="login-left-content">
          {/* Brand */}
          <div className="login-brand">
            <div className="login-brand-icon">
              <LayoutDashboard className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="login-brand-name">
                Invo<span>Gen</span>
              </h1>
              <p className="login-brand-tagline">Workspace Pro</p>
            </div>
          </div>

          {/* Headline */}
          <div className="login-headline">
            <h2 className="login-headline-title">
              Create beautiful<br />
              invoices in minutes.
            </h2>
            <p className="login-headline-sub">
              Your professional invoicing workspace. Manage customers, products, and documents — all in one place.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="login-features">
            {['PDF Export', 'Client Management', 'Product Catalog', 'Live Preview'].map((f) => (
              <span key={f} className="login-feature-pill">{f}</span>
            ))}
          </div>
        </div>

        {/* Bottom Quote */}
        <div className="login-left-footer">
          <div className="login-quote">
            <p className="login-quote-text">"The slickest invoicing tool I've used. My clients are impressed every time."</p>
            <p className="login-quote-author">— A happy user</p>
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="login-right-panel">
        <div className="login-form-container">
          <div className="login-form-header">
            <h2 className="login-form-title">Welcome back</h2>
            <p className="login-form-sub">Sign in to your workspace</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="login-error">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            {/* Email Field */}
            <div className="login-field">
              <label className={`login-label ${email || emailFocused ? 'login-label-active' : ''}`}>
                Email Address
              </label>
              <div className="login-input-wrap">
                <Mail className={`login-input-icon ${emailFocused ? 'login-input-icon-active' : ''}`} />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  placeholder="name@example.com"
                  className="login-input"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="login-field">
              <label className={`login-label ${password || passwordFocused ? 'login-label-active' : ''}`}>
                Password
              </label>
              <div className="login-input-wrap">
                <Lock className={`login-input-icon ${passwordFocused ? 'login-input-icon-active' : ''}`} />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder="••••••••"
                  className="login-input login-input-pw"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="login-pw-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              className="login-btn"
            >
              {isLoading ? (
                <>
                  <span className="login-spinner" />
                  <span>Signing in…</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5 login-btn-arrow" />
                </>
              )}
            </button>
          </form>

          <div className="login-separator">
            <span>or continue with</span>
          </div>

          <div className="login-google-wrap">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme="outline"
              size="large"
              width="100%"
            />
          </div>

        </div>
      </div>
    </div>
  );
}

export default LoginPage;
