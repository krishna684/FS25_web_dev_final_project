import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, Github, Chrome, Eye, EyeOff, Loader2, CheckCircle, XCircle } from "lucide-react"; // Chrome as Google placeholder
import Logo from "../components/common/Logo";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const emailRef = useRef(null);

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Auto-focus email field on mount
  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));

    // Real-time validation
    if (name === "email") {
      if (value && !validateEmail(value)) {
        setEmailError("Please enter a valid email address");
      } else {
        setEmailError("");
      }
    }

    if (name === "password") {
      if (value && value.length < 6) {
        setPasswordError("Password must be at least 6 characters");
      } else {
        setPasswordError("");
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && form.email && form.password && !isLoading) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEmailError("");
    setPasswordError("");

    // Validate before submitting
    if (!validateEmail(form.email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (!form.password) {
      setPasswordError("Password is required");
      return;
    }

    setIsLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed", err);
      setError("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="text-center mb-8">
          <div className="mb-6">
            <Logo size="large" />
          </div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Enter your credentials to access your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm border border-red-200">
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                ref={emailRef}
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`form-input ${emailError ? 'border-red-500' : ''}`}
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                placeholder="you@example.com"
                required
                disabled={isLoading}
              />
              {form.email && (
                <div className="absolute right-3 top-3">
                  {emailError ? (
                    <XCircle size={18} className="text-red-500" />
                  ) : (
                    <CheckCircle size={18} className="text-green-500" />
                  )}
                </div>
              )}
            </div>
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>

          <div className="form-group">
            <div className="flex justify-between items-center mb-2">
              <label className="form-label mb-0">Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.875rem', color: 'var(--primary)', textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className={`form-input ${passwordError ? 'border-red-500' : ''}`}
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>

          <div className="form-group flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ width: 16, height: 16 }}
              disabled={isLoading}
            />
            <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">Remember me for 30 days</label>
          </div>

          <button className="btn btn-primary btn-block mb-4 flex items-center justify-center" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin mr-2" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>

          <div className="text-center my-6">
            <span className="text-sm text-gray-500">Or continue with</span>
          </div>

          <div className="grid-2 mb-6">
            <button
              type="button"
              className="btn btn-secondary justify-center opacity-50 cursor-not-allowed"
              disabled
              title="OAuth integration coming soon"
            >
              <Chrome size={18} /> Google
            </button>
            <button
              type="button"
              className="btn btn-secondary justify-center opacity-50 cursor-not-allowed"
              disabled
              title="OAuth integration coming soon"
            >
              <Github size={18} /> GitHub
            </button>
          </div>

          <div className="text-center text-xs text-gray-500 mb-4">
            Press Enter ↵ to sign in
          </div>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
