import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LayoutDashboard, Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

function SignupPage() {
  const { signup, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await signup(name, email, password);

    if (result.success) {
      // After signup, we might want to automatically log them in or redirect to login
      // For now, let's redirect to login with a success state
      navigate('/login', { state: { message: 'Account created successfully! Please sign in.' } });
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
      navigate('/');
    } else {
      setError(result.message);
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google signup failed. Please try again.');
  };

  return (
    <div className="login-page">
      {/* Left Panel — Brand (Reusing Login Styles) */}
      <div className="login-left-panel">
        <div className="login-blob login-blob-1" />
        <div className="login-blob login-blob-2" />
        <div className="login-blob login-blob-3" />

        <div className="login-left-content">
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

          <div className="login-headline">
            <h2 className="login-headline-title">
              Join the future of<br />
              smart invoicing.
            </h2>
            <p className="login-headline-sub">
              Create your account in seconds and start managing your business like a pro.
            </p>
          </div>

          <div className="login-features">
            {['Free Account', 'Instant Access', 'Cloud Sync', 'Secure'].map((f) => (
              <span key={f} className="login-feature-pill">{f}</span>
            ))}
          </div>
        </div>

        <div className="login-left-footer">
          <div className="login-quote">
            <p className="login-quote-text">"Setting up was incredibly easy. I was sending my first invoice in less than 2 minutes."</p>
            <p className="login-quote-author">— New User</p>
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="login-right-panel">
        <div className="login-form-container">
          <div className="login-form-header">
            <h2 className="login-form-title">Create Account</h2>
            <p className="login-form-sub">Start your 14-day free trial</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="login-error">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            {/* Name Field */}
            <div className="login-field">
              <label className={`login-label ${name || nameFocused ? 'login-label-active' : ''}`}>
                Full Name
              </label>
              <div className="login-input-wrap">
                <User className={`login-input-icon ${nameFocused ? 'login-input-icon-active' : ''}`} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                  placeholder="John Doe"
                  className="login-input"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="login-field">
              <label className={`login-label ${email || emailFocused ? 'login-label-active' : ''}`}>
                Email Address
              </label>
              <div className="login-input-wrap">
                <Mail className={`login-input-icon ${emailFocused ? 'login-input-icon-active' : ''}`} />
                <input
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
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder="••••••••"
                  className="login-input login-input-pw"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="login-pw-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="login-btn"
            >
              {isLoading ? (
                <>
                  <span className="login-spinner" />
                  <span>Creating account…</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
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

          <p className="login-signup-link">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
