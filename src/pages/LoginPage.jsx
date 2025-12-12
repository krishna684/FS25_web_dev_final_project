import { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Github, Chrome, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import Logo from "../components/common/Logo";
import ComingSoonPopup from "../components/common/ComingSoonPopup";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailRef = useRef(null);
  
  const redirectUrl = searchParams.get('redirect');

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (emailRef.current) emailRef.current.focus();
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));

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
    if (e.key === "Enter" && form.email && form.password && !isLoading) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEmailError("");
    setPasswordError("");

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
      // Redirect to the original URL if provided, otherwise go to dashboard
      navigate(redirectUrl ? decodeURIComponent(redirectUrl) : "/dashboard");
    } catch (err) {
      console.error("Login failed", err);
      const msg =
        err.response?.data?.error ||
        err.message ||
        "Invalid credentials. Please try again.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        {/* HEADER – more space & nicer vertical rhythm */}
        <div
          className="flex flex-col items-center text-center mb-10"
          style={{ marginTop: "0.75rem" }}
        >
          <div className="mb-4">
            <Logo size="large" />
          </div>
          <h1 className="auth-title mt-1 mb-3">Welcome back</h1>
          <p className="auth-subtitle">
            Enter your credentials to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded mb-5 text-sm border border-red-200">
              {error}
            </div>
          )}

          {/* EMAIL */}
          <div className="form-group mb-5">
            <label className="form-label">Email Address</label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                ref={emailRef}
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`form-input ${emailError ? "border-red-500" : ""}`}
                style={{ paddingLeft: "2.5rem" }}
                placeholder="you@example.com"
                required
                disabled={isLoading}
              />
            </div>
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>

          {/* PASSWORD – lock on LEFT, eye INSIDE on the RIGHT */}
          <div className="form-group mb-5">
            <label className="form-label mb-2">Password</label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className={`form-input ${
                  passwordError ? "border-red-500" : ""
                }`}
                style={{ paddingLeft: "2.5rem" }}
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-0 right-0 h-full flex items-center justify-center pr-8 text-gray-400 hover:text-gray-600 z-10"
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  width: "auto",
                }}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>

          {/* REMEMBER ME */}
          <div className="form-group mb-5">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ width: 16, height: 16 }}
                disabled={isLoading}
              />
              <label
                htmlFor="remember"
                className="text-sm text-gray-600 cursor-pointer"
              >
                Remember me for 30 days
              </label>
            </div>
          </div>

          {/* SIGN IN */}
          <button
            className="btn btn-primary btn-block flex items-center justify-center"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin mr-2" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>

          {/* FORGOT PASSWORD UNDER BUTTON */}
          <div className="flex justify-end mt-2 mb-6">
            <ComingSoonPopup
              preventDefault
              title="Coming Soon"
              message="Forgot password is coming soon."
              trigger={
                <Link
                  to="/forgot-password"
                  className="text-sm"
                  style={{
                    color: "#ffffff",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  Forgot password?
                </Link>
              }
            />
          </div>

          {/* DIVIDER */}
          <div className="text-center mt-6 mb-4">
            <span className="text-sm text-gray-500">Or continue with</span>
          </div>

          {/* GOOGLE / GITHUB – even spacing */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <ComingSoonPopup
              title="Coming Soon"
              message="Google login is coming soon."
              trigger={
                <button type="button" className="btn btn-secondary justify-center">
                  <Chrome size={18} /> Google
                </button>
              }
            />
            <ComingSoonPopup
              title="Coming Soon"
              message="GitHub login is coming soon."
              trigger={
                <button type="button" className="btn btn-secondary justify-center">
                  <Github size={18} /> GitHub
                </button>
              }
            />
          </div>

          <div className="text-center text-xs text-gray-500 mb-4">
            Press Enter ↵ to sign in
          </div>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              style={{
                color: "#ffffff",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
